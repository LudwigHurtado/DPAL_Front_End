// Import Buffer to resolve 'Cannot find name Buffer' error in environments without Node.js types.
import { Buffer } from 'buffer';
import { Schema, model, Document, Types } from 'mongoose';

export interface INftAsset extends Document {
  tokenId: string;
  collectionId: string;
  chain: string;
  metadataUri: string;
  imageUri: string;
  attributes: Array<{ trait_type: string, value: any }>;
  createdByUserId: Types.ObjectId;
  status: 'DRAFT' | 'MINTED' | 'BURNED';
  // Use Buffer type from the imported 'buffer' module.
  imageData?: Buffer;
}

const NftAssetSchema = new Schema<INftAsset>({
  tokenId: { type: String, required: true, unique: true },
  collectionId: { type: String, required: true },
  chain: { type: String, required: true },
  metadataUri: { type: String, required: true },
  imageUri: { type: String, required: true },
  attributes: [{ trait_type: String, value: Schema.Types.Mixed }],
  createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'MINTED' },
  // Use Schema.Types.Buffer to ensure Mongoose correctly handles binary data.
  imageData: { type: Schema.Types.Buffer }
}, { timestamps: true });

export const NftAsset = model<INftAsset>('NftAsset', NftAssetSchema);