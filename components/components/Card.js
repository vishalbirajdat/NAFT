import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { contractSigner } from '../contract/contract/contract';
import { getUsernameData } from '../contract/contract/getFunctions';
import { fetchAllNfts, fetchMyNfts } from '../store/nftSlice';
import { TOASTS } from '../utils/constants';
import toastFunction from '../utils/spinners.js/ToastShow';
import { Storage } from 'aws-amplify';

function Card({ props }) {
    const dispatch = useDispatch();
    const { provider, address } = useSelector((state) => state.auth);
    const [username, setUsername] = useState(null)
    const [buyerUsername, setBuyerUsername] = useState(null)
    const [buying, setBuying] = useState(false)
    const [isBuying, setIsBuying] = useState(false)
    const [image, setImage] = useState('')

    console.log("props");
    console.log(props);

    useEffect(() => {
        getUrl();
        setUsernameFun();
    }, [props.tokenId])

    const setUsernameFun = async () => {
        const user = await getUsernameData(props.tokenId);
        setUsername(user);
    }

    const OnChnageUsername = (e) => {
        e.preventDefault();
        setBuyerUsername(e.target.value);
    }

    const isBuyingNow = () => {
        if (!buying) {
            setBuying(true);
        }
    }

    const isBuyingNowCancel = () => {
        if (buying) {
            setBuying(false);
        }
    }

    const getUrl = async ()=>{
        await Storage.get(props.nftURL, { download: true }).then(res => {
            console.log("cards")
            console.log(res)
            setImage(URL.createObjectURL(res.Body))
        }).catch((err) => {
                 toastFunction(TOASTS.WARNING, "Something went wrong");
                 console.log("cards")
                 console.log(err);
                });
    }
  

  
    console.log("image")
    console.log(image);

 

    const BuyNFT = async (e) => {
        e.preventDefault();
        
        if (provider) {
            setIsBuying(true);
            if (buyerUsername) {
            try {
                const contract = await contractSigner(provider[0]);
                console.log(contract);
                const tx = await contract.executeSale(buyerUsername, props.tokenId, { value: ethers.utils.parseEther(props.price.toString()) });
                toastFunction(TOASTS.INFO, "pending transaction... Please wait.... ");
                await tx.wait();
                toastFunction(TOASTS.SUCCESS, "Successfully Buyed");
                setIsBuying(false);
                dispatch(fetchAllNfts());
                dispatch(fetchMyNfts(provider[0]));
            } catch (error) {
                toastFunction(TOASTS.WARNING, error.message);
                setIsBuying(false);
            }
        }else{
                toastFunction(TOASTS.ERROR, "Add username ");
                setIsBuying(false);
        }
        } else {
            toastFunction(TOASTS.ERROR, "connect to wallet");
        }

    }

    return (
        <>
            {props.show && 


            <li className="product-item">

                <div className="product-card" tabIndex="0">
                            <figure className="product-banner">

                            <img src={image} alt="Getting NFT Data From Pinata So it take some minutes to display wait ..." />

                            </figure>

                            <div className="product-content">

                                <a href="#" className="h4 product-title">{props.title}</a>

                                <div className="product-meta">
                                {!buying &&  
                                    <div className="product-author">
                             
                                        <figure className="author-img">
                                            <img src="/images/bidding-user.png" alt="Jack Reacher" />
                                        </figure>

                                <div className="author-content">
                                            <h4 className="h5 author-title">{props.owner ? `${props.owner.slice(0, 4)} ... ${props.owner.slice(-4)}` : "...."}</h4>

                                            <a href="#" className="author-username">@{username ? username : "...."}</a>
                                        </div>
                                    </div>
                                }

                                {!buying &&   <div className="product-price">
                                        <data value="0.568">{props.price}</data>

                                        <p className="label">MATIC</p>
                                    </div>
                            }
                                </div>

                                <div className="product-footer">
                                    {!address || address != props.owner ?



                                    buying ?
                                            <div>

                                                < div >
                                                <input type={'text'} style={{ height: "40px", width: "auto", marginBottom: "40px" }} onChange={OnChnageUsername} placeholder={"username"} className="search-field" />
                                                </div>

                                           { !isBuying ?

                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: "20px"
                                                }}>
                                                    <button className="place-bid-btn" onClick={BuyNFT}>Buy Now</button>
                                                    <button className="btn-secondar" onClick={isBuyingNowCancel}>Cancel</button>
                                                </div> :
                                            <button className="btn btn-second">
                                                <ClipLoader color={"#ffffff"} loading={true} size={25} cssOverride={{
                                                    background: 'transparent'
                                                }} />
                                            </button>
                                    }
                                            </div>
                                            : <>

                                                <button className="place-bid-btn" onClick={isBuyingNow}>Buy Now</button>

                                            </>
                                        :
                                        <button className="place-bid-btn">Collection</button>
                                    }
                                </div>

                            </div>
                </div>
            </li>

                                }
        </>

    )
}

export default Card