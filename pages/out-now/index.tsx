import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import Tile from "../../components/Tile/Tile";
import { ListingItem } from "../../types/listing.types";
import styles from "./OutNow.module.scss"

interface OutNowProps {
    listing: ListingItem | any;
}
const OutNow: NextPage<OutNowProps> = ({ listing }: OutNowProps) => {
    const router = useRouter()
    const [displayData, setDisplayData] = useState<ListingItem | any>();
    const [isLoading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        setLoading(true)
        if (listing === undefined || listing === null) {
            (async () => {
                try {
                    const res = await axios.get(`${process.env.API_URL}/listing`);
                    //console.log(res.data)
                    setDisplayData(res.data.listing)
                } catch (err) {
                    router.back()
                }

            })()
        } else {
            //console.log(listing)
            setDisplayData(listing)
        }
        setLoading(false)
    }, [])

    return (
        <div className={styles.listing}>
            {isLoading ?
                <Oval
                    height={80}
                    width={80}
                    color="#1e3799"
                    wrapperStyle={{ width: '95%', height: '100vh', disple: "flex", justifyContent: "center", alignItems: "center" }}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#4a69bd"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                /> : (displayData !== undefined && displayData.length > 0? displayData.map((listingItem: ListingItem, index: number) => {
                    return (
                        <Tile key={listingItem.id} index={index} item={listingItem} isDeletable={false} deleteNft={() => {}}/>
                    )
                }) : null)}
        </div>
    )
}

export default OutNow;