import checkWallet from "./checkWallet"
import { ethers } from "ethers"
import { TOASTS } from "./constants";
import toastFunction from "./spinners.js/ToastShow";


const network = [{
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
}];



const connectWallet = async () => {
    if (checkWallet) {

        try {

            // const providerWallet = await new ethers.providers.Web3Provider(await window.ethereum, "any");

            const providerWallet = await new ethers.providers.Web3Provider(window.ethereum);
            await providerWallet.send('eth_requestAccounts', []);

            if (providerWallet.network != 'matic') {
                try {

                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: network
                    })
                    return providerWallet
                } catch (error) {
                    toastFunction(TOASTS.WARNING, error.message);
                    return false;
                }

            } else if (providerWallet.network == 'matic') {
                return providerWallet
            } else {
                toastFunction(TOASTS.WARNING, "Add Mumbai Polygon Test network in  Metamsk Wallet");
                return false
            }


        } catch (error) {
            try {
                if (!window.ethereum) {
                    toastFunction(TOASTS.WARNING, "Install Metamsk Wallet");
                    return false
                } else {
                    toastFunction(TOASTS.WARNING, "Something went wrong");
                    return false
                }
            } catch (error) {
                toastFunction(TOASTS.WARNING, error.message);
                return false
            }
        }

    } else {
        toastFunction(TOASTS.WARNING, "Install Metamsk Wallet");
        return false
    }
}

const connectToWallet = async () => {
    let provider = await connectWallet();
    return provider;
}




export default connectToWallet;