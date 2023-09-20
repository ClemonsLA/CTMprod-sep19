import { MediaRenderer, useActiveListings, useContract } from "@thirdweb-dev/react";
import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CircularButton from "../../components/CircularButton/CircularButton";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import { Collection } from "../../types/collections.types";
import styles from "./Artists.module.scss"

interface ArtistsProps {
    collections: Collection[];
    displayNumber: number;
    showLoadMore: boolean;
}
const Artists: NextPage<ArtistsProps> = ({ collections, displayNumber, showLoadMore = true }: ArtistsProps) => {
    const router = useRouter()
    const [displayData, setDisplayData] = useState<any>()
    const [displayNumberState, setDisplayNumberState] = useState<number>()
    const [sectionHeight, setSectionHeight] = useState("20 vh");
    const [sectionMarginBlock, setSectionMarginBlock] = useState("35px")
    const [isLoading, setLoading] = useState<boolean>(false);
    const [limit ,setLimit] = useState<number>()
    useEffect(() => {
        setLoading(true)
        if (collections === undefined || collections === null) {
            try {
                (async () => {
                    const collectionRes = await axios.get(`${process.env.API_URL}/collection`);
                    //console.log('ress', collectionRes)
                    const collectionData = collectionRes.data;
                    setSectionHeight("32vh")
                    setSectionMarginBlock("105px")
                    setDisplayData(collectionData.collections);
                    setDisplayNumberState(Math.ceil(collectionData.collections.length))
                })()
            } catch (error) {
                console.error(error)
            }
        } else {
            setDisplayNumberState(displayNumber)
            setDisplayData(collections);
            setSectionHeight("20vh")
            setSectionMarginBlock("25px")
            if (collections.length < 8){
                //console.log("LENGF", collections.length)
                setLimit(collections.length)
                setDisplayNumberState(collections.length)
            }else{
                setLimit(displayNumber)
            }
            
        }
        setLoading(false)
        //console.log("DISPLAY NUMBER", displayNumberState)
    }, [])

    const handleClick = (index: number) => {
        router.push(`collection/${index}`)
    }
    return (
        <>
            {isLoading ? <SpinningLoader /> :
                <div className={styles.Artists} style={{minHeight:sectionHeight, marginBlock: sectionMarginBlock}}>

                    {displayData === null || displayData === undefined ? <SpinningLoader /> : (displayData.length === 0 ? null : <div className={styles.panel}>
                        <div className={styles.header}>
                            <p className={styles.index}>#</p>
                            <p className={styles.avatar}> </p>
                            <p className={styles.title}>Collection</p>
                            <p className={styles.artist}>Author</p>
                            <p>Tracks</p>
                        </div>
                        {displayData === null || displayData === undefined || displayData.length === 0 ? null : displayData.map((element: Collection, index: number) => {
                            if (index >= (displayNumberState! / 2)) {
                                return;
                            }
                            return (
                                <div className={styles.collection} key={index} onClick={() => handleClick(element.id)}>
                                    <p className={styles.index}>{index + 1}</p>
                                    <Image width={56} height={56} alt="" className={styles.avatar} src={"/collection.jpg"} />
                                    <p className={styles.title}>{element.name}</p>
                                    <p className={styles.artist}>{element.creatorName}</p>
                                    <p className={styles.index}>{element.nfts.length}</p>
                                </div>
                            )
                        })}
                    </div>)}
                    {(displayData === null || displayData === undefined || displayData.length < 2) ?
                        null : displayData.length < displayNumberState! / 2 || displayData.length < 2 ? null : <><div className={styles.panel}>
                            <div className={styles.header2}>
                                <p className={styles.index}>#</p>
                                <p className={styles.avatar}></p>
                                <p className={styles.title}>Collection</p>
                                <p className={styles.artist}>Author</p>
                                <p>Tracks</p>
                            </div>
                            {displayData.map((element: Collection, index: number) => {
                                if (index < displayNumberState! / 2 || index > limit! - 1) {
                                    return;
                                }
                                return (
                                    <div className={styles.collection} key={index} onClick={() => handleClick(element.id)}>
                                        <p className={styles.index}>{index + 1}</p>
                                        <Image width={56} height={56} alt="" className={styles.avatar} src={"/collection.jpg"} />
                                        <p className={styles.title}>{element.name}</p>
                                        <p className={styles.artist}>{element.creatorName}</p>
                                        <p className={styles.index}>{element.nfts.length}</p>
                                    </div>
                                )
                            })}
                        </div></>}

                </div>}
        </>
    )
}

export default Artists;