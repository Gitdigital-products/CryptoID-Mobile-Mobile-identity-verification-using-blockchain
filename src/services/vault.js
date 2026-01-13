import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as Keychain from 'react-native-keychain';

export class SecureVault {
  static async encryptAndStore(key, data) {
    // Generate encryption key from device biometrics
    const encryptionKey = await this.getDeviceEncryptionKey();
    
    // Convert data to string
    const dataString = typeof data === 'string' 
      ? data 
      : JSON.stringify(data);
    
    // In production, use proper encryption like AES-GCM
    // This is a simplified version
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      dataString + encryptionKey
    );
    
    // Store encrypted data
    await SecureStore.setItemAsync(`vault_${key}`, encrypted, {
      keychainService: 'CryptoIDVault',
      requireAuthentication: true
    });
    
    return true;
  }
  
  static async retrieveAndDecrypt(key) {
    // Retrieve encrypted data
    const encrypted = await SecureStore.getItemAsync(`vault_${key}`, {
      keychainService: 'CryptoIDVault',
      requireAuthentication: true
    });
    
    if (!encrypted) return null;
    
    // Get encryption key
    const encryptionKey = await this.getDeviceEncryptionKey();
    
    // In production, this would be proper decryption
    // For now, we're just verifying the hash matches
    return {
      _storedHash: encrypted,
      _requiresDecryption: true // Flag for actual implementation
    };
  }
  
  static async getDeviceEncryptionKey() {
    // Use device-specific identifier combined with biometrics
    const deviceId = await SecureStore.getItemAsync('device_id');
    if (!deviceId) {
      const newDeviceId = await Crypto.getRandomBytesAsync(32);
      await SecureStore.setItemAsync('device_id', newDeviceId.toString());
      return newDeviceId.toString();
    }
    return deviceId;
  }
  
  static async storeCredentials(credentials) {
    for (const cred of credentials) {
      await this.encryptAndStore(`cred_${cred.id}`, cred);
    }
    
    // Also store metadata
    await SecureStore.setItemAsync(
      'credentials_index',
      JSON.stringify(credentials.map(c => c.id))
    );
  }
}