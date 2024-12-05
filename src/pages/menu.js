import InnerPageContainer from "@/components/common/InnerPageContainer";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { ethers } from 'ethers';
import { ecsign, toRpcSig, keccakFromString, BN, ecrecover } from 'ethereumjs-util';
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from  "@ethereum-attestation-service/eas-sdk";
import Link from "next/link";
import { toast } from "@/hooks/alert";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const CUSTOM_SCHEMAS = {
    COURSE_INFO:"0x1ab393b6fa93fd0ab9d20d1f46688c12618030d908a71f6cb1d95dffc209d4f0",
    COURSE_REQUEST_CONFIRM:"0xd79a94caa32fcb0a8da69e8412688c381c699c07b1cf3daa184563f7a20759e0",
  };
  const baseURL = "https://sepolia.easscan.org"

export default function Page() {
  const { address } = useSelector((state) => state.user)
  const [handler, setHandler] = useState('');
  const [public_key, setPublic_key] = useState('')
  const [option, setOption] = useState('')
  const [final_content,setfinal_content] = useState('')
  const [intial_content, setIntial_content] = useState('')
  const [payload, setPayload] = useState("")
  const [statusID, setStatusID] = useState("")
  const [showStatusInput, setShowStatusInput] = useState(false)
  const [uuid,setUuid] = useState('')
  const [created_at,setCreated_at] = useState('')
  const [attestationData,setAttestationData] = useState({course_name: '', organization: '', amount: 0, deadline: 0, twitter: '', github: ''})
  const [search, setSearch] = useState('')

  async function Sign(message) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    console.log("signature: ", signature);
    return signature
  }

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
      console.log("attestation", new Date(attestationData.deadline).valueOf())
      const schemaEncoder = new SchemaEncoder("string CourseName,string Organization,uint256 Amount,uint256 Deadline,string Twitter,string Github");
      
      const encodedData = schemaEncoder.encodeData([
        { name: "CourseName", value: attestationData.course_name, type: "string" },
        { name: "Organization", value: attestationData.organization, type: "string" },
        { name: "Amount", value: attestationData.amount, type: "uint256" },
        { name: "Deadline", value: new Date(attestationData.deadline).valueOf(), type: "uint256" },
        { name: "Twitter", value: attestationData.twitter, type: "string" },
        { name: "Github", value: attestationData.github, type: "string" },
    ]);

    console.log(encodedData)
      const schemaUID = "0x1ab393b6fa93fd0ab9d20d1f46688c12618030d908a71f6cb1d95dffc209d4f0";

      const tx = await eas.attest({
      schema: schemaUID,
      data: {
          recipient: "0x8da6700A5bF8d0854409F1ff646321D8DD81c781",
          expirationTime: 0,
          revocable: true,
          data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);
    toast(newAttestationUID, {type: 'success'})
    } catch (error) {
      console.log(error)
      toast(error.message, {type: 'error'})
    }
  }

  async function getConfirmationAttestationsForUIDs() {
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
                in: search,
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
    // return response.data.data.attestations;
    console.log(response.data.data.attestations)
    }

  const getPublickey = async (e) => {
    e.preventDefault()
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      var message = "message"
      const signature = await signer.signMessage(message);
      console.log("signature: ", signature);
      const publicKey =parseSignature(message, signature)
      console.log("publicKey", publicKey)
      setPublic_key(publicKey)
    } catch (error) {
      return console.log(error);
    }

  }

  async function replaceSignature(inputString, signature) {
    const placeholder = '%SIG_BASE64%';
    return inputString.replace(placeholder, signature);
  }

  const parseSignature = (message, signature) => {
    // console.log("message", message)
    const messageBytes = ethers.utils.toUtf8Bytes(message);
    const messageHash = ethers.utils.keccak256(messageBytes);
  
    const { v, r, s } = ethers.utils.splitSignature(signature);
  
    // Assuming it's an Ethereum transaction signature (v is either 27 or 28)
    const vFixed = v >= 27 ? v : v + 27;
    console.log("vFixed", vFixed)
    // Use ecrecover to get the signer's address
    const publicKey = ethers.utils.recoverPublicKey(messageHash, { r, s, v: vFixed });
    return publicKey
  }
  const verify = async (e) => {
    e.preventDefault()
    try {
      let web3 = new Web3(window.ethereum)

      console.log(await web3.eth.getAccounts())
      console.log({
        action: 'create',
        platform: 'twitter',
        identity: handler,
        public_key: public_key
      })
      let { data } = await axios.post('https://proof-service.next.id/v1/proof/payload', {
        action: 'create',
        platform: 'twitter',
        identity: handler,
        public_key: public_key
      })
      console.log("Proof Respone", data)
      console.log("payload", data.sign_payload)
      console.log("post_content", data.post_content.default)
      setPayload(data.sign_payload)
      setIntial_content(data.post_content.default)
      setUuid(data.uuid)
      setCreated_at(data.created_at)
    } catch (error) {
      console.error(error)
    }

  }
  const verifypost = async (e) => {
    e.preventDefault()
    try {
      console.log({
        action: 'create',
        platform: 'twitter',
        identity: handler,
        public_key: public_key,
        proof_location: statusID,
        extra: {},
        uuid: uuid,
        created_at: created_at


      })
      let val = await axios.post('https://proof-service.next.id/v1/proof', {
        action: 'create',
        platform: 'twitter',
        identity: handler,
        public_key: public_key,
        proof_location: statusID,
        extra: {},
        uuid: uuid,
        created_at: created_at
      })
      console.log("Proof ", val)
    } catch (error) {
      console.error(error)
    }

  }
  async function changeStatusIDbool() {
    // window.open(`https://twitter.com/compose/tweet?text=${final_content}`, '_blank')
    setShowStatusInput(e => !e)  
  }
  
  
  async function sign_payload() {

    const signed_payload = await Sign(payload);
    console.log("signed_payload", signed_payload)
    
    const buffer = Buffer.from(signed_payload.split('x')[1], 'hex');

    console.log("buffer", buffer)
    const base64String = buffer.toString('base64');
    console.log("base64String", base64String)
    const final_content = await replaceSignature(intial_content, base64String)
    console.log("final_content", final_content)
    setfinal_content(final_content)
  }
  

  return (
    <InnerPageContainer title="Borrower Menu">
      {/* <h2>
            Verify with (Next.Id)
            </h2> */}
      {/* <button className="btn bg-green-500" onClick={() => setOption('twitter')}>Twitter</button> OR
      <button className="btn bg-green-500" onClick={() => setOption('github')}>Github</button> <br /> */}

        <Link href={'verify'}>
        <button className="btn bg-green-500 mt-8" >Verify</button>
        </Link> <br />
      <button className="btn bg-green-500 mt-8" onClick={() => {
        setOption('ma')}}>Make Attestation</button> <br />
        <Link href={'acknowledgement'}>
        <button className="btn bg-green-500 mt-8" >Make Acknowledgement</button>
        </Link> <br />
        <Link href={'submissions'}>
        <button className="btn bg-green-500 mt-8" >My Submissions</button>
        </Link> <br />
        {option === 'ma' && <> <form onSubmit={makeEas}>
        <label htmlFor="course" className="block  text-sm font-medium dark:text-white">Course</label>
        <input type="text" id="course" value={attestationData.course_name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter course name" required onChange={(e) => setAttestationData({...attestationData, course_name: e.target.value})} />
        <label htmlFor="organization" className="block  text-sm font-medium dark:text-white">Organization</label>
        <input type="text" id="organization" value={attestationData.organization} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter organization name" required onChange={(e) => setAttestationData({...attestationData, organization: e.target.value})} />
        <label htmlFor="amount" className="block  text-sm font-medium dark:text-white">Amount</label>
        <input type="number" id="amount" value={attestationData.amount} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter amount name" required onChange={(e) => setAttestationData({...attestationData, amount: e.target.value})} />
        <label htmlFor="deadline" className="block  text-sm font-medium dark:text-white">Deadline</label>
        <input type="date" id="deadline" value={attestationData.deadline} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter deadline name" required onChange={(e) => setAttestationData({...attestationData, deadline: e.target.value})} />
        <label htmlFor="twitter" className="block  text-sm font-medium dark:text-white">Twitter</label>
        <input type="text" id="twitter" value={attestationData.twitter} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter twitter handler" required onChange={(e) => setAttestationData({...attestationData, twitter: e.target.value})} />
        <label htmlFor="github" className="block  text-sm font-medium dark:text-white">Github</label>
        <input type="text" id="github" value={attestationData.github} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter github handler" required onChange={(e) => setAttestationData({...attestationData, github: e.target.value})} />
        <button className="btn bg-green-500 mt-8" type="submit">Submit Attestation</button>
          </form>

          <label htmlFor="Search Id" className="block mt-8 text-sm font-medium dark:text-white">Search Attestations</label>
        <input type="text" id="search" value={search} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter github handler" required onChange={(e) => setSearch(e.target.value)} />
        <button className="btn bg-green-500 mt-8" type="button" onClick={getConfirmationAttestationsForUIDs}>Search Attestation</button>
          </>
          }
    </InnerPageContainer>
  )
}


// '{"action":"create","created_at":"1690048341","iden…ll,"uuid":"9924dfc4-8bfd-4ffb-b3a0-3e09438254b5"}'

// f9a69f75a8720d4f499b6ad2376d24842ba28a18f0c1edfb95b635b622d721f91fc730db8aec8feaeb8689dc0c8e385bc09e4993a0ecb8c366de2368e44b0af91c
// 842a74331ecb1fd02fa5571ef8fc35c2beef97ba2c3267d7581b411d4f5a4e477a34424e840c8ff8c3d0ae3d5ebe4bee9980fac00afaa7e61c05ed77b2429bb31b
