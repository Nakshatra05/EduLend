import InnerPageContainer from "@/components/common/InnerPageContainer";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Page() {
    const { address } = useSelector((state) => state.user)
    const [handler, setHandler] = useState('');
    const [option, setOption] = useState('')
    const verify = async (e) => {
        e.preventDefault()
        try {
            let web3 = new Web3(window.ethereum)

            console.log(await web3.eth.getAccounts())
            console.log({
                action: 'create',
                platform: 'twitter',
                identity: handler,
                public_key: address
            })
            let { data } = await axios.post('https://proof-service.nextnext.id/v1/proof/payload', {
                action: 'create',
                platform: 'twitter',
                identity: handler,
                public_key: address
            })
            console.log("Proof Respone", data)
        } catch (error) {
            console.error(error)
        }

    }

    return (
        
            <div className="hero py-32 bg-base-100">
            <div className="hero-content max-w-5xl flex-col lg:flex-row-reverse">
                <img src="https://worldcoin.org/icons/logo.svg" className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                <h1 className="text-5xl font-bold">Auth With Open Campus ID</h1>
                <p className="py-6">Open Campus ID is a non-transferable NFT that acts as a secure digital identity for users within the decentralized education ecosystem. It represents your online persona and academic achievements, allowing you to build your reputation while safeguarding personal data. With Open Campus ID, users gain ultimate privacy, as only they can access their data. This identity system empowers participants to authenticate themselves for educational events, showcase their credentials, and maintain a verifiable yet private academic history in a blockchain-secured environment. </p>
                {/* <button className="btn bg-green-500"></button>
                OR */}
                <a
                href={`/api/auth/signin`}
                className="btn bg-green-500"
                onClick={(e) => {
                  e.preventDefault()
                  signIn("worldcoin") // when worldcoin is the only provider
                  // signIn() // when there are multiple providers
                }}
              >
                Sign in
              </a> <br />
              <div className="mt-8">
              {/* <InnerPageContainer title="Verify With Twitter or Github (Next.ID)"> */}
                <h1>Verify With Twitter or Github (Next.ID)</h1>
              <Link href='/menu'>
                 <button className="btn bg-green-500">
                     Menu
                 </button> <br />
                 </Link>
                 <Link href={'organization-verify'}>
        <button className="btn bg-green-500 mt-8" >Organization Verify Attestation</button>
        </Link> <br />
        <Link href={'organization-complete'}>
        <button className="btn bg-green-500 mt-8" >Organization Complete Attestation</button>
        </Link>
                 {/* </InnerPageContainer> */}
                 </div>
                </div>
                
            </div>
            
        </div>
        // <InnerPageContainer title="Login Type">
        //     <ol className="w-96 list-style-number">
        //         <li className="w-full p-4 ">
        //             Worldcoin
        //         </li>
        //         <Link href={'denied'}>
        //         <li className="w-full p-4">
        //             Polygon
        //         </li>
        //         </Link>
        //         <Link href='/verify'>
        //         <li className="w-full p-4">
        //             Next.ID
        //         </li>
        //         </Link>
        //     </ol>
        // </InnerPageContainer>
    )
}
