import Link from 'next/link'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import Navlinks from './Navlinks'
import { themeChange } from 'theme-change'
import { useEffect, useState } from 'react'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { useSelector, useDispatch } from 'react-redux'
import { updateAddress, updateWeb3 } from '../app/user/userSlice'
import Web3 from 'web3'

function Navbar(){

    // const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))
    const [currentTheme, setCurrentTheme] = useState(null)
    const {address} = useSelector((state) => state.user)
    const [account, setAccount] = useState('')
    const dispatch = useDispatch()

    const logoutUser = () => {
        dispatch(updateAddress('hello'))
    }

    const displayAddressWithEllipsis = (address, length = 4) => {
        if (!address) return "";
        let prefix = address.substring(0, length);
        let sufix = address.substring(address.length - length);
    
        return `${prefix}...${sufix}`;
      };

    // const connectWallet = async () => {
    //     // console.log(web3)
    //     let web3 =  new Web3(window.ethereum).request({ method: 'eth_requestAccounts', params: [] });
    //     // await web3.request({ method: 'eth_requestAccounts', params: [] });
    // }
    const connectWallet = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          alert("Please install Metamask!");
        }
    
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Found an account! Address: ", accounts[0]);
          setAccount(accounts[0]);
          dispatch(updateAddress(accounts[0]))
        } catch (err) {
          console.log(err)
        }
      }

      const checkWalletIsConnected = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have Metamask installed!");
          return;
        } else {
          console.log("Wallet exists! We're ready to go!")
        }

        // dispatch(updateWeb3(new Web3(window.ethereum)))
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);
          setAccount(account);
          dispatch(updateAddress(account))
        } else {
          console.log("No authorized account found");
        }
      }

    // useEffect(() => {
        
    //   }, [])

    useEffect(() => {
        checkWalletIsConnected();
        themeChange(false)
        console.log(currentTheme)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
        // 👆 false parameter is required for react project
      }, [])


    return(
        <div className="w-full flex justify-center  shadow-md  text-primary-content bg-green-500">
        <div className="navbar  max-w-5xl">
        <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <Bars3Icon className="h-5 inline-block w-5"/>
            </label>
        </div> 
  
  
        <div className="flex-1 px-2 mx-2">
            <Link href="/">
            <span className='font-bold text-xl'>
                <img className="mask inline-block mr-2 mask-circle w-10" src="/logo.png" /> EDU-LEND
            </span>
            </Link>
        </div>
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal">
                <Navlinks />
          </ul>

        
          {/* <label className="swap ">
                <input type="checkbox"/>
                <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-5 h-5 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-5 h-5 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
            </label> */}

            {address ? <div className="dropdown ml-6 dropdown-end arrow">
                 {/* <label tabIndex={0} className="btn btn-ghost btn-circle avatar"> */}
                    {/* <div className="w-6 rounded-full"> */}
                    {displayAddressWithEllipsis(address)}
                    {/* </div> */}
                {/* </label>  */}
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100  rounded-box w-52">
                    <li className="justify-between">
                    <Link href={'/app/settings-profile'}>
                        Settings
                        </Link>
                    </li>
                    <div className="divider mt-0 mb-0"></div>
                    {/* <li><a onClick={logoutUser}>Logout</a></li> */}
                </ul>
            </div> : <button onClick={connectWallet}>Connect Wallet</button>}
        </div>
      </div>
      </div>
    )
}

export default Navbar