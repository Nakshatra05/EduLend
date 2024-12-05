import InnerPageContainer from "@/components/common/InnerPageContainer";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Page() {
    const { address } = useSelector((state) => state.user)
    return (
            <div className="hero py-32 bg-base-100">
            <div className="hero-content max-w-5xl flex-col lg:flex-row-reverse">

              <Link href='/anon-lender'>
                <button className="btn bg-green-500">Anon</button>
             </Link>
              <Link href='/normal-lender'>
                 <button className="btn bg-green-500">
                    Public
                 </button>
                 </Link>
                </div>
            </div>
    )
}
