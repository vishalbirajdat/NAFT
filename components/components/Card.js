import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { contractSigner } from '../contract/contract/contract';
import { getUsernameData } from '../contract/contract/getFunctions';
import { balanceChanged } from '../store/authSlice';
import { fetchAllNfts, fetchMyNfts } from '../store/nftSlice';
import { TOASTS } from '../utils/constants';
import toastFunction from '../utils/spinners.js/ToastShow';

function Card({ props }) {
    const dispatch = useDispatch();
    const { provider, address } = useSelector((state) => state.auth);
    const [buyerUsername, setBuyerUsername] = useState(null);
    const [sellerPrice, setSellerPrice] = useState(null);
    const [buying, setBuying] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [slider, setSlider] = useState(props.currentlyListed ? `slideron` : `slideroff`);
    const [image, setImage] = useState('');

    console.log(props.owner, address);

    useEffect(() => {
        getUrl();
    }, [props.tokenId]);


    const ChangeThePrice = async (e) => {
        e.preventDefault();

        if (provider) {
            setIsBuying(true);
            if (sellerPrice) {
                try {
                    const contract = await contractSigner(provider[0]);
                    console.log(contract);
                    const tx = await contract.changePrice(ethers.utils.parseEther(sellerPrice), props.tokenId);
                    toastFunction(TOASTS.INFO, "pending transaction... Please wait.... ");
                    await tx.wait();
                    setIsBuying(false);
                    setBuying(false);
                    toastFunction(TOASTS.SUCCESS, "Successfully Changed Price");
                    dispatch(fetchAllNfts());
                    dispatch(fetchMyNfts(provider[0]));
                    setSellerPrice(null);
                } catch (error) {
                    toastFunction(TOASTS.WARNING, error.message);
                    setIsBuying(false);
                }
            } else {
                toastFunction(TOASTS.ERROR, "Add Price ");
                setIsBuying(false);
            }
        } else {
            toastFunction(TOASTS.ERROR, "connect to wallet");
        }

    };

    const OnChnagePrice = (e) => {
        e.preventDefault();
        setSellerPrice(e.target.value);
    };



    const changeSell = async (e) => {
        e.preventDefault();
        try {

            if (props.currentlyListed) {
                try {
                    setSlider(`slideroff`);
                    const contract = await contractSigner(provider[0]);
                    const tx = await contract.disableNft(props.tokenId);
                    toastFunction(TOASTS.INFO, "pending transaction... Please wait.... ");
                    await tx.wait();
                    toastFunction(TOASTS.SUCCESS, "Now NFT is disabled ");
                    dispatch(fetchAllNfts());
                    dispatch(fetchMyNfts(provider[0]));
                } catch (error) {
                    console.log(error.message);
                    setSlider(`slideron`);
                }

            } else {
                try {
                    setSlider(`slideron`);
                    const contract = await contractSigner(provider[0]);
                    const tx = await contract.enableNft(props.tokenId);
                    toastFunction(TOASTS.INFO, "pending transaction... Please wait.... ");
                    await tx.wait();
                    toastFunction(TOASTS.SUCCESS, "Now NFT enable for sell ");
                    dispatch(fetchAllNfts());
                    dispatch(fetchMyNfts(provider[0]));
                } catch (error) {
                    console.log(error.message);
                    setSlider(`slideroff`);
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    };


    const OnChnageUsername = (e) => {
        e.preventDefault();
        setBuyerUsername(e.target.value);
    };

    const isBuyingNow = () => {
        if (!buying) {
            setBuying(true);
        }
    };

    const isBuyingNowCancel = () => {
        if (buying) {
            setBuying(false);
        }
    };

    const getUrl = async () => {
        setImage(props.nftURL);
    };



    console.log("image");
    console.log(image);



    const BuyNFT = async (e) => {
        e.preventDefault();

        if (provider) {
            setIsBuying(true);
            try {
                const contract = await contractSigner(provider[0]);
                console.log(contract);
                const tx = await contract.executeSale(props.tokenId, { value: ethers.utils.parseEther(props.price.toString()) });
                toastFunction(TOASTS.INFO, "pending transaction... Please wait.... ");
                await tx.wait();
                toastFunction(TOASTS.SUCCESS, "Successfully Buyed");
                setIsBuying(false);
                setBuying(false);
                setBuyerUsername(null);
                try {
                    let balance = provider[0].getSigner().getBalance();
                    dispatch(balanceChanged(ethers.utils.formatEther(balance)));
                } catch (error) {
                    console.log(error);
                }
                dispatch(fetchAllNfts());
                dispatch(fetchMyNfts(provider[0]));
            } catch (error) {
                toastFunction(TOASTS.WARNING, error.message);
                setIsBuying(false);
            }

        } else {
            toastFunction(TOASTS.ERROR, "connect to wallet");
        }

    };

    return (
        <>
            {props.ownnft ? (!address || address != props.owner) ?

                <li className="product-item">

                    <div className="product-card" tabIndex="0">
                        <a href={`https://mumbai.polygonscan.com/token/0x7d9a27484b15008f608f201b624d0713503c9a66?a=${props.tokenId}`}>

                            <figure className="product-banner">

                                <img src={image} alt="Getting NFT Data From Pinata So it take some minutes to display wait ..." />

                            </figure>
                        </a >

                        <div className="product-content">

                            <a className="h4 product-title" style={{
                                color: 'white'
                            }}>{props.title}</a>

                            <div className="product-meta" style={{
                                color: 'white'
                            }}>
                                {!buying &&
                                    <div className="product-author">

                                        <figure className="author-img">
                                            <img src="/images/bidding-user.png" alt="Jack Reacher" />
                                        </figure>

                                        <div className="author-content">
                                            <h4 className="h5 author-title">{props.owner ? `${props.owner.slice(0, 4)} ... ${props.owner.slice(-4)}` : "...."}</h4>

                                        </div>
                                    </div>
                                }

                                {!buying && <div className="product-price">
                                    <data value="0.568">{props.price}</data>

                                    <p className="label">MATIC</p>
                                </div>
                                }
                            </div>

                            <div className="product-footer">
                                {



                                    buying ?
                                        <div>

                                            < div >
                                                <input type={'text'} style={{ height: "40px", width: "auto", marginBottom: "40px" }} onChange={OnChnageUsername} placeholder={"username"} className="search-field" />
                                            </div>

                                            {!isBuying ?

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

                                            <button className="place-bid-btn" onClick={BuyNFT}>Buy Now</button>

                                        </>


                                }
                            </div>

                        </div>
                    </div>
                </li>
                :

                <li className="product-item">
                    <div className="product-card" tabIndex="0">

                        <div style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: "20px",
                            marginBottom: "20px",
                        }}>
                            <span style={{
                                height: "20px",
                                paddingTop: "25px",
                                paddingBottom: "25px",

                            }}>Sell</span>
                            <div onClick={changeSell} >

                                <label className="switch" >
                                    <input type="checkbox" />
                                    <span className={`slider ${slider}`} ></span>
                                </label>
                            </div>

                        </div>

                        <a href={`https://mumbai.polygonscan.com/token/0x7d9a27484b15008f608f201b624d0713503c9a66?a=${props.tokenId}`}>

                            <figure className="product-banner">

                                <img src={image} alt="Getting NFT Data From Pinata So it take some minutes to display wait ..." />

                            </figure>
                        </a >

                        <div className="product-content">

                            <a className="h4 product-title" style={{
                                color: 'white'
                            }}>{props.title}</a>

                            <div className="product-meta" style={{
                                color: 'white'
                            }}>
                                {!buying &&
                                    <div className="product-author">

                                        <figure className="author-img">
                                            <img src="/images/bidding-user.png" alt="Jack Reacher" />
                                        </figure>

                                        <div className="author-content">
                                            <h4 className="h5 author-title">{props.owner ? `${props.owner.slice(0, 4)} ... ${props.owner.slice(-4)}` : "...."}</h4>

                                        </div>
                                    </div>
                                }

                                {!buying && <div className="product-price">
                                    <data value="0.568">{props.price}</data>

                                    <p className="label">MATIC</p>
                                </div>
                                }
                            </div>

                            <div className="product-footer">
                                {


                                    buying ?
                                        <div>

                                            < div >
                                                <input type={'text'} style={{ height: "40px", width: "auto", marginBottom: "40px" }} onChange={OnChnagePrice} placeholder={"price"} className="search-field" />
                                            </div>

                                            {!isBuying ?

                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    gap: "20px"
                                                }}>
                                                    <button className="place-bid-btn" onClick={ChangeThePrice}>Change Price</button>
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
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "20px",
                                                alignItems: 'center',
                                            }}>
                                                <button className="place-bid-btn" onClick={isBuyingNow}>Change Price</button>



                                            </div>
                                        </>
                                }
                            </div>

                        </div>
                    </div>
                </li >

                : (!address || address != props.owner) && props.currentlyListed &&

                <li className="product-item">

                    <div className="product-card" tabIndex="0">
                        <a href={`https://mumbai.polygonscan.com/token/0x7d9a27484b15008f608f201b624d0713503c9a66?a=${props.tokenId}`}>

                            <figure className="product-banner">

                                <img src={image} alt="Getting NFT Data From Pinata So it take some minutes to display wait ..." />

                            </figure>
                        </a >

                        <div className="product-content">

                            <a className="h4 product-title" style={{
                                color: 'white'
                            }}>{props.title}</a>

                            <div className="product-meta" style={{
                                color: 'white'
                            }}>
                                {!buying &&
                                    <div className="product-author">

                                        <figure className="author-img">
                                            <img src="/images/bidding-user.png" alt="Jack Reacher" />
                                        </figure>

                                        <div className="author-content">
                                            <h4 className="h5 author-title">{props.owner ? `${props.owner.slice(0, 4)} ... ${props.owner.slice(-4)}` : "...."}</h4>

                                        </div>
                                    </div>
                                }

                                {!buying && <div className="product-price">
                                    <data value="0.568">{props.price}</data>

                                    <p className="label">MATIC</p>
                                </div>
                                }
                            </div>

                            <div className="product-footer">
                                {



                                    buying ?
                                        <div>

                                            < div >
                                                <input type={'text'} style={{ height: "40px", width: "auto", marginBottom: "40px" }} onChange={OnChnageUsername} placeholder={"username"} className="search-field" />
                                            </div>

                                            {!isBuying ?

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

                                            <button className="place-bid-btn" onClick={BuyNFT}>Buy Now</button>

                                        </>


                                }
                            </div>

                        </div>
                    </div>
                </li>
            }
        </>

    );
}

export default Card;