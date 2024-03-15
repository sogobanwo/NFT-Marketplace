import { ethers } from "ethers";
import Abi from "../constants/erc721.json";

export const getNFTContract= (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_contract_address,
        Abi,
        providerOrSigner
    );
