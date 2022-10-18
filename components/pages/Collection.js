import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Explore from '../components/Explore';
import NotConnected from '../utils/spinners.js/NotConnected';
import { fetchMyNfts, updateToastId } from '../store/nftSlice';

const Collection = () => {
    const dispatch = useDispatch();
    const { MyNFT, Toast } = useSelector((state) => state.nfts);
    const { provider } = useSelector((state) => state.auth);


    useEffect(() => {
        if (provider) {
            dispatch(fetchMyNfts(provider[0]));
        }
    }, [provider])


  return (
    <div>
      <>{provider ? 
          MyNFT.NFT ? MyNFT.NFT.length > 0 ?
              <Explore name={"My NFT"} ownnft={true} explore={MyNFT.NFT} />
          : <><Explore name={"My NFT"} ownnft={true} explore={[]} /> </>
          : <><Explore name={"My NFT"} ownnft={true} explore={[]} /> </>
          :
        <NotConnected />
      }
      </>
    </div>
  )
}

export default Collection
