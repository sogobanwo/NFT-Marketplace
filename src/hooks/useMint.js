import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getNFTContract } from "../constants/contracts";

const useMint = (address, tokenId) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(
        async () => {
            if (!isSupportedChain(chainId))
                return console.error("Wrong network");
            const readWriteProvider = getProvider(walletProvider);
            const signer = await readWriteProvider.getSigner();

            const contract = getNFTContract(signer);

            try {
                const transaction = await contract.safeMint(address, tokenId);
                console.log("transaction: ", transaction);
                const receipt = await transaction.wait();

                console.log("receipt: ", receipt);

                if (receipt.status) {
                    return console.log("Mint successfull");
                }

                console.log("Failed to mint");
            } catch (error) {
                console.log(error);

                console.error("error: ", error);
            }
        },
        [chainId, walletProvider]
    );
};

export default useMint;
