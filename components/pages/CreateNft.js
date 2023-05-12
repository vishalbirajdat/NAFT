import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotConnected from '../utils/spinners.js/NotConnected';
import { contractSigner } from '../contract/contract/contract';
import { uploadFileToIPFS } from '../utils/pinata';
import { ClipLoader, PacmanLoader } from 'react-spinners';
import Router from 'next/router';
import toastFunction from '../utils/spinners.js/ToastShow';
import { TOASTS } from '../utils/constants';
import { addMyNFT, fetchMyNfts } from '../store/nftSlice';
import { getLastToken } from '../contract/contract/getFunctions';

import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../utils/firebase";

const CreateNft = () => {
    const dispatch = useDispatch();
    const { provider, address } = useSelector((state) => state.auth);
    const [fileURL, setFileURL] = useState(null);
    const [file, setFile] = useState(null);
    const [NFTimage, setNFTimage] = useState(null);
    const [isFileUploading, setIsFileUploading] = useState(null);
    const [isMinting, setIsMinting] = useState(null);
    const [isMinted, setIsMinted] = useState(null);
    const [price, setPrice] = useState(false);
    const [title, setTitle] = useState(false);

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        setFile(file);
        //check for file extension

    }



    const uploadNftURL = async () => {
        setIsFileUploading(true);
        try {
            if (file) {
                console.log(file.name);
                const fileName = new Date().valueOf().toString() + file.name;

                const imageRef = ref(storage, `images/${fileName + v4()}`);
                uploadBytes(imageRef, file).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((url) => {
                        setFileURL(url);
                        setNFTimage(url);
                        setIsFileUploading(false);
                        toastFunction(TOASTS.SUCCESS, "SUCCESSFULLY UPLOADED");
                        // setImageUrls((prev) => [...prev, url]);
                    });
                }).catch(err => {
                    console.log(err);
                    toastFunction(TOASTS.ERROR, "Something is wrong");
                    setIsFileUploading(false);
                });


            }
            else {
                toastFunction(TOASTS.ERROR, "please add nft details");
                setIsFileUploading(false);
            }
        }
        catch (e) {
            toastFunction(TOASTS.WARNING, e.message);
            setIsFileUploading(false);
        }


    };

    function OnChnagePrice(e) {
        console.log(e.target.value);
        if (e.target.value) {
            setPrice(e.target.value);
        }
    }


    function OnChnageTitle(e) {
        console.log(e.target.value);
        if (e.target.value) {
            setTitle(e.target.value);
        }
    }





    async function CreateNftOnClick(e) {
        e.preventDefault();

        setIsMinting(true);

        if (price && fileURL && title && provider) {
            try {
                const contract = await contractSigner(provider[0]);
                const tx = await contract.createToken(title, fileURL, ethers.utils.parseEther(price));
                toastFunction(TOASTS.INFO, "transaction is pending ....");
                await tx.wait();
                toastFunction(TOASTS.SUCCESS, "Minted");
                const newToken = await getLastToken();
                const data = {
                    "tokenId": newToken.toString(),
                    "title": title,
                    "nftURL": fileURL,
                    "owner": address,
                    "price": price,
                    "currentlyListed": true
                };
                setIsMinting(false);

                dispatch(addMyNFT(data));
                setFileURL(null);
                setFile(null);
                setTitle(null);
                setPrice(null);
                setIsMinted(true);

                Router.push("/collection");
            } catch (error) {
                toastFunction(TOASTS.WARNING, error.message);
                setIsMinting(false);
            }
        } else {
            toastFunction(TOASTS.ERROR, "something wrong");
            setIsMinting(false);
        }


        console.log("mint");

    }





    return (


        <>{provider ?

            <div>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "30px", paddingBottom: "30px", paddingLeft: "4px", paddingRight: "4px"
                }}>

                    <div style={{
                        display: "flex", flexDirection: "column", paddingTop: "30px", paddingBottom: "30px", paddingLeft: "4px", paddingRight: "4px", gap: "20px"
                    }}>






                        <button className="btn btn-secondary" style={{
                            display: 'flex',
                            alignItems: "center",
                        }}>

                            <div style={{ marginRight: "40px", width: "auto" }}>Title</div>
                            <input type={'text'} style={{ height: "40px", width: "auto" }} onChange={OnChnageTitle} placeholder={"title"} className="search-field" />
                        </button>




                        <button className="btn btn-secondary" style={{
                            display: 'flex',
                            alignItems: "center",
                        }}>

                            <div style={{ marginRight: "40px", width: "auto" }}>NFT</div>
                            <input type={'file'} style={{ height: "40px", width: "auto" }} onChange={OnChangeFile} className="search-field" />
                        </button>


                        {NFTimage &&
                            <img src={NFTimage} alt="wait..." width="200px" />
                        }


                        <p style={{
                            color: "rbga(0, 0, 0, 50%)",
                            margin: "5px",
                            fontSize: "12px"
                        }}>minimun price must be 0.001</p>


                        <button className="btn btn-secondary" style={{
                            display: 'flex',
                            alignItems: "center",
                        }}>

                            <div style={{ marginRight: "40px", width: "auto" }}>price</div>
                            <input type={'text'} style={{ height: "40px", width: "auto" }} onChange={OnChnagePrice} placeholder={"price"} className="search-field" />
                        </button>


                    </div>
                </div>
                <div className="header-actions" style={{ margin: "20px" }}>

                    {!isMinted ? <>
                        {isFileUploading ? <button className="btn btn-second" style={{
                            border: "none"
                        }}>
                            <PacmanLoader color={"white"} loading={true} size={20} />
                        </button> : fileURL ? isMinting ? <button className="btn btn-second" style={{
                        }}>
                            <ClipLoader color={"white"} loading={true} size={20} />
                        </button> :
                            <button onClick={CreateNftOnClick} className="btn btn-primary">Mint</button> :
                            <button onClick={uploadNftURL} className="btn btn-primary">Upload File</button>
                        }
                    </> : <>
                        <button onClick={() => { Router.push('/collection'); }} className="btn btn-primary">Go Collection</button>
                    </>}



                </div>
            </div>

            : <NotConnected />
        }</>
    );
};

export default CreateNft;
