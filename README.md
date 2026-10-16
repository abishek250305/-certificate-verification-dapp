# Certificate Verification DApp

## 1. Problem Statement

Educational certificates can be forged or altered. This DApp provides a blockchain-based certificate registry where an authorized issuer can issue and revoke certificates, while users can independently verify certificate authenticity.

## 2. Features

- Solidity smart contract deployed on Ethereum-compatible network
- MetaMask wallet connection
- Authorized certificate issuance
- Certificate verification
- Certificate revocation
- Retrieval of certificate details
- Blockchain statistics
- Validation of empty and duplicate inputs
- Owner-only authorization for issue/revoke operations

## 3. Technology Stack

- Solidity ^0.8.20
- Ethereum-compatible blockchain
- Remix IDE
- MetaMask
- HTML5
- CSS3
- JavaScript
- Ethers.js v6

## 4. Project Structure

```text
contracts/CertificateVerification.sol
frontend/index.html
frontend/style.css
frontend/app.js
test/
screenshots/
README.md
```

## 5. Deployment

1. Open Remix IDE.
2. Create `CertificateVerification.sol`.
3. Paste the contract source.
4. Compile with Solidity 0.8.20 or compatible compiler.
5. Connect Remix to Ganache or an Ethereum test network.
6. Deploy `CertificateVerification`.
7. Copy the deployed contract address.
8. Open `frontend/app.js`.
9. Replace `PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE` with the deployed address.
10. Serve the frontend through a local HTTP server.
11. Connect MetaMask to the same network.

## 6. Test Cases

| ID | Test | Input | Expected Result |
|---|---|---|---|
| TC01 | Valid issue | Valid student, course and unique hash | Certificate issued |
| TC02 | Empty hash | Empty hash | Transaction rejected |
| TC03 | Empty student | Empty student | Transaction rejected |
| TC04 | Duplicate certificate | Existing hash | Transaction rejected |
| TC05 | Valid verification | Existing active hash | Certificate shown as valid |
| TC06 | Invalid verification | Unknown hash | Certificate not found |
| TC07 | Valid revocation | Existing certificate ID | Certificate revoked |
| TC08 | Invalid ID | Non-existing ID | Transaction rejected |
| TC09 | Unauthorized issue | Non-owner wallet | Transaction rejected |
| TC10 | Unauthorized revoke | Non-owner wallet | Transaction rejected |

## 7. Required Evidence

Add screenshots showing:

1. Smart contract compilation
2. Smart contract deployment
3. MetaMask wallet connection
4. Successful certificate issuance
5. Failed transaction
6. Successful verification
7. Blockchain data displayed in the UI
8. Unauthorized transaction failure
9. Certificate revocation

## 8. Security Notes

- The contract uses `onlyOwner` for administrative operations.
- Duplicate certificate hashes are rejected.
- Empty certificate data is rejected.
- Private keys and seed phrases must never be uploaded.

## 9. Deployed Contract

Network: `[FILL AFTER DEPLOYMENT]`

Contract Address: `[FILL AFTER DEPLOYMENT]`

Transaction Hash: `[FILL AFTER DEPLOYMENT]`
