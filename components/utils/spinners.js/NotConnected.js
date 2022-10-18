import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { changed } from '../../store/authSlice';
import connectToWallet from '../connectToWallet';
import ClipLoader from "react-spinners/ClipLoader";
import toastFunction from './ToastShow';
import { TOASTS } from '../constants';
import { ethers } from 'ethers';


const NotConnected = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();


    const connectWallet = async (e) => {
        if (e) {
            e.preventDefault();
        }

        setLoading(true)

        //  
        let provider;
        try {
            provider = await connectToWallet();
            setLoading(false);
        } catch (error) {
            toastFunction(TOASTS.WARNING, error.message);
            setLoading(false);

        }
        try {

            if (provider) {
                const wallet = await provider.getSigner();
                let address = await wallet.getAddress();
                let balance = await wallet.getBalance();
                setLoading(false);
                dispatch(changed({ provider: [provider], address: address, balance: ethers.utils.formatEther(balance) }));
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
      <div style={{
        width: "100%",
        height: "100vh",
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: "hsl(0,0%,10%, 0.6)",
      }}>
        <ClipLoader color={"#ffffff"} loading={loading} size={150} cssOverride={{
          background: 'transparent'
        }} />
          <div className="header-actions">
              {!loading ? <><button onClick={connectWallet} className="btn btn-primary">
                Connect To Wallet 
              </button></> :
                  <button className="btn btn-primary">
                      <ClipLoader color={"#ffffff"} loading={true} size={30} cssOverride={{
                          background: 'transparent'
                      }} />
                  </button>
              }
          </div> 
    </div>
  )
}

export default NotConnected