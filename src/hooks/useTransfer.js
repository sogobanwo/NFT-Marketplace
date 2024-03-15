import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getNFTContract } from "../constants/contracts";
import toast from "react-hot-toast";

const useTransfer = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { address } =  useWeb3ModalAccount()
    
    return useCallback(
        async ( addressTo, tokenId) => {
            if (!isSupportedChain(chainId))
                return console.error("Wrong network");
            const readWriteProvider = getProvider(walletProvider);
            const signer = await readWriteProvider.getSigner();

            const contract = getNFTContract(signer);
            const loadingToast= toast.loading('Transferring NFT...');

            try {
                const transaction = await contract.transferFrom(address, addressTo, tokenId);
                console.log("transaction: ", transaction);
                const receipt = await transaction.wait();

                console.log("receipt: ", receipt);

                if (receipt.status) {
                    toast.remove(loadingToast)
                    return toast.success("Transfer successful")
                }

                console.log("Failed to Transfer");
            } catch (error) {
                toast.remove(loadingToast)

                console.log(error);

                toast.error(error.reason)

            }
        },
        [chainId, walletProvider]
    );
};

export default useTransfer;
