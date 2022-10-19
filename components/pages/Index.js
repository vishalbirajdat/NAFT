import React, { useEffect, useState } from 'react'
import { fetchAllNfts, toastIsLoaded } from '../store/nftSlice';
import { useDispatch, useSelector  } from 'react-redux';
import Hero from '../components/Hero';
import Steps from '../components/Steps';
import Explore from '../components/Explore';
import { toast } from 'react-toastify';
import { STATUSES, TOASTS } from '../utils/constants';
import PacmanLoader from "react-spinners/PacmanLoader";
import toastFunction from '../utils/spinners.js/ToastShow';

const Index = () => {
  const dispatch = useDispatch();
  const { AllNFT  } = useSelector((state) => state.nfts);
  const { provider } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true)
  // const loading = AllNFT.AllNFT && AllNFT.AllNFT.length && AllNFT.AllNFT.length >= 0 ? false:true;
  console.log(AllNFT.AllNFT.length);
  useEffect(() => {
    dispatch(fetchAllNfts());
  }, [provider])


  useEffect(() => {

      if (AllNFT.status == STATUSES.ERROR){
        toastFunction(TOASTS.ERROR, "Something went wrong");
      }
      if (AllNFT.status == STATUSES.IDLE){
        toastFunction(TOASTS.SUCCESS, "Successfully Collected All NFTs");
        setLoading(false)
    
      }
      if (AllNFT.status == STATUSES.LOADING){
        toastFunction(TOASTS.INFO, "Collecting NFTs ...");
      }
      
  }, [AllNFT.status])
  


  return (
    <div >

      


      {loading &&
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
        backgroundColor: "hsl(0,0%,10%, 0.8)",
        pointerEvents: 'none'
      }}>
          <PacmanLoader color={"#ffffff"} loading={true} size={100} cssOverride={{
            background: 'transparent',
            display: 'inline'
          }} />
      </div>
}


      <Hero />
      <Steps />

      {!loading &&
        <Explore name={"All NFTs"} ownnft={false} explore={AllNFT.AllNFT} /> 
}
    </div>
  )
}

export default Index
