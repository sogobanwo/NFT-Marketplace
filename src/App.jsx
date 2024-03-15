import { Box, Button, Container, Flex, Link, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import AppTabs from "./component/AppTabs";
import useCollections from "./hooks/useCollections";
import useMyNfts from "./hooks/useMyNfts";
import useOwnedNFT from "./hooks/useOwnedNFT";
import useMint from "./hooks/useMint";
import { isAddress } from "ethers";

configureWeb3Modal();

function App() {
    const tokensData = useCollections();
    const myTokenIds = useMyNfts();
    const ownedNFT = useOwnedNFT();

    const handleMint =(address, tokenId)=>{
        isAddress()
    }
    const mintNFT = useMint(address, tokenId);

    const myTokensData = tokensData.filter((x, index) =>
        myTokenIds.includes(index)
    );

    const allCollections = tokensData.map((collection, index) => ({
        ...collection,
        isOwned: ownedNFT.includes(index),
        ownedByMe: myTokenIds.includes(index)
    }));
    console.log(allCollections)


    return (
        <Container>
            <Header />
            <main className="mt-6">
                <AppTabs
                    MyNfts={
                        <Flex align="center" gap="8" wrap={"wrap"}>
                            {myTokensData.length === 0 ? (
                                <Text>No NFT owned yet</Text>
                            ) : (
                                myTokensData.map((x) => (
                                    <Box key={x.dna} className="w-[20rem]">
                                        <img
                                            src={x.image}
                                            className="w-full object-contain"
                                            alt={x.name}
                                        />
                                        <Text className="block text-2xl">
                                            Name: {x.name}
                                        </Text>
                                        <Text className="block">
                                            Description: {x.description}
                                        </Text>
                                        <Button className="px-8 py-2 text-xl mt-2">
                                            Mint
                                        </Button>
                                    </Box>
                                ))
                            )}
                        </Flex>
                    }
                    AllCollections={
                        <Flex align="center" gap="8" wrap={"wrap"}>
                            {allCollections.length === 0 ? (
                                <Text>Loading...</Text>
                            ) : (
                                allCollections.map((x, index) => (
                                    <Box key={x.dna} className="w-[20rem]">
                                        <img
                                            src={x.image}
                                            className="w-full object-contain"
                                            alt={x.name}
                                        />
                                        <Text className="block text-2xl">
                                            Name: {x.name}
                                        </Text>
                                        <Text className="block">
                                            Description: {x.description}
                                        </Text>
                                        {
                                            (() => {
                                                switch (true) {
                                                    case x.isOwned && x.ownedByMe:
                                                        return <>
                                                            <Link href={`${import.meta.env.VITE_opensea_url}/${index}`}>View on Opensea</Link>
                                                            <Button className="px-8 py-2 text-xl mt-2">Transfer</Button></>
                                                    case x.isOwned && !x.ownedByMe:
                                                        return <Link href={`${import.meta.env.VITE_opensea_url}/${index}`}>View on Opensea</Link>;
                                                    default:
                                                        return <Button className="px-8 py-2 text-xl mt-2">Mint</Button>;
                                                }
                                            })()
                                        }
                                    </Box>
                                ))
                            )}
                        </Flex>

                    }
                />
            </main>
        </Container>
    );
}

export default App;
