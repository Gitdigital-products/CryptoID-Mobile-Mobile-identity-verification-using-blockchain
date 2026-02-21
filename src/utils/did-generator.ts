import { Ed25519Keypair } from '@solana/kit'; // Modern 2026 kit
import { Buffer } from 'buffer';

/**
 * Generates a W3C compliant DID for the Solana ecosystem.
 */
export const generateSolanaDID = (publicKey: string, network: 'mainnet' | 'devnet' = 'mainnet'): string => {
  return `did:sol:${network}:${publicKey}`;
};

/**
 * Creates an 'Identity Proof' signature.
 * This is what SmartTransport will verify before a ride.
 */
export const signIdentityClaim = async (claim: object, keypair: any) => {
  const message = JSON.stringify(claim);
  const messageBytes = new TextEncoder().encode(message);
  
  // Sign using the user's mobile-stored private key
  const signature = await keypair.sign(messageBytes);
  return Buffer.from(signature).toString('base64');
};
