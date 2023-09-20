import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import CircleTransparentButton from "../../components/CircleTransparentButton/CircleTransparentButton";
import Tile from "../../components/Tile/Tile";
import styles from "./Collection.module.scss";
import { useEffect, useState } from 'react';
import axios from "axios";
import { Collection } from "../../types/collections.types";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import { Oval } from "react-loader-spinner";

interface CollectionById {
    collection: Collection;
    creator: { creator: string, status: boolean };
    nfts: { genre: number, id: number, imageURL: string, musicURL: string, name: string, price: number };
}

const Collection: NextPage = (context: any) => {
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const router = useRouter()
    const { id } = router.query
    const [collectionNfts, setCollectionNfts] = useState<any>([]);
    const [displayData, setDisplayData] = useState<CollectionById | any>()
    const [thisUserWalletAddress, setThisUserWalletAddress] = useState<string | any>("");
    const [addToCollectionVisible, setAddToCollectionVisible] = useState(false)
    const [nftsLoading, setNftLoading] = useState(false);
    const [chosenToCollection, setChosenToCollection] = useState<any[]>([]);

    useEffect(() => {
        const wallet = localStorage.getItem("wallet_address")
        setThisUserWalletAddress(wallet)
        if (router.isReady) {
            (async () => {
                const res = await axios.get(`${process.env.API_URL}/collection/byId/${id}`);
                console.log(res.data);
                setDisplayData(res.data);
            })()
        }
    }, [router.isReady])

    const dateFormatter = (date: string) => {
        const formatted = date.slice(0, 10);
        const splitted = formatted.split("-")
        const month = parseInt(splitted[1])
        let stringMonth = months[month - 1]
        return `${splitted[2]} ${stringMonth} ${splitted[0]}`;
    }
    const removeArrItem = (element: number) => {
        var array = [...chosenToCollection]; // make a separate copy of the array
        var index = array.indexOf(element)
        if (index !== -1) {
            array.splice(index, 1);
            setChosenToCollection(array)
        }
    }

    const updateCollectionHandler = async () => {
        //console.log(chosenToCollection)
        try {
            const res = await axios.put(`${process.env.API_URL}/collection/fewNft`, {
                collectionId: displayData.collection.id,
                nftIds: chosenToCollection
            })
            //console.log(res)
            const response = await axios.get(`${process.env.API_URL}/collection/byId/${id}`);
                console.log(response.data);
                setDisplayData(response.data);
        } catch (e) {
            console.warn(e)
        } finally {
            setAddToCollectionVisible(false);

        }
    }
    const plusButtonHandler = async () => {
        try {
            //console.log(displayData.nfts)
            displayData.nfts.forEach((element: any, index: number) => {
                setChosenToCollection((prev: any) => [...prev, element.contractId])
            })
            setAddToCollectionVisible(true)
            setNftLoading(true)
            const walletAddress = localStorage.getItem("wallet_address")
            const res = await axios.post(`${process.env.API_URL}/listing/by-creator-wallet/`, {
                creatorWalletAddress: walletAddress
            }, {
                validateStatus: function (status) {
                    return status <= 300; // Reject only if the status code is greater than 300
                }
            });
            //console.log(res.data.listing)
            setCollectionNfts(res.data.listing)
        } catch (err) {
            console.warn(err)
        } finally {
            setNftLoading(false)
        }
    }
    const onChangeHandler = (e: any) => {
        //console.log(e.target.value)
        //console.log(e.target.checked)
        //e.target.checked = !e.target.checked
        if (chosenToCollection.includes(parseInt(e.target.value))) {
            removeArrItem(parseInt(e.target.value))
        } else {
            setChosenToCollection((prev: any) => [...prev, parseInt(e.target.value)])
        }
        //console.log(chosenToCollection)
    }

    const AddToCollectionPopup = () => {
        return (
            <div className={styles.addToCollection}>
                <div className={styles.body}>
                    <Image className={styles.close} src="/close.svg" alt="" width={25} height={25} onClick={() => { setAddToCollectionVisible(false); setChosenToCollection([]) }} />
                    <p>Select your songs to add to collection</p>
                    {nftsLoading ?
                        <Oval
                            height={80}
                            width={80}
                            color="#1e3799"
                            wrapperStyle={{ width: '95%', height: '200px', disple: "flex", justifyContent: "center", alignItems: "center" }}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#4a69bd"
                            strokeWidth={2}
                            strokeWidthSecondary={2}
                        />
                        : <div className={styles.rowWrapper}>
                            {collectionNfts.map((element: any, index: number) => {
                                return (
                                    <div className={styles.row} key={index}>
                                        <input type="checkbox" value={element.contractId} checked={chosenToCollection.includes(element.contractId)} onChange={onChangeHandler} />
                                        <p>{element.name}</p>
                                        <Image src={element.imageURL} width={50} height={50} alt="" />
                                    </div>
                                )
                            })}
                        </div>}

                    <button onClick={updateCollectionHandler}>Update collection</button>
                </div></div>
        )
    }

    return (
        <div className={styles.Collection}>
            {addToCollectionVisible ? <AddToCollectionPopup /> : null}
            {displayData === null || displayData === undefined ? <SpinningLoader /> :
                <div className={styles.images_wrapper}>
                    <Image width={1200} height={400} className={styles.banner} src="/banner.png" alt="" />
                    <Image width={180} height={180} className={styles.avatar} src="/collection.jpg" alt="" />
                    <div className={styles.sections}>
                        <div className={styles.titleSection}>
                            <h2 className={styles.collectionName}>{displayData.collection.name}</h2>
                            <div className={styles.mediaLinks}>
                                {displayData.creator === null || displayData.creator.website === "" ||
                                    displayData.creator.website === " " ||
                                    displayData.creator.website === undefined
                                    ? null : <CircleTransparentButton width={24} height={24} src={"/website.svg"} handler={() => {
                                        window.open(displayData.creator.website, '_blank')
                                    }} />}
                                {/*<CircleTransparentButton width={24} height={24} src={"/three-dots.svg"} handler={() => { }} />*/}
                                {thisUserWalletAddress === displayData.collection.creatorAddress ? <CircleTransparentButton width={24} height={24} src={"/plus.svg"} handler={plusButtonHandler} /> : null}
                            </div>
                        </div>
                        <div className={styles.authorSection}>
                            Uploaded by <span>{displayData.creator.name}</span>
                        </div>
                        <div className={styles.descriptionSection}>
                            <h3>Description </h3><span>{displayData.collection.description}</span>
                        </div>
                        <div className={styles.profileInfoSection}>
                            <div><p>Tracks </p><span>{displayData.nfts.length}</span></div>
                            <div><p>Created at </p><span>{dateFormatter(displayData.collection.createdDate)}</span></div>
                            {/*<div><p>Rating </p><span>{displayData.collection.rating}</span></div>*/}
                        </div>
                        <div className={styles.items}>
                            <p className={styles.itemsTitle}>Items</p>
                            <div className={styles.item}>
                                {
                                displayData.nfts.length > 0 ?
                                displayData.nfts.map((element: any, index: number) => {
                                    if (element !== null && element !== undefined) {
                                        return <Tile key={index} index={element.id} item={element} isDeletable={false} deleteNft={() => { }} />
                                    } else {
                                        return null;
                                    }
                                })
                            :
                            <p className={styles.emptyCollection} style={{marginBlock: '75px'}}>This collection is empty</p>}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Collection;