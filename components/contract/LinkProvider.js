import { ethers } from 'ethers';
import React from 'react'
import { TOASTS } from '../utils/constants';
import toastFunction from '../utils/spinners.js/ToastShow';


const LinkProvider = () => {
    try {
    const providerLink = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_HTTP_URL
    );
    return providerLink;
    } catch (error) {
        toastFunction(TOASTS.WARNING, "Something went wrong");
        console.log(error.message);
        return false;
    }
}

export default LinkProvider
