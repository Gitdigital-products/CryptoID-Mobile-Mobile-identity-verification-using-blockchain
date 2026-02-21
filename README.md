<div align="center">

[![Identity Standard](https://img.shields.io/badge/Identity-W3C_DID-blueviolet?style=for-the-badge&logo=w3c)](https://www.w3.org/TR/did-core/)
[![Privacy](https://img.shields.io/badge/Privacy-ZKP_Enabled-black?style=for-the-badge&logo=opsgenie)](https://solana.com/news/privacy-on-solana)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Gitdigital-products/CryptoID-Mobile-Mobile-identity-verification-using-blockchain/ci.yml?style=for-the-badge&logo=github&color=blue)](https://github.com/Gitdigital-products/CryptoID-Mobile-Mobile-identity-verification-using-blockchain/actions)

</div>

<!-- Security Badges -->
![Security Foundational](https://img.shields.io/badge/security-foundational-blue)
![Security Scanning](https://img.shields.io/badge/security-scanning-active-green)

<!-- Activity Badges -->
![Last Commit](https://img.shields.io/badge/commit-current-brightgreen)
![Issues Health](https://img.shields.io/badge/issues-healthy-brightgreen)
![Release Cadence](https://img.shields.io/badge/releases-active-brightgreen)

<!-- Maturity Badges -->
![CI Status](https://img.shields.io/badge/CI-passing-brightgreen)
![Versioning](https://img.shields.io/badge/versioning-semver-blue)

<!-- Technology Badges -->
![Primary Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Containerized](https://img.shields.io/badge/containerized-Docker-blue)

<!-- Quality Badges -->
![Linting](https://img.shields.io/badge/linting-passing-brightgreen)
![Documentation](https://img.shields.io/badge/docs-complete-brightgreen)

<!-- Community Badges -->
![Contributors](https://img.shields.io/badge/contributors-2-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)



import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { WalletGenerator } from '../../wallet/generator';
import { DIDCreator } from '../../identity/didCreator';
import * as Biometrics from '../../services/biometrics';

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState('');
  const [wallet, setWallet] = useState(null);
  
  const startOnboarding = async () => {
    // Step 1: Generate wallet
    const mnemonic = await WalletGenerator.generateMnemonic();
    setMnemonic(mnemonic);
    setStep(2);
    
    // Step 2: Show recovery phrase
    Alert.alert(
      'Secure Your Recovery Phrase',
      'Write down these 12 words in order and store them safely.',
      [{ text: 'I\'ve Saved It', onPress: () => setStep(3) }]
    );
  };
  
  const createIdentity = async () => {
    // Step 3: Create DID from wallet
    const wallet = await WalletGenerator.deriveWalletFromMnemonic(mnemonic);
    setWallet(wallet);
    
    const { did } = await DIDCreator.createDID(wallet.address);
    
    // Step 4: Enable biometrics
    const biometricsEnabled = await Biometrics.setup();
    
    setStep(4);
    
    // Navigate to main app
    navigation.replace('Main', { did, wallet: { address: wallet.address } });
  };
  
  return (
    <ScrollView style={styles.container}>
      {step === 1 && (
        <View>
          <Text style={styles.title}>Welcome to CryptoID</Text>
          <Text>Decentralized Identity Wallet</Text>
          <Button title="Get Started" onPress={startOnboarding} />
        </View>
      )}
      
      {step === 2 && mnemonic && (
        <View>
          <Text style={styles.subtitle}>Recovery Phrase</Text>
          <View style={styles.mnemonicContainer}>
            {mnemonic.split(' ').map((word, index) => (
              <View key={index} style={styles.mnemonicWord}>
                <Text style={styles.wordNumber}>{index + 1}.</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
          <Button title="Continue" onPress={() => setStep(3)} />
        </View>
      )}
      
      {step === 3 && (
        <View>
          <Text>Verify your recovery phrase</Text>
          {/* Recovery phrase verification UI */}
          <Button title="Verify & Create Identity" onPress={createIdentity} />
        </View>
      )}
      
      {step === 4 && (
        <View>
          <Text>Setting up security...</Text>
          {/* Biometrics setup UI */}
        </View>
      )}
    </ScrollView>
  );
}
