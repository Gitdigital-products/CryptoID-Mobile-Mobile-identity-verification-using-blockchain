export class DIDResolver {
  static METHODS = {
    'ethr': this.resolveEthrDID,
    'web': this.resolveWebDID,
    'key': this.resolveKeyDID
  };
  
  static async resolve(did) {
    // Parse DID string
    const parts = did.split(':');
    if (parts.length < 3) {
      throw new Error('Invalid DID format');
    }
    
    const method = parts[1];
    const resolver = this.METHODS[method];
    
    if (!resolver) {
      throw new Error(`Unsupported DID method: ${method}`);
    }
    
    return await resolver.call(this, did);
  }
  
  static async resolveEthrDID(did) {
    // did:ethr:network:address
    const parts = did.split(':');
    const network = parts[2] || 'mainnet';
    const address = parts[3];
    
    // For ethr, we can query the blockchain
    // This is a simplified version
    return {
      didDocument: {
        id: did,
        verificationMethod: [{
          id: `${did}#controller`,
          type: 'EcdsaSecp256k1RecoveryMethod2020',
          controller: did,
          blockchainAccountId: `${address}@eip155:${network === 'mainnet' ? '1' : network}`
        }]
      },
      methodMetadata: {
        network,
        address,
        chainId: network === 'mainnet' ? '1' : '5' // sepolia
      }
    };
  }
  
  static async resolveWebDID(did) {
    // did:web:example.com:user:alice
    const url = `https://${did.replace('did:web:', '').replace(/:/g, '/')}/did.json`;
    
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to resolve Web DID: ${error.message}`);
    }
  }
}