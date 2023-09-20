import { NextPage } from "next"
import { useRouter } from "next/router"
import styles from "./ItemOverview.module.scss"
import Image from "next/image";
import axios from "axios"
import { ListingItem } from "../../types/listing.types";
import { useEffect, useState } from "react";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import useDownloader from "react-use-downloader";

const ItemOverview: NextPage<ListingItem> = () => {
    const router = useRouter()
    const { id, dbId } = router.query
    const [isLoading, setLoading] = useState<boolean>(true);
    const [item, setItem] = useState<ListingItem>();
    const [user, setUser] = useState<boolean>(false);
    const [successPopup, setSuccessPopup] = useState<any>({ "success": null, "message": null })
    const [refresh, setRefresh] = useState<boolean>(true);
    const { size, elapsed, percentage, download, cancel, error, isInProgress } =
        useDownloader();
    useEffect(() => {
        if (router.isReady) {
            try {
                (async () => {
                    setLoading(true);
                    const res = await axios.get(`${process.env.API_URL}/listing/by-database-id/${id}`);
                    const data = res.data
                    //console.log(data.listing);
                    setItem(data.listing)
                })()
            } catch (err) {
                console.warn(err)
            } finally {
                setLoading(false);
            }
        }
    }, [router.isReady])

    useEffect(() => {
        //setLoading(true)
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user')
        const wallet = localStorage.getItem('wallet_address')
        if (wallet !== null && user !== null && token !== null) {
            setUser(true);
        } else {
            setUser(false);
        }
        /*try {
            (async () => {
                const res = await axios.get(`${process.env.API_URL}/listing/by-database-id/${id}`);
                const data = res.data
                //console.log(data.listing);
                setItem(data.listing)
                setLoading(false);
            })()
        } catch (err) {
            console.warn(err)
        }*/
    }, [refresh])

    const downloadHandler = async () => {
        download(item!.musicURL, `${item!.name}.mp3`)
        try {
            await axios.get(`${process.env.API_URL}/buyNft/download-nft/${item?.contractId}`);
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        } finally {

        }
    }
    function isAudioType(s: string) {
        var audioTypes = [".mp3", ".wav"], // Add as many extensions you like here...
            audioExt = s.replace(/^.+(?=\.)/i, '');

        return (audioTypes.indexOf(audioExt.toLowerCase()) > -1);
    }

    const buyHandler = async () => {
        setLoading(true)
        try {
            const authToken = localStorage.getItem("auth_token")
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } }
            const res = await axios.post(`${process.env.API_URL}/buyNft`, {
                nftId: item!.contractId,
                amount: 1
            }, config);
            //console.log(res);
            setSuccessPopup({ "success": true, "message": "NFT bought successfuly" })
        } catch (err: any) {
            console.warn(err)
            setSuccessPopup({ "success": false, "message": "Unable to buy NFT - not enough Coins" })
        } finally {
            setLoading(false)
        }
    }

    const rentHandler = async () => {
        setLoading(true)
        try {
            const authToken = localStorage.getItem("auth_token")
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } }
            const res = await axios.post(`${process.env.API_URL}/rent`, {
                nftId: item!.contractId,
                days: 30,
                quantity: 1
            }, config);
            console.log(res);
            setSuccessPopup({ "success": true, "message": "NFT rented successfuly" })
        } catch (err: any) {
            console.warn(err)
            setSuccessPopup({ "success": false, "message": "Unable to rent NFT" })
        } finally {
            setLoading(false)
        }
    }
    const handleLike = async () => {
        try {
            const res = await axios.put(`${process.env.API_URL}/listing/like/${item?.contractId}`);
            //console.log(res)
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        }
    }
    const handleDislike = async () => {
        try {
            const res = await axios.put(`${process.env.API_URL}/listing/dislike/${item?.contractId}`);
            //console.log(res)
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        }
    }

    return (
        <> {isLoading ? <SpinningLoader /> :
            item !== undefined ?
                <div className={styles.ItemOverview}>
                    {successPopup.success !== null ? <SuccessPopup success={successPopup.success} message={successPopup.message} setSuccess={setSuccessPopup} /> : null}
                    <div className={styles.left}>
                        <Image src={item.imageURL} alt="" width={2000} height={2000} className={styles.image} />
                        <div className={styles.likes_container}>
                            <div>
                                <Image src={"/like.svg"} width={40} height={40} alt="" className={styles.like} onClick={handleLike} />
                                <p className={styles.likes}>{item.usersWhoLiked === undefined ? 0 : item.usersWhoLiked.length}</p>
                            </div>
                            <div>
                                <Image src={"/dislike.svg"} width={40} height={40} alt="" className={styles.dislike} onClick={handleDislike} />
                                <p className={styles.dislikes}>{item.usersWhoDisliked === undefined ? 0 : item.usersWhoDisliked.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.infoPanel}>
                        <div className={styles.subContainer}>
                            <p className={styles.id}><span>{/*#{item.id}: */}{item.name}</span></p>
                            <p className={styles.id}>added by<span>{item.creator === undefined || item.creator === null ? "" : item.creator[0].name}</span></p>
                            <div className={styles.description}>
                                <span>Description</span>
                                <p>{item.description}</p>
                            </div>
                            {/*<p className={styles.author}>Added by <span>Author name</span></p>*/}
                            <p className={styles.price}><em>Current price </em><span>{item.price} MC</span></p>
                            <p className={styles.price}><em>Rent price </em><span>{item.rentPrice} MC</span></p>
                            <p className={styles.price}><em>Quantity </em><span>{item.quantity}</span></p>
                            <p className={styles.ownedBy}><em>Owned by </em><span>nobody</span></p>
                        </div>
                        <div className={styles.subContainer}>
                            <audio src={item.musicURL} controls className={styles.audio} controlsList="nodownload" />
                            <p className={styles.ownedBy}><em>Genre </em><span>Rap</span></p>
                            <p className={styles.downloads}><em>Number of downloads </em><span>{item.downloads}</span></p>
                            <p className={styles.downloads}><em>Number of rents </em><span>{item.numberOfRents}</span></p>
                        </div>
                        {user ? <div className={styles.buttonWrapper}>
                            {item.isSellable ? <button onClick={buyHandler} className={styles.buyButton}>Buy NFT</button> : "This NFT is not for sale"}
                            {item.isRentable ? <button onClick={rentHandler} className={styles.rentButton}>Rent NFT</button> : null}
                        </div> : <div className={styles.buttonWrapper} style={{ marginBlock: '40px' }}>Log in to purchase or rent NFT</div>}
                        {item.downloadable ?
                            <>
                                <p style={{ marginInline: 'auto', paddingRight: '100px' }}>You are able to download this NFT</p>
                                <button style={{ marginRight: '125px' }} onClick={downloadHandler} className={styles.downloadButton}>Download</button>
                            </> : null}
                    </div>
                </div> : null}</>
    )
}
export default ItemOverview;