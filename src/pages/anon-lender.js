import InnerPageContainer from "@/components/common/InnerPageContainer";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { ethers } from 'ethers';
import { signIn, signOut, useSession } from "next-auth/react"

import bobAbi from './bobAbi.json'
import depositQueueAbi from './depositQueueAbi.json'
// Network Sepolia:
// zkbob_sepolia:2r3UhH5Dw7rumEPfAacov3PPTsn5j7kF8TywUkpXjE42S7T3fLd5ZXGoSre4WF9
const toZkAddress = "2r3UhH5Dw7rumEPfAacov3PPTsn5j7kF8TywUkpXjE42S7T3fLd5ZXGoSre4WF9"
const bob = "0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f"
const depositQueueAddr = "0xE3Dd183ffa70BcFC442A0B9991E682cA8A442Ade"


export default function Page() {
    const { address } = useSelector((state) => state.user)
    const [amount, setAmount] = useState('');
    const [secret,setSceret] = useState('');
    const [withdraw_amount, setWithdraw_amount] = useState('');
    const [withdraw_secret,setWithdraw_secret] = useState('');
    const [hashArray,setHashArray] = useState([])
    const [to_address,setTo_address] = useState('');
    const toZkAddress = "2r3UhH5Dw7rumEPfAacov3PPTsn5j7kF8TywUkpXjE42S7T3fLd5ZXGoSre4WF9"
    const bob = "0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f"
    const depositQueueAddr = "0xE3Dd183ffa70BcFC442A0B9991E682cA8A442Ade"

    async function ApproveAndDepositBob() {
        addhash();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Approve Bob
        const BOB20 = new ethers.Contract(bob, bobAbi, signer);
        console.log("amount: ", amount);
        let tx = await BOB20.connect(signer).approve(depositQueueAddr, amount);
        console.log(`Tx: https://sepolia.etherscan.io/tx/${tx.hash}`);
        let receipt = await tx.wait();

        //Submit to deposit queue
        const depositQueue = new ethers.Contract(depositQueueAddr, depositQueueAbi, signer);
        tx = await depositQueue.connect(signer)["directDeposit(address,uint256,string)"](signer.getAddress(), amount, toZkAddress.toString());
        console.log(`Tx: https://sepolia.etherscan.io/tx/${tx.hash}`);
        receipt = await tx.wait();


    }

    async function addhash() {
        const value1Array = ethers.utils.toUtf8Bytes(secret);
        const value2Array = ethers.utils.toUtf8Bytes(amount);
        const hash = ethers.utils.keccak256(ethers.utils.concat([value1Array, value2Array]));
        setHashArray([...hashArray, hash]);
    }

    async function removehash() {
        const value1Array = ethers.utils.toUtf8Bytes(withdraw_secret);
        const value2Array = ethers.utils.toUtf8Bytes(withdraw_amount);
        const _hash = ethers.utils.keccak256(ethers.utils.concat([value1Array, value2Array]));
        if (hashArray.includes(hash)) {
            const updatedItems = hashArray.filter((hash) => hash !== _hash);
            setHashArray([...updatedItems]);
        }
        else {
            alert("No such hash exists");
        }
        
    }

    return (
        <InnerPageContainer title="Anonymous Lending">
            <label>Amount to Contribute: </label> <br/><br/>
                <input value={amount} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setAmount(e.target.value)} placeholder="input amount in wei"  id="bobAmt" size="147" defaultValue={'1'}/>
                <input value={secret} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setSceret(e.target.value)} placeholder= "secret which should be provided at the time of withdraw for computation" id="secret" size="147" defaultValue={'1'}/>
            <button className="btn bg-green-500" onClick={ApproveAndDepositBob}>Deposit (MetaMask)</button> 
            <br/><br/><br/> d
            <label>Amount to withdraw: </label> <br/><br/>
                <input value={withdraw_amount} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setWithdraw_amount(e.target.value)} placeholder="input amount in wei"  id="bobAmt" size="147" defaultValue={'1'}/>
                <input value={withdraw_secret} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setWithdraw_secret(e.target.value)} placeholder= "secret" id="secret" size="147" defaultValue={'1'}/>
                <input value={to_address} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setTo_address(e.target.value)} placeholder= "To Address" id="To Address" size="147" defaultValue={'1'}/>
                <button className="btn bg-green-500" onClick={removehash} > sumbit withdraw request </button>
            <br/><br/><br/>
            
        </InnerPageContainer>
    )
}
