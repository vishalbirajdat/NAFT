import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react'
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
import { Amplify, Storage } from 'aws-amplify';

const CreateNft = () => {
    const dispatch = useDispatch();
    const { provider, address } = useSelector((state) => state.auth);
    const [fileURL, setFileURL] = useState(null);
    const [file, setFile] = useState(null);
    const [NFTimage, setNFTimage] = useState(null);
    const [isFileUploading, setIsFileUploading] = useState(null);
    const [isMinting, setIsMinting] = useState(null);
    const [isMinted, setIsMinted] = useState(null);
    const [username, setUsername] = useState(false);
    const [price, setPrice] = useState(false);
    const [title, setTitle] = useState(false);

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        setFile(file);
        //check for file extension

    }

    useEffect(() => {
        Amplify.configure({
            Auth: {
                mandatorySignIn: false,
                identityPoolId: 'us-east-2:cb760161-bb1f-4dd4-9018-49c443a9cce5', //REQUIRED - Amazon Cognito Identity Pool ID
                region: 'us-east-2', // REQUIRED - Amazon Cognito Region
            },
            Storage: {
                AWSS3: {
                    bucket: 'nft-vishal-0987', //REQUIRED -  Amazon S3 bucket name
                    region: 'us-east-1',
                }
            }
        });
    }, [provider])


    const uploadNftURL = async () => {
        setIsFileUploading(true);
        try {
            if (file) {
                console.log(file.name);
                const fileName = new Date().valueOf().toString() + file.name;
                await Storage.put(fileName , file).then(async res => {
                    console.log("Uploaded image to s3: ", res.key)
                    setFileURL(res.key);
                    toastFunction(TOASTS.SUCCESS, "Success Fully Uploaded File");
                    setNFTimage(`https://nft-vishal-0987.s3.amazonaws.com/public/${res.key
                        }`)
                    setIsFileUploading(false);
                }
                ).catch(err => {
                    console.log(err);
                    toastFunction(TOASTS.ERROR, "Something is wrong");
                    setIsFileUploading(false)
                })
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


    }

    function OnChnagePrice(e) {
        console.log(e.target.value);
        if (e.target.value) {
            setPrice(e.target.value);
        }
    }

    function OnChnageUsername(e) {
        console.log(e.target.value);
        if (e.target.value) {
            setUsername(e.target.value);
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

        if (price && fileURL && title && username && provider) {
            try {
                const contract = await contractSigner(provider[0]);
                const tx = await contract.createToken(username, title, fileURL, ethers.utils.parseEther(price));
                toastFunction(TOASTS.INFO, "transaction is pending ....");
                await tx.wait();
                toastFunction(TOASTS.SUCCESS, "Minted");
                const newToken = await getLastToken();
                const data = {
                    "tokenId":newToken.toString(),
                    "title": title,
                    "nftURL": fileURL,
                    "owner": address,
                    "price": price,
                    "currentlyListed": true
                }
                setIsMinting(false);

                dispatch(addMyNFT(data));
                setFileURL(null);
                setFile(null);
                setUsername(null);
                setTitle(null);
                setPrice(null);
                setIsMinted(true);

                Router.push("/collection")
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

                            <div style={{ marginRight: "40px", width: "auto" }}>Username</div>
                            <input type={'text'} style={{ height: "40px", width: "auto" }} onChange={OnChnageUsername} placeholder={"username"} className="search-field" />
                        </button>




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
                        <button onClick={() => { Router.push('/collection') }} className="btn btn-primary">Go Collection</button>
                    </>}



                </div>
            </div>

            : <NotConnected />
        }</>
    )
}

export default CreateNft
