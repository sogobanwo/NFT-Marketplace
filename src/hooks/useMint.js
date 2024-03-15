import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getNFTContract } from "../constants/contracts";
import toast from "react-hot-toast";

const useMint = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(
        async (address, tokenId) => {
            if (!isSupportedChain(chainId))
                return console.error("Wrong network");
            const readWriteProvider = getProvider(walletProvider);
            const signer = await readWriteProvider.getSigner();

            const contract = getNFTContract(signer);
            const loadingToast= toast.loading('Minting NFT...');


            try {
                const transaction = await contract.safeMint(address, tokenId, {value:"100000000000000"});
                console.log("transaction: ", transaction);
                const receipt = await transaction.wait();

                console.log("receipt: ", receipt);

                if (receipt.status) {
                    toast.remove(loadingToast)
                    return toast.success("Mint successful")
                }

                console.log("Failed to mint");
            } catch (error) {
                toast.remove(loadingToast)

                console.log(error);

                toast.error(error.reason)
            }
        },
        [chainId, walletProvider]
    );
};

export default useMint;
