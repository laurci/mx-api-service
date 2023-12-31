import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Account } from "src/endpoints/accounts/entities/account";
import { SmartContractResult } from "src/endpoints/sc-results/entities/smart.contract.result";
import { TransactionDetailed } from "src/endpoints/transactions/entities/transaction.detailed";
import { TransactionDetailedQuery } from "src/graphql/entities/transaction.detailed/transaction.detailed.query";
import { TransactionDetailedLoader } from "src/graphql/entities/transaction.detailed/transaction.detailed.loader";
import { TransactionLog } from "src/endpoints/transactions/entities/transaction.log";
import { TransactionOperation } from "src/endpoints/transactions/entities/transaction.operation";
import { TransactionService } from "src/endpoints/transactions/transaction.service";

@Resolver(() => TransactionDetailed)
export class TransactionDetailedResolver extends TransactionDetailedQuery {
  constructor(
    private readonly transactionDetailedLoader: TransactionDetailedLoader,
    transactionService: TransactionService
  ) {
    super(transactionService);
  }

  @ResolveField("results", () => [SmartContractResult], { name: "results", description: "Smart contract results for the given detailed transaction.", nullable: true })
  public async getTransactionDetailedSmartContractResults(@Parent() transaction: TransactionDetailed) {
    return await this.transactionDetailedLoader.getSmartContractResults(transaction.txHash);
  }

  @ResolveField("operations", () => [TransactionOperation], { name: "operations", description: "Transaction operations for the given detailed transaction.", nullable: true })
  public async getTransactionDetailedOperations(@Parent() transaction: TransactionDetailed) {
    return await this.transactionDetailedLoader.getOperations(transaction);
  }

  @ResolveField("logs", () => TransactionLog, { name: "logs", description: "Transaction log for the given detailed transaction.", nullable: true })
  public async getTransactionDetailedLog(@Parent() transaction: TransactionDetailed) {
    return await this.transactionDetailedLoader.getLog(transaction.txHash);
  }

  @ResolveField("receiverAccount", () => Account, { name: "receiverAccount", description: "Receiver account for the given detailed transaction." })
  public async getTransactionReceiver(@Parent() transaction: TransactionDetailed) {
    return await this.transactionDetailedLoader.getAccount(transaction.receiver);
  }

  @ResolveField("senderAccount", () => Account, { name: "senderAccount", description: "Sender account for the given detailed transaction." })
  public async getTransactionSender(@Parent() transaction: TransactionDetailed) {
    return await this.transactionDetailedLoader.getAccount(transaction.sender);
  }
}
