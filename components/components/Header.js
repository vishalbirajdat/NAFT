import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import connectToWallet from '../utils/connectToWallet';
import { useDispatch, useSelector } from 'react-redux';
import { changed } from '../store/authSlice';
import { TOASTS } from '../utils/constants';
import ClipLoader from "react-spinners/ClipLoader";
import PacmanLoader from "react-spinners/PacmanLoader";
import toastFunction from '../utils/spinners.js/ToastShow';
import { ethers } from 'ethers';

const Header = () => {
    const dispatch = useDispatch();
    const { provider, address, balance
    } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        try {
            ethereum?.on("accountsChanged", AccountChanged);
            return () => {
                ethereum?.removeListener("accountsChanged", AccountChanged);
            };
        } catch (e) {
            console.log(e.message)
        }
    });



 

    const AccountChanged = async () => {
        toastFunction(TOASTS.INFO, "Wallet changed");
        await connectWallet();
    }



    const connectWallet = async (e) => {
        if (e) {
            e.preventDefault();
        }

        setLoading(true)
        const provider = await connectToWallet();
       
        try {

            if (provider) {
                const wallet = provider.getSigner();
                let address = await wallet.getAddress();
                let balance = await wallet.getBalance();
                setLoading(false);
                dispatch(changed({
                    provider: [provider], address: address, balance
                        : ethers.utils.formatEther(balance)
                }));
                toastFunction(TOASTS.SUCCESS, "Successfully Connected");
            } else {
                setLoading(false);
            }
        } catch (error) {
            toastFunction(TOASTS.WARNING, error.message);
            setLoading(false);
        }



    }
  
  return (
    <div>

          <header>

              <div className="container">

                  <div className="logo">
                      <img src="/images/logo.png" onClick={() => { Router.push("/") }} alt="NAFT logo" />
                  </div>

                  <div className="header-right">

                      <div className="header-nav-wrapper">

                          <nav className="navbar" >

                              <ul className="navbar-list">

                                  <li>
                                      <div onClick={() => { Router.push("/") }} className="navbar-link">Home</div>
                                  </li>

                                  <li>
                                      <div onClick={() => { Router.push("/#explore") }} className="navbar-link">Explore</div>
                                  </li>

                                  <li>
                                      <div onClick={() => { Router.push("/createnft") }}  className="navbar-link">Create NFT</div>
                                  </li>

                                  <li>
                                      <div onClick={() => { Router.push("/collection") }} className="navbar-link">Collection</div>
                                  </li>

                              </ul>

                          </nav>

                      </div>

                      <div className="header-actions">
                          {!loading ? <><button onClick={connectWallet} className="btn btn-primary">
                              {provider ? <>
                                  <div style={{
                                      display: 'flex',
                                      alignItems:'center',
                                      gap: "20px"
                                  }} >
                                      <div>
                                          {balance.slice(0, 4)} MATIC
                                      </div>
                                      <div>
                                          {`${address.slice(0, 4)} ... ${address.slice(-4)}`}
                                      </div>
                                      
                                  </div>
                              </> : "Wallet"}
                          </button></> : 
                          <>
                          <button   className="btn btn-primary">
                              <ClipLoader color={"#ffffff"} loading={true} size={30} cssOverride={{
                                  background: 'transparent'
                              }} />
                          </button>
                          {/* <div className="btn btn-secondar" style={{
                              display: 'flex',
                              justifyItems:'center',
                              border:'none'
                          }}>
                              <PacmanLoader color={"#ffffff"} loading={true} size={20} cssOverride={{
                                  background: 'transparent',
                                  display: 'inline'
                              }} />
                          </div> */}

                              </>

                            }
                          


                      </div>

                  </div>

              </div>

          </header>

    </div>
  )
}

export default Header
