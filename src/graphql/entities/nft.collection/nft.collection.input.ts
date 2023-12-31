import { Field, InputType, Float, ID } from "@nestjs/graphql";

import { CollectionFilter } from "src/endpoints/collections/entities/collection.filter";
import { NftType } from "src/endpoints/nfts/entities/nft.type";

@InputType({ description: "Input to retrieve the given NFT collections count for." })
export class GetNftCollectionsCountInput {
  constructor(partial?: Partial<GetNftCollectionsCountInput>) {
    Object.assign(this, partial);
  }

  @Field(() => ID, { name: "search", description: "Collection identifier to retrieve for the given result set.", nullable: true })
  search: string | undefined = undefined;

  @Field(() => [NftType], { name: "type", description: "NFT types list to retrieve for the given result set.", nullable: true })
  type: Array<NftType> | undefined = undefined;

  @Field(() => String, { name: "canBurn", description: "Can burn to retrieve for the given result set.", nullable: true })
  canBurn: string | undefined = undefined;

  @Field(() => String, { name: "canAddQuantity", description: "Can add quantity to retrieve for the given result set.", nullable: true })
  canAddQuantity: string | undefined = undefined;

  @Field(() => String, { name: "canUpdateAttributes", description: "Can update attributes to retrieve for the given result set.", nullable: true })
  canUpdateAttributes: string | undefined = undefined;

  @Field(() => String, { name: "canAddUri", description: "Can add URI to retrieve for the given result set.", nullable: true })
  canAddUri: string | undefined = undefined;

  @Field(() => String, { name: "canTransferRole", description: "Can transfer role to retrieve for the given result set.", nullable: true })
  canTransferRole: string | undefined = undefined;

  @Field(() => Float, { name: "before", description: "Before timestamp to retrieve for the given result set.", nullable: true })
  before: number | undefined = undefined;

  @Field(() => Float, { name: "after", description: "After timestamp to retrieve for the given result set.", nullable: true })
  after: number | undefined = undefined;

  @Field(() => Boolean, { name: "excludeMetaESDT", description: `Do not include collections of type "MetaESDT" in the responsee for the given result set.`, nullable: true })
  excludeMetaESDT: boolean | undefined = undefined;

  public static resolve(input: GetNftCollectionsCountInput): CollectionFilter {
    return new CollectionFilter({
      search: input.search,
      type: input.type,
      before: input.before,
      after: input.after,
      canBurn: input.canBurn,
      canAddQuantity: input.canAddQuantity,
      canUpdateAttributes: input.canUpdateAttributes,
      canAddUri: input.canAddUri,
      canTransferRole: input.canTransferRole,
      excludeMetaESDT: input.excludeMetaESDT,
    });
  }
}

@InputType({ description: "Input to retrieve the given NFT collections for." })
export class GetNftCollectionsInput extends GetNftCollectionsCountInput {
  constructor(partial?: Partial<GetNftCollectionsInput>) {
    super();

    Object.assign(this, partial);
  }

  @Field(() => Float, { name: "from", description: "Number of NFT collections to skip for the given result set.", nullable: true, defaultValue: 0 })
  from: number = 0;

  @Field(() => Float, { name: "size", description: "Number of NFT collections to retrieve for the given result set.", nullable: true, defaultValue: 25 })
  size: number = 25;

  @Field(() => [ID], { name: "identifiers", description: "Collection comma-separated identifiers to retrieve for the given result set.", nullable: true })
  identifiers: Array<string> | undefined = undefined;
}

@InputType({ description: "Input to retrieve the given NFT collection for." })
export class GetNftCollectionInput {
  constructor(partial?: Partial<GetNftCollectionInput>) {
    Object.assign(this, partial);
  }

  @Field(() => ID, { name: "collection", description: "Collection identifier to retrieve the corresponding NFT collection for." })
  collection: string = "";

  public static resolve(input: GetNftCollectionInput): string {
    return input.collection;
  }
}
