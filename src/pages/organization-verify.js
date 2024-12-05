import InnerPageContainer from "@/components/common/InnerPageContainer";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { ethers } from 'ethers';
import { ecsign, toRpcSig, keccakFromString, BN, ecrecover } from 'ethereumjs-util';
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from  "@ethereum-attestation-service/eas-sdk";
import Link from "next/link";
import { toast } from "@/hooks/alert";
// const ethers  = require( 'ethers');
// const RPC_URL = "https://sepolia.infura.io/v3/91b015d3797b46078af8be3a5e57f8aa"

// const pvtKey = "cad703523fb7f6d462615cd924c269f0be38a69e5b126ff8f8313660f18cffaf"
const pvtKey = "55578ca69759f842327ceb15593c24ba90c80b85bff2d246f1e7b92b554d6458"
// const wallet = new ethers.Wallet( pvtKey)

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const CUSTOM_SCHEMAS = {
    COURSE_INFO:"0x1ab393b6fa93fd0ab9d20d1f46688c12618030d908a71f6cb1d95dffc209d4f0",
    COURSE_REQUEST_CONFIRM:"0xd79a94caa32fcb0a8da69e8412688c381c699c07b1cf3daa184563f7a20759e0",
  };
  const baseURL = "https://sepolia.easscan.org"

export default function Page() {
  const { address } = useSelector((state) => state.user)
  const [option, setOption] = useState('ma')
  const [search, setSearch] = useState('')
  const [list, setList] = useState([])

  useEffect(() => {
    getAttestationsForAddress()
    // getData()
  }, [])

  async function getAttestationsForAddress() {
    // console.log(address, typeof address , "0x8da6700A5bF8d0854409F1ff646321D8DD81c781")
    const response = await axios.post(
      `${baseURL}/graphql`,
      {
        query:
          "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    data\n  }\n}",
  
        variables: {
          where: {
            schemaId: {
              equals: CUSTOM_SCHEMAS.COURSE_INFO,
            },
            OR: [
              {
                attester: {
                  equals: ethers.utils.getAddress(address),
                },
              },
              {
                recipient: {
                  equals: ethers.utils.getAddress(address),
                },
              },
            ],
          },
          orderBy: [
            {
              time: "desc",
            },
          ],
        },
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    // return response.data.data.attestations;
      setList(response.data.data.attestations)
    //   const provider = new ethers.providers.Web3Provider(window.ethereum)
    //         const signer = provider.getSigner();
    //         const schemaEncoder = new SchemaEncoder("bool confirm");
    //         const encoded = schemaEncoder.encodeData([
    //           { name: "confirm", type: "bool", value: true },
    //         ]);

    //         const eas = new EAS(EASContractAddress);
    //         // invariant(signer, "signer must be defined");
    //         eas.connect(signer);
            
    //   let attestation = await eas.getAttestation("0x5e81964bd7d08efab6f219f923eaebdf8a554ccfc2ad056ffd1d858230f3f510");
      console.log("Response: ", response.data.data.attestations)
      toast("Retrived Successfully", {type: 'success'})
      return response.data.data.attestations;
    
}

// const getData = async() => {
//     let resolvedAttestations = []
//     const tmpAttestations = await getAttestationsForAddress();
//     // console.log("tmpAttestations", tmpAttestations);
//     const addresses = new Set();

//     tmpAttestations.forEach((att) => {
//       addresses.add(att.attester);
//       addresses.add(att.recipient);
//     });    
//     const uids = tmpAttestations.map((att) => att.id);
//     const confirmations = await getConfirmationAttestationsForUIDs(uids);

//       tmpAttestations.forEach((att) => {
//         const amIAttester =
//           att.attester.toLowerCase() === address.toLowerCase();

//         const otherGuy = amIAttester ? att.recipient : att.attester;

//         const relatedConfirmation = confirmations.find((conf) => {
//           return (
//             conf.refUID === att.id &&
//             ((amIAttester &&
//               conf.attester.toLowerCase() === otherGuy.toLowerCase()) ||
//               (!amIAttester &&
//                 conf.attester.toLowerCase() === address.toLowerCase()))
//           );
//         });
//         resolvedAttestations.push({
//             ...att,
//             confirmation: relatedConfirmation,
//             name: otherGuy,
//           });
//         });

//     console.log("Final", resolvedAttestations);
// }

//   await getAttestationsForAddress("0xE8e19B4e6c00096F70dd9F55aa80AC49d493F448")

async function getConfirmationAttestationsForUIDs(uids) {
    const response = await axios.post(
        `${baseURL}/graphql`,
        {
        query:
            "query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!]) {\n  attestations(where: $where, orderBy: $orderBy) {\n    attester\n    revocationTime\n    expirationTime\n    time\n    recipient\n    id\n    data\n  refUID\n  }\n}",
    
        variables: {
            where: {
            schemaId: {
                equals: CUSTOM_SCHEMAS.COURSE_REQUEST_CONFIRM,
            },
            refUID: {
                in: uids,
            },
            },
            orderBy: [
            {
                time: "desc",
            },
            ],
        },
        },
        {
        headers: {
            "content-type": "application/json",
        },
        }
    );
    
    console.log(response.data.data.attestations)
    return response.data.data.attestations;
    }

    const validate = async (id) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const schemaEncoder = new SchemaEncoder("bool confirm");
            const encoded = schemaEncoder.encodeData([
              { name: "confirm", type: "bool", value: true },
            ]);

            const eas = new EAS(EASContractAddress);
            // invariant(signer, "signer must be defined");
            eas.connect(signer);

            const tx = await eas.attest({
              data: {
                recipient: ethers.constants.AddressZero,
                data: encoded,
                refUID: id,
                revocable: true,
                expirationTime: 0,
              },
              schema: CUSTOM_SCHEMAS.COURSE_REQUEST_CONFIRM,
            });

            let res = await tx.wait();
            console.log(res)
            toast(res, {type: 'success'})
          } catch (e) {
            console.log(e)
            toast(e.message, {type: 'error'})
        }
}


  return (
    <InnerPageContainer title="Organization Attestation">
      {/* <h2>
            Verify with (Next.Id)
            </h2> */}
{/* 
      <button className="btn bg-green-500 mt-8" onClick={() => {
        setOption('ma')}}>Verify Attestation</button> <br></br> */}

        {/* {option === 'ma' && <> 
          <label htmlFor="Search Id" className="block mt-8 text-sm font-medium dark:text-white">Search Attestations</label>
        <input type="text" id="search" value={search} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter github handler" required onChange={(e) => setSearch(e.target.value)} />
        <button className="btn bg-green-500 mt-8" type="button" onClick={getAttestationsForAddress}>Search Attestation</button>
          </>
          } */}
      <table className="table">
        <tr>
            <td>Attester</td>
            <td>Deadline</td>
            <td>Recipient</td>
            <td>Action</td>
        </tr>
      {list.length > 0 ? list.map((ele, i) => {
        return <tr key={i} style={{ border: "1px solid"}}>
            <td style={{ border: "1px solid"}}>{ele.attester}</td>
            <td style={{ border: "1px solid"}}>{Date(ele.time).toString()}</td>
            <td style={{ border: "1px solid"}}>{ele.recipient}</td>
            <td style={{ border: "1px solid"}}><button className="btn bg-green-500" onClick={() => validate(ele.id)}>Validate</button></td>
        </tr>
      }) : <tr><td></td><td>No Data</td><td></td></tr>}
     </table>
    </InnerPageContainer>
  )
}


// '{"action":"create","created_at":"1690048341","iden…ll,"uuid":"9924dfc4-8bfd-4ffb-b3a0-3e09438254b5"}'

// f9a69f75a8720d4f499b6ad2376d24842ba28a18f0c1edfb95b635b622d721f91fc730db8aec8feaeb8689dc0c8e385bc09e4993a0ecb8c366de2368e44b0af91c
// 842a74331ecb1fd02fa5571ef8fc35c2beef97ba2c3267d7581b411d4f5a4e477a34424e840c8ff8c3d0ae3d5ebe4bee9980fac00afaa7e61c05ed77b2429bb31b
