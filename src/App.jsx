import { Box, Button, Container, Dialog, Flex, Link, Text, TextField } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import AppTabs from "./component/AppTabs";
import useCollections from "./hooks/useCollections";
import useMyNfts from "./hooks/useMyNfts";
import useOwnedNFT from "./hooks/useOwnedNFT";
import useMint from "./hooks/useMint";
import { isAddress } from "ethers";
import { useState } from "react";
import useTransfer from "./hooks/useTransfer";
import { Toaster } from "react-hot-toast";


configureWeb3Modal();

function App() {
    const [address, setAddress] = useState("");
    const [addressTo, setAddressTo] = useState("");

    const mint = useMint();
    const transfer = useTransfer();

    const tokensData = useCollections();
    const myTokenIds = useMyNfts();
    const [ownedNFT, addresses] = useOwnedNFT();

    const handleMint = (address, tokenId) => {
        if (!isAddress(address)) {
            console.log("Not a valid address");
            return;
        }
        mint(address, tokenId);
    }

    const handleTransfer = (addressTo, tokenId) => {
        if (!isAddress(addressTo)) {
            console.log("Not a valid address");
            return;
        }
        transfer(addressTo, tokenId);
    }

    const myTokensData = tokensData.filter((x, index) =>
        myTokenIds.includes(index)
    );

    const allCollections = tokensData.map((collection, index) => ({
        ...collection,
        isOwned: ownedNFT.includes(index),
        ownedByMe: myTokenIds.includes(index),
        NFTOwner: addresses[index]
    }));
    console.log(allCollections)


    return (
        <>
        <Container>
            <Header />
            <main className="mt-6">
                <AppTabs
                    MyNfts={
                        <Flex align="center" gap="8" wrap={"wrap"}>
                            {myTokensData.length === 0 ? (
                                <Text>No NFT owned yet</Text>
                            ) : (
                                myTokensData.map((x, index) => (
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
                                        <Flex direction={"column"}>
                                            <Link href={`${import.meta.env.VITE_opensea_url}/${index}`} className="underline my-2">View on Opensea</Link>
                                            <Dialog.Root>
                                                <Dialog.Trigger>
                                                    <Button className="button">Transfer</Button>
                                                </Dialog.Trigger>

                                                <Dialog.Content style={{ maxWidth: 450 }}>
                                                    <Dialog.Title>Transfer </Dialog.Title>
                                                    <Dialog.Description size="2" mb="4">
                                                        Input address
                                                    </Dialog.Description>

                                                    <Flex direction="column" gap="3">
                                                        <label>
                                                            <Text as="div" size="2" mb="1" weight="bold">
                                                                Address
                                                            </Text>
                                                            <TextField.Input
                                                                value={addressTo}
                                                                onChange={(e) =>
                                                                    setAddressTo(e.target.value)
                                                                }
                                                                placeholder="Enter valid address"
                                                            />
                                                        </label>

                                                    </Flex>

                                                    <Flex gap="3" mt="4" justify="end">
                                                        <Dialog.Close>
                                                            <Button variant="soft" color="gray">
                                                                Cancel
                                                            </Button>
                                                        </Dialog.Close>
                                                        <Dialog.Close>
                                                            <Button className="button" onClick={() => {
                                                                handleTransfer(addressTo, index)
                                                            }}>Transfer</Button>
                                                        </Dialog.Close>
                                                    </Flex>
                                                </Dialog.Content>
                                            </Dialog.Root>
                                            </Flex>
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
                                                        return <Flex direction={"column"}>
                                                            <Link href={`${import.meta.env.VITE_opensea_url}/${index}`} className="my-2 underline">View on Opensea</Link>
                                                            <Dialog.Root>
                                                                <Dialog.Trigger>
                                                                    <Button className="button">Transfer</Button>
                                                                </Dialog.Trigger>

                                                                <Dialog.Content style={{ maxWidth: 450 }}>
                                                                    <Dialog.Title>Transfer </Dialog.Title>
                                                                    <Dialog.Description size="2" mb="4">
                                                                        Input to be transfered to
                                                                    </Dialog.Description>

                                                                    <Flex direction="column" gap="3">
                                                                        <label>
                                                                            <Text as="div" size="2" mb="1" weight="bold">
                                                                                Address
                                                                            </Text>
                                                                            <TextField.Input
                                                                                value={addressTo}
                                                                                onChange={(e) =>
                                                                                    setAddressTo(e.target.value)
                                                                                }
                                                                                placeholder="Enter valid address"
                                                                            />
                                                                        </label>
                                                                    </Flex>

                                                                    <Flex gap="3" mt="4" justify="end">
                                                                        <Dialog.Close>
                                                                            <Button variant="soft" color="gray">
                                                                                Cancel
                                                                            </Button>
                                                                        </Dialog.Close>
                                                                        <Dialog.Close>
                                                                            <Button className="button" onClick={() => {
                                                                                handleTransfer(address, index)
                                                                            }}>Transfer</Button>
                                                                        </Dialog.Close>
                                                                    </Flex>
                                                                </Dialog.Content>
                                                            </Dialog.Root></Flex>
                                                    case x.isOwned && !x.ownedByMe:
                                                        return <Flex direction={"column"}><Link href={`${import.meta.env.VITE_opensea_url}/${index}`} className="my-2 underline">View on Opensea</Link>
                                                            <Text>Owner: {x.NFTOwner?.toString().slice(0, 5) + "..." + x.NFTOwner?.toString().slice(-5)}</Text></Flex>;
                                                    default:
                                                        return <>
                                                            <Dialog.Root>
                                                                <Dialog.Trigger>
                                                                    <Button className="button w-full my-4">Mint</Button>
                                                                </Dialog.Trigger>

                                                                <Dialog.Content style={{ maxWidth: 450 }}>
                                                                    <Dialog.Title>Transfer </Dialog.Title>
                                                                    <Dialog.Description size="2" mb="4">
                                                                        Mint to an address
                                                                    </Dialog.Description>

                                                                    <Flex direction="column" gap="3">
                                                                        <label>
                                                                            <Text as="div" size="2" mb="1" weight="bold">
                                                                                Address
                                                                            </Text>
                                                                            <TextField.Input
                                                                                value={address}
                                                                                onChange={(e) =>
                                                                                    setAddress(e.target.value)
                                                                                }
                                                                                placeholder="Enter valid address"
                                                                            />
                                                                        </label>
                                                                    </Flex>

                                                                    <Flex gap="3" mt="4" justify="end">
                                                                        <Dialog.Close>
                                                                            <Button variant="soft" color="gray">
                                                                                Cancel
                                                                            </Button>
                                                                        </Dialog.Close>
                                                                        <Dialog.Close>
                                                                            <Button className="button" onClick={() => {
                                                                                handleMint(address, index)
                                                                            }}>Mint</Button>
                                                                        </Dialog.Close>
                                                                    </Flex>
                                                                </Dialog.Content>
                                                            </Dialog.Root>
                                                        </>
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
        <Toaster />
        </>
    );
}

export default App;
