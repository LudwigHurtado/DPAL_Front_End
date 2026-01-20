// Import Buffer to resolve 'Cannot find name Buffer' error in environments without Node.js types.
import { Buffer } from 'buffer';
import mongoose from 'mongoose';
import { CreditWallet } from '../models/CreditWallet';
import { CreditLedger } from '../models/CreditLedger';
import { MintRequest } from '../models/MintRequest';
import { MintReceipt } from '../models/MintReceipt';
import { NftAsset } from '../models/NftAsset';
import { AuditEvent } from '../models/AuditEvent';
import { GoogleGenAI } from "@google/genai";

// Fix: Always use literal process.env.API_KEY for initialization as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const executeMintFlow = async (userId: string, payload: any) => {
  const { idempotencyKey, meta, assetDraftId, collectionId, chain, priceCredits } = payload;
  
  console.log(`[MINT_START] userId: ${userId} idempotency: ${idempotencyKey}`);

  // Check Idempotency First (outside transaction for speed if already done)
  const existingReceipt = await MintReceipt.findOne({ userId, idempotencyKey });
  if (existingReceipt) {
    console.log(`[MINT_IDEMPOTENCY_HIT] Returning existing receipt for ${idempotencyKey}`);
    return existingReceipt;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Lock Credits
    console.log(`[MINT_CREDIT_LOCK] Attempting lock for ${priceCredits} HC`);
    const wallet = await CreditWallet.findOneAndUpdate(
      { userId, balance: { $gte: priceCredits } },
      { 
        $inc: { balance: -priceCredits, lockedBalance: priceCredits },
        $set: { updatedAt: new Date() }
      },
      { session, new: true }
    );

    if (!wallet) throw new Error('INSUFFICIENT_CREDITS');

    const lockLedger = await CreditLedger.create([{
      userId,
      type: 'CREDIT_LOCK',
      amount: priceCredits,
      direction: 'DEBIT',
      referenceId: assetDraftId,
      idempotencyKey: `lock-${idempotencyKey}`
    }], { session });

    // 2. Initialize Request
    const request = await MintRequest.create([{
      ...payload,
      userId,
      status: 'PROCESSING'
    }], { session });

    // 3. Generate Image via Google GenAI (Server Side)
    console.log(`[MINT_IMAGE_GEN_START] Prompt: ${meta.concept}`);
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: `A futuristic accountability artifact based on the concept: ${meta.concept}. Theme: ${meta.theme}. High detail, cinematic lighting.` }] 
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let base64Image = '';
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }
    
    if (!base64Image) throw new Error('IMAGE_GENERATION_FAILED');
    console.log(`[MINT_IMAGE_GEN_END] Image generated successfully.`);

    // 4. Perform Mint (Internal Simulation)
    const tokenId = `TOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const txHash = `0x-internal-${Math.random().toString(16).slice(2)}`;

    // 5. Create Asset and Store Image Data
    const asset = await NftAsset.create([{
      tokenId,
      collectionId,
      chain,
      metadataUri: `dpal://metadata/${tokenId}`,
      imageUri: `/api/assets/${tokenId}.png`, // Served by our backend
      attributes: payload.attributes || [],
      createdByUserId: userId,
      status: 'MINTED',
      // Store image binary in DB (mimicking GridFS behavior for this version)
      // Fix: Resolved 'Cannot find name Buffer' by using the imported Buffer.
      imageData: Buffer.from(base64Image, 'base64') 
    } as any], { session });

    // 6. Settle Credits
    await CreditWallet.updateOne(
      { userId },
      { $inc: { lockedBalance: -priceCredits } },
      { session }
    );

    await CreditLedger.create([{
      userId,
      type: 'CREDIT_SPEND',
      amount: priceCredits,
      direction: 'DEBIT',
      referenceId: request[0]._id,
      idempotencyKey: `spend-${idempotencyKey}`
    }], { session });

    // 7. Final Receipt
    const receipt = await MintReceipt.create([{
      mintRequestId: request[0]._id,
      userId,
      tokenId,
      txHash,
      chain,
      metadataUri: asset[0].metadataUri,
      imageUri: asset[0].imageUri,
      priceCredits,
      ledgerEntryId: lockLedger[0]._id
    }], { session });

    await MintRequest.updateOne({ _id: request[0]._id }, { status: 'COMPLETED' }, { session });

    // 8. Audit
    await AuditEvent.create([{
      actorUserId: userId,
      action: 'NFT_MINT',
      entityType: 'NftAsset',
      entityId: asset[0]._id,
      hash: txHash,
      meta: { priceCredits, tokenId }
    }], { session });

    await session.commitTransaction();
    console.log(`[MINT_SUCCESS] Receipt saved: ${receipt[0]._id}`);
    return receipt[0];

  } catch (error: any) {
    await session.abortTransaction();
    console.error(`[MINT_FAILURE] userId: ${userId} error: ${error.message}`);
    
    // Attempt to log failure in MintRequest if it was created
    try {
      await MintRequest.updateOne(
        { userId, idempotencyKey: payload.idempotencyKey },
        { status: 'FAILED', error: error.message }
      );
    } catch (e) { /* ignore secondary failure */ }

    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Controller-level implementation for GET /api/assets/:tokenId.png
 * In a real express app, this logic would live in a router/controller.
 */
// Fix: Resolved 'Cannot find name Buffer' by using the imported Buffer type.
export const serveAssetImage = async (tokenId: string): Promise<{ buffer: Buffer, mimeType: string }> => {
  const asset = await NftAsset.findOne({ tokenId }) as any;
  if (!asset || !asset.imageData) throw new Error('ASSET_NOT_FOUND');
  return { buffer: asset.imageData, mimeType: 'image/png' };
};