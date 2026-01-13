import { ethers } from 'ethers';
import IdentityRegistryABI from './contracts/IdentityRegistryABI.json';

export class BlockchainClient {
  constructor(network = 'sepolia') {
    this.network = network;
    this.provider = this.initProvider();
    this.contracts = {};
  }
  
  initProvider() {
    // Support multiple networks
    const networks = {
      mainnet: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      sepolia: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      polygon: 'https://polygon-rpc.com',
      local: 'http://localhost:8545'
    };
    
    return new ethers.providers.JsonRpcProvider(
      networks[this.network] || networks.sepolia
    );
  }
  
  async getIdentityContract(address) {
    if (!this.contracts.identity) {
      this.contracts.identity = new ethers.Contract(
        address,
        IdentityRegistryABI,
        this.provider
      );
    }
    return this.contracts.identity;
  }
  
  async signMessage(message, privateKey) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const signature = await wallet.signMessage(message);
    return {
      signature,
      address: wallet.address,
      message
    };
  }
  
  async sendTransaction(contractMethod, options = {}) {
    // Connect with signer if we have a private key
    if (options.privateKey) {
      const signer = new ethers.Wallet(options.privateKey, this.provider);
      const contractWithSigner = contractMethod.connect(signer);
      const tx = await contractWithSigner;
      return await tx.wait();
    }
    
    throw new Error('Private key required for transactions');
  }
}