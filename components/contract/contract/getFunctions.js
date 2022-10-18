import { TOASTS } from '../../utils/constants';
import toastFunction from '../../utils/spinners.js/ToastShow';
import { contractLinkProvider,  contractSigner } from './contract';

export const getAllNftsData = async () => {
    // const linkContract = contract;

    try {
    const linkContract = await contractLinkProvider();
    const data = await linkContract.getAllNFTs();
    try {
   
    const getData = await data.map((item) => {
        const pr = parseInt(item.price.toString()) / 1000000000000000000;
        return {
            "tokenId":  item.tokenId.toString(),
            "title": item.title.toString(),
            "nftURL": item.nftURL.toString(),
            "owner": item.owner.toString(),
            "price": pr.toString(),
            "currentlyListed": item.currentlyListed
               }
    })  

    return getData;
    } catch (error) {
        toastFunction(TOASTS.WARNING, "Something went wrong");
            console.log(error.message);
            return false;
    }

} catch (error) {
    toastFunction(TOASTS.WARNING, "Something went wrong");
    console.log(error.message);
    return false;
}
}

export const getMyNftsData = async (provider) => {
    // const linkContract = contract;

    try {
    
    const linkContract = await contractSigner(provider);
    if (linkContract) {
    const data = await linkContract.getMyNFTs();
    const getData = await data.map((item) => {
        const pr = parseInt(item.price.toString()) / 1000000000000000000;
        return {
            "tokenId": item.tokenId.toString(),
            "title": item.title.toString(),
            "nftURL": item.nftURL.toString(),
            "owner": item.owner.toString(),
            "price": pr.toString(),
            "currentlyListed": item.currentlyListed
        }
    })

    return getData;
    }else{
       toastFunction(TOASTS.WARNING, "Something went wrong");
        return false;  
    }


    } catch (error) {
        toastFunction(TOASTS.WARNING, "Something went wrong");
        console.log(error.message);
        return false;
    }

}



export const getUsernameData = async (_id) => {
    try {
        
 
    const linkContract = await contractLinkProvider();
    const usernamepromise = await linkContract.getUsername(_id);
    return usernamepromise;

    } catch (error) {
        toastFunction(TOASTS.WARNING, "Something went wrong");
        console.log(error.message);
        return false;
    }
}


export const getLastToken = async () => {
    try {
    const linkContract = await contractLinkProvider();
    const tokenID = await linkContract.getCurrentToken();
    return tokenID;
} catch (error) {
    toastFunction(TOASTS.WARNING, "Something went wrong");
    console.log(error.message);
    return false;
}
}



