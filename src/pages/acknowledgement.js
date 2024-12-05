import { ethers } from "ethers";
import Link from "next/link"
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from  "@ethereum-attestation-service/eas-sdk";
import { useState } from "react";
import { toast } from "../hooks/alert"

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const CUSTOM_SCHEMAS = {
    COURSE_INFO:"0x1ab393b6fa93fd0ab9d20d1f46688c12618030d908a71f6cb1d95dffc209d4f0",
    COURSE_REQUEST_CONFIRM:"0xd79a94caa32fcb0a8da69e8412688c381c699c07b1cf3daa184563f7a20759e0",
  };
  const baseURL = "https://sepolia.easscan.org"

export default function Acknowledgement(){

    const [declare, setDeclare] = useState('')

    const makeEas = async (e) => {
        e.preventDefault()
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner();
          console.log("singer", signer)
          const eas = new EAS(EASContractAddress);
          eas.connect(signer)
          // const uid = "0x36cb7418ae41c0868a38ef38f0cd21dc979b94377f873183664f73209101d405";
    
          // const attestation = await eas.getAttestation(uid);
          const schemaEncoder = new SchemaEncoder("string Acknowledgement");
          
          const encodedData = schemaEncoder.encodeData([
            { name: "Acknowledgement", value: declare ? declare : 'true', type: "string" },
            
        ]);
    
        console.log(encodedData)
          const schemaUID = "0xa82ee781646e1f0556f79263109d442929977378fcb90b8ba7be4623a91964d7";
    
          const tx = await eas.attest({
          schema: schemaUID,
          data: {
              recipient: "0xE8e19B4e6c00096F70dd9F55aa80AC49d493F448",
              expirationTime: 0,
              revocable: true,
              data: encodedData,
          },
        });
        const newAttestationUID = await tx.wait();
        
        console.log("New attestation UID:", newAttestationUID);
        toast(newAttestationUID, {type: 'success'})
    
        } catch (error) {
        toast(error.message, {type: 'error'})
          console.log(error)
        }
      }

    return(
        <div className="hero py-32 bg-base-100">
            <div className="hero-content max-w-5xl flex-col lg:flex-row-reverse">
                <img src="/ack.jpeg" className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                <h1 className="text-5xl font-bold">Acknowledgement</h1>
                <p className="py-6">I hereby acknowledge that i will complete the course and make full use of the opportunity .</p>
        <input type="text" id="course" value={declare} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter name to declare (optional)" onChange={(e) => setDeclare(e.target.value)} />
                <button className="btn bg-green-500 mt-8" onClick={makeEas}>Acknowledgement</button>
                </div>
            </div>
        </div>
    )    
}