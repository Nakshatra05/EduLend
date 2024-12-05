# Edu-Lend  
**Empowering Budding Developers through Education and Innovation**  

Edu-Lend is a decentralized platform enabling global Samaritans to support aspiring developers in overcoming entry barriers for participating in hackathons, bootcamps, or educational courses.  

Now deployed on **EDU Chain by Open Campus**, an **L3 Rollup Chain built on the Arbitrum Orbit Stack**, Edu-Lend benefits from the enhanced scalability, security, and efficiency offered by this cutting-edge blockchain infrastructure.  

---

## Key Features  

1. **Authentication with Open Campus ID**  
   - Uses **Open Campus ID**, a non-transferable NFT, for secure and private identity verification.  
   - Ensures proof of humanity and represents academic achievements in a decentralized manner.  

2. **Attestation and Validation**  
   - Users submit attestations for funding, validated by event organizers and institutions.  

3. **DAO Decision-Making**  
   - Decentralized governance evaluates funding proposals based on the applicant’s Open Campus ID and linked profiles.  

4. **Funding Privacy**  
   - Leverages private funding mechanisms to ensure anonymous contributions.  

5. **SoulBound Tokens (SBTs)**  
   - Fully on-chain NFTs representing progress and completion of courses or events.  

6. **Deployed on EDU Chain**  
   - Built on the **Arbitrum Orbit Stack**, ensuring scalable and cost-effective operations with Ethereum-level security.  

---

## How It Works  

1. **User Authentication**  
   - Participants authenticate using their **Open Campus ID**.  
   - The ID ensures proof of humanity and securely stores personal data, accessible only by the user.  

2. **Attestation**  
   - Submit attestations detailing event information, required funds, and deadlines.  
   - Event organizers mutually attest to the credibility of the request.  

3. **DAO Proposal**  
   - Verified attestations are sent to the DAO for decision-making.  
   - The DAO evaluates proposals using the user’s Open Campus ID, linked profiles (Twitter, GitHub), and past certifications.  

4. **Funding and SBTs**  
   - Approved requests are funded through private funding mechanisms.  
   - A SoulBound Token (SBT) is minted to the user’s wallet to track their progress.  

5. **Re-Eligibility**  
   - Users with “Defaulted” SBTs must pay a penalty to regain eligibility.  
   - Users with “Completed” SBTs can retain or burn them as desired.  

---

## Tech Stack  

- **Blockchain**: EDU Chain (L3 Rollup on Arbitrum Orbit Stack) for scalable and secure deployment.  
- **Authentication**: Open Campus ID for secure and decentralized identity verification.  
- **Attestation**: EduCert for event and course verification.  
- **DAO Governance**: EduDAO for evaluating and approving proposals.  
- **Funding Privacy**: ZkBob & EduChain’s privacy solutions for anonymous contributions.  
- **Treasury Management**: Safe for secure fund handling.  
- **Frontend**: Next.js with integrated Metamask wallet support for Open Campus ID and transactions.  

---

## Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/Nakshatra05/EduLend.git
   cd EduLend
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  

3. Configure the environment:  
   - Create a `.env` file with the following variables:  
     ```plaintext  
     NEXT_PUBLIC_RPC_URL=<EDU Chain RPC URL>  
     NEXT_PUBLIC_TREASURY_ADDRESS=<Treasury Contract Address>  
     NEXT_PUBLIC_OPENCAMPUS_ID_CONTRACT=<Open Campus ID Contract Address>  
     ```  

4. Start the development server:  
   ```bash  
   npm run dev  
   ```  

---

## Deployment  

To deploy smart contracts on **EDU Chain**:  

1. Compile contracts:  
   ```bash  
   npx hardhat compile  
   ```  

2. Deploy to EDU Chain:  
   ```bash  
   npx hardhat run scripts/deploy.js --network educhain  
   ```  

3. Verify deployment:  
   - Check contract addresses on the EDU Chain block explorer.  

---

## Contribution Guidelines  

We welcome contributions to improve Edu-Lend! Please follow these steps:  

1. Fork the repository.  
2. Create a new branch:  
   ```bash  
   git checkout -b feature/your-feature-name  
   ```  
3. Make changes and commit:  
   ```bash  
   git commit -m "Add your message here"  
   ```  
4. Push changes:  
   ```bash  
   git push origin feature/your-feature-name  
   ```  
5. Create a pull request.  

---

## Future Enhancements  

- Integrate additional Open Campus tools for academic tracking.  
- Enhance the reputation system for completed events using SBTs.  
- Gamify the platform to motivate participants and sponsors.  

---

### Join Edu-Lend on EDU Chain and Empower the Next Generation of Developers! 🚀  
