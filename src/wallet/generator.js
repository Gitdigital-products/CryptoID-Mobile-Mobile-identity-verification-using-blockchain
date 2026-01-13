import { ethers } from 'ethers';
import * as Crypto from 'expo-crypto';
import * as SecureEnclave from './secureEnclave';

export class WalletGenerator {
  static async generateMnemonic(strength = 256) {
    // Generate cryptographically secure mnemonic
    const entropy = await Crypto.getRandomBytesAsync(strength / 8);
    const mnemonic = ethers.utils.entropyToMnemonic(entropy);
    
    // Store in secure enclave
    await SecureEnclave.storeMnemonic(mnemonic);
    
    return mnemonic;
  }
  
  static async deriveWalletFromMnemonic(mnemonic, index = 0) {
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    
    // Extract keys for secure storage
    const privateKey = wallet.privateKey;
    const publicKey = wallet.publicKey;
    const address = wallet.address;
    
    // Store private key in secure enclave
    await SecureEnclave.storePrivateKey(address, privateKey);
    
    return {
      address,
      publicKey,
      privateKey: '***SECURE_ENCLAVE***', // Never expose actual key
      mnemonic: '***SECURE_ENCLAVE***'
    };
  }
}

// Secure Enclave Abstraction (src/wallet/secureEnclave.js)
import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';

export class SecureEnclave {
  static async storePrivateKey(identifier, privateKey) {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      // Use biometric-protected storage
      await Keychain.setInternetCredentials(
        `cryptoid_${identifier}`,
        'private_key',
        privateKey,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE
        }
      );
    } else {
      // Fallback to secure store
      await SecureStore.setItemAsync(
        `key_${identifier}`, 
        privateKey,
        {
          keychainService: 'CryptoIDKeys',
          requireAuthentication: true
        }
      );
    }
  }
}