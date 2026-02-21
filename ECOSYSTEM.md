The Data Flow (The "Golden Path")
To build a "FutureProof" feature, a user request flows through the repositories in this order:
CryptoID-Mobile: User undergoes biometric/document verification. A Verifiable Credential (VC) is issued and hashed onto the Solana blockchain.
FutureProof-Mobile-toolkit: The core library detects the user's on-chain identity status via useSolanaConnection.
SmartCity-Mobile: IoT sensors (e.g., a smart bike rack) broadcast their availability. The app uses the Toolkit to check if the user is a "Verified Resident."
SmartTransport-Mobile: Once verified, the user initiates a ride. The app uses the Toolkit to handle the SOL/Token payment escrow.
Shared Standards
Chain: Solana (Mainnet-beta / Devnet)
Auth: Decentralized Identity (DID) via CryptoID
UI: GitDigital "Cyber-Compliance" Design System (Dark mode, Neon accents)