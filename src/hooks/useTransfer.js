import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getNFTContract } from "../constants/contracts";

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

            try {
                const transaction = await contract.transferFrom(address, addressTo, tokenId);
                console.log("transaction: ", transaction);
                const receipt = await transaction.wait();

                console.log("receipt: ", receipt);

                if (receipt.status) {
                    return console.log("Transfer successfull");
                }

                console.log("Failed to Transfer");
            } catch (error) {
                console.log(error);

                console.error("error: ", error);
            }
        },
        [chainId, walletProvider]
    );
};

export default useTransfer;
