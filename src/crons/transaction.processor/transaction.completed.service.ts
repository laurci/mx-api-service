import { CacheService } from "@multiversx/sdk-nestjs-cache";
import { TransactionProcessor } from "@elrondnetwork/transaction-processor";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { CacheInfo } from "src/utils/cache.info";

@Injectable()
export class TransactionCompletedService {
  private transactionProcessor: TransactionProcessor = new TransactionProcessor();
  private isProcessing = false;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly cachingService: CacheService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  ) { }

  @Cron('*/1 * * * * *')
  async handleNewTransactions() {
    if (this.isProcessing) {
      return;
    }

    try {
      await this.transactionProcessor.start({
        gatewayUrl: this.apiConfigService.getGatewayUrl(),
        maxLookBehind: this.apiConfigService.getTransactionCompletedMaxLookBehind(),
        waitForFinalizedCrossShardSmartContractResults: true,
        onTransactionsReceived: async (_, __, transactions) => {
          const transactionsExcludingSmartContractResults = transactions.filter(transaction => !transaction.originalTransactionHash);

          const cacheKeys = transactionsExcludingSmartContractResults.map(transaction => CacheInfo.TransactionPendingResults(transaction.hash).key);
          const hashes: string[] = await this.cachingService.batchGetManyRemote(cacheKeys) as string[];
          const validHashes = hashes.filter(x => x !== null);
          if (validHashes.length > 0) {
            const keys = validHashes.map(hash => CacheInfo.TransactionPendingResults(hash).key);

            await this.cachingService.batchDelCache(keys);
          }

          this.clientProxy.emit('transactionsCompleted', transactionsExcludingSmartContractResults);
        },
        onTransactionsPending: async (_, __, transactions) => {
          await this.cachingService.batchSet(
            transactions.map(transaction => CacheInfo.TransactionPendingResults(transaction.hash).key),
            transactions.map(transaction => transaction.hash),
            transactions.map(transaction => CacheInfo.TransactionPendingResults(transaction.hash).ttl),
            false,
            false,
          );

          this.clientProxy.emit('transactionsPendingResults', transactions);
        },
        getLastProcessedNonce: async (shardId) => {
          return await this.cachingService.get<number>(CacheInfo.TransactionCompletedShardNonce(shardId).key);
        },
        setLastProcessedNonce: async (shardId, nonce) => {
          await this.cachingService.set<number>(CacheInfo.TransactionCompletedShardNonce(shardId).key, nonce, CacheInfo.TransactionCompletedShardNonce(shardId).ttl);
        },
      });
    } finally {
      this.isProcessing = false;
    }
  }
}
