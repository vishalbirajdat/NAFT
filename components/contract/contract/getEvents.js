import { ethers } from 'ethers';
import { TOASTS } from '../../utils/constants';
import toastFunction from '../../utils/spinners.js/ToastShow';
import { contractLinkProvider } from './contract';
import { parseUnits } from 'ethers/lib/utils';
const getEventContract = async (tokenId, title, nftURL,
    owner,
    price,
    currentlyListed
    ) => {
    try {


        // const linkContract = contract;
        const linkContract = await contractLinkProvider();

       
        if (linkContract) {
            const newContractList = await linkContract.filters.TokenListedSuccess(
                tokenId, title, nftURL,
                owner,
                price,
                currentlyListed
            );

            // if (gameOwner || amount || contractAddress) {
            //     newContractList = await contract.filters.NewGameCreated(gameOwner, amount, contractAddress);
            // }


            
            const getFilter = await linkContract.queryFilter(newContractList);
            const getData = await getFilter.reverse().map((e) => {
                const pruint = parseUnits(item.price._hex, 16) / 1000000000000000000;
                const pr = pruint.toHexString().toString();
                return {
                    tokenId: e.args.tokenId.toString(),
                    title: e.args.title.toString(),
                    nftURL: e.args.nftURL.toString(),
                    owner:e.args.owner.toString(),
                    price :pr,
                    currentlyListed:e.args.currentlyListed
                }
            });

        
            console.log("getData");
            return getData;
        }
        else {
            console.log("contract errror in getEventContract");
            toastFunction(TOASTS.WARNING, "Something went wrong");
            return false;
        }
    } catch (error) {
        console.log(error.message);
        toastFunction(TOASTS.WARNING, "Something went wrong");
        return false;
    }
}

export default getEventContract;

