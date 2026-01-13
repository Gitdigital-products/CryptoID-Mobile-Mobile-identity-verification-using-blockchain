// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract IdentityRegistry {
    struct Identity {
        string did;
        address owner;
        uint256 registeredAt;
        bool active;
    }
    
    struct Credential {
        bytes32 credentialId;
        address issuer;
        address subject;
        uint256 issuedAt;
        uint256 revokedAt;
        bool isRevoked;
    }
    
    mapping(address => Identity) public identities;
    mapping(bytes32 => Credential) public credentials;
    
    event IdentityRegistered(address indexed owner, string did);
    event IdentityUpdated(address indexed owner, string newDid);
    event CredentialIssued(bytes32 indexed credentialId, address issuer, address subject);
    event CredentialRevoked(bytes32 indexed credentialId, address issuer);
    
    // Register a new DID
    function registerIdentity(string memory did) public {
        require(identities[msg.sender].owner == address(0), "Identity already registered");
        
        identities[msg.sender] = Identity({
            did: did,
            owner: msg.sender,
            registeredAt: block.timestamp,
            active: true
        });
        
        emit IdentityRegistered(msg.sender, did);
    }
    
    // Issue a verifiable credential
    function issueCredential(
        address subject,
        bytes32 credentialId,
        uint256 expiration
    ) public {
        require(identities[msg.sender].active, "Issuer identity not active");
        
        credentials[credentialId] = Credential({
            credentialId: credentialId,
            issuer: msg.sender,
            subject: subject,
            issuedAt: block.timestamp,
            revokedAt: 0,
            isRevoked: false
        });
        
        emit CredentialIssued(credentialId, msg.sender, subject);
    }
    
    // Revoke a credential
    function revokeCredential(bytes32 credentialId) public {
        Credential storage cred = credentials[credentialId];
        require(cred.issuer == msg.sender, "Only issuer can revoke");
        require(!cred.isRevoked, "Credential already revoked");
        
        cred.isRevoked = true;
        cred.revokedAt = block.timestamp;
        
        emit CredentialRevoked(credentialId, msg.sender);
    }
    
    // Verify credential status
    function verifyCredential(bytes32 credentialId) public view returns (
        bool valid,
        address issuer,
        address subject,
        uint256 issuedAt,
        bool revoked
    ) {
        Credential memory cred = credentials[credentialId];
        return (
            cred.issuer != address(0),
            cred.issuer,
            cred.subject,
            cred.issuedAt,
            cred.isRevoked
        );
    }
    
    // Resolve DID to address (simplified)
    function resolveDID(string memory did) public view returns (address) {
        // In production, this would be more complex
        // This is a simplified version
        // Full DID resolution would involve more logic
        return identities[msg.sender].owner;
    }
}