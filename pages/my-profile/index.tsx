import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import CircleTransparentButton from "../../components/CircleTransparentButton/CircleTransparentButton";
import CollectionTile from "../../components/CollectionTile/CollectionTile";
import Popup from "../../components/Popup/Popup";
import Tile from "../../components/Tile/Tile";
import { UserMetadata } from "../../types/user.types";
import styles from "./myProfile.module.scss"
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import { UserContext } from "../../context/context";
import BuyCoinsPopup from "../../components/BuyCoinsPopup/BuyCoinsPopup";

interface MyProfileProps {

}

const MyProfile: NextPage<MyProfileProps> = (props: any) => {
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const nameRef = useRef<any>();
    const websiteRef = useRef<any>();
    const descriptionRef = useRef<any>();
    const [nameEditing, setNameEditing] = useState(false);
    const [descriptionEditing, setDescriptionEditing] = useState(false);
    const [myProfile, setMyProfile] = useState<UserMetadata>();
    const [loading, setLoading] = useState<boolean>();
    const [isCollectionPopupOpened, setCollectionPopupOpened] = useState<boolean>(false)
    const [collections, setCollections] = useState<any>([])
    const [successPopup, setSuccessPopup] = useState<any>({ "success": null, "message": null })
    const [nfts, setNfts] = useState<any>([]);
    const [collectionRefresher, setCollectionRefresher] = useState(false);
    const [nftRefreshser, setNftRefresher] = useState(false);
    const [userRefresher, setUserRefreshser] = useState(false);
    const [buyCoinsPopup, setBuyCoinsPopup] = useState(false)
    const [websiteError, setWebsiteError] = useState("");
    const [nameError, setNameError] = useState("");
    //@ts-ignore
    const { user } = useContext(UserContext)
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user')
        const wallet = localStorage.getItem('wallet_address')
        if (wallet !== null && user !== null && token !== null) {
        } else {
            router.replace("/")
        }
    }, [])
    useEffect(() => {
        //axios.defaults.withCredentials = true
        setLoading(true);
        (async function () {
            try {
                const sessionUser = localStorage.getItem('user')
                const address = JSON.parse(sessionUser!).walletAddress;
                console.log(JSON.parse(sessionUser!))

                if (user === null) {
                    router.push("/")
                } else {
                    try {
                        const res = await axios.get(`${process.env.API_URL}/user/by-wallet-address/${address}`);
                        //console.log(res.data);
                        setMyProfile(res.data)
                        setLoading(false)

                        const response = await axios.post(`${process.env.API_URL}/listing/by-creator-wallet`, { creatorWalletAddress: address }, {
                            withCredentials: true,
                            // headers: {'Origin': ['http://localhost:8080'] },
                            validateStatus: function (status) {
                                return status < 400; // Reject only if the status code is greater than 300
                            }
                        });
                        //console.log(response.data.listing)
                        setNfts(response.data.listing)
                    } catch (err) {
                        console.error(err)
                        //router.push("/")
                    } finally {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.warn(error)
            }

        })();
    }, [nftRefreshser, user, userRefresher])
    useEffect(() => {
        setLoading(true);
        (async function () {
            const collectionRes = await axios.get(`${process.env.API_URL}/collection`);
            const collectionData = collectionRes.data.collections;
            //console.log(collectionData)
            setCollections([])
            const walletAddress = localStorage.getItem("wallet_address")
            if (collectionData !== undefined && collectionData.length > 0) {
                collectionData.forEach((element: any, index: number) => {
                    if (element.creatorAddress === walletAddress) {
                        setCollections((prev: any) =>
                            [...prev, element]
                        )
                    }
                })
            }
        })();
        setLoading(false);
    }, [collectionRefresher])

    const updateInfo = async () => {
        if (nameRef.current.value === "") {
            setNameError("Name field cannot be empty");
            return;
        } else {
            setNameError("");
        }
        if (!/^https:\/\//.test(websiteRef.current.value) && websiteRef.current.value !== "") {
            setWebsiteError("Website should start with https://")
            return;
        }
        setLoading(true)
        try {
            const res = await axios.put(`${process.env.API_URL}/user/update`, { newName: nameRef.current.value, newWebsite: websiteRef.current.value })
            //console.log(nameRef.current.value, websiteRef.current.value)
            //console.log(res)
        }
        catch (err) {
            console.error(err);
        } finally {
            setNameEditing(false)
            setUserRefreshser(prev => !prev);
            setWebsiteError("");
            setNameError("");
            setLoading(false)
        }
    }
    const updateDescription = async () => {
        try {
            const res = await axios.put(`${process.env.API_URL}/user/update`, { newDescription: descriptionRef.current.value })
            //console.log(res)
        }
        catch (err) {
            console.error(err);
        } finally {
            setUserRefreshser(prev => !prev);
            setLoading(false)
        }
    }
    const dateFormatter = (date: string) => {
        const formatted = date.slice(0, 10);
        const splitted = formatted.split("-")
        const month = parseInt(splitted[1])
        let stringMonth = months[month - 1]
        return `${splitted[2]} ${stringMonth} ${splitted[0]}`;
    }
    const router = useRouter()

    const handleClick = (index: number) => {
        router.push(`collection/${index}`)
    }
    const deleteNFT = async (id: number) => {
        try {
            setLoading(true)
            const authToken = localStorage.getItem("auth_token")
            const res = await axios.delete(`${process.env.API_URL}/listing/cancelDirectListing/${id.toString()}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
            //console.log(res);
            setSuccessPopup({ "success": true, "message": "Successfuly deleted NFT" })
        } catch (e) {
            console.warn(e)
            setSuccessPopup({ "success": false, "message": "Cannot delete, this NFT is probably in one of your collections or is bought/rented by other user" })
        } finally {
            setNftRefresher(prev => !prev)
            setLoading(false)
        }

    }
    const deleteCollection = async (id: number) => {
        const authToken = localStorage.getItem("auth_token")
        try {
            const res = await axios.delete(`${process.env.API_URL}/collection`, { headers: { 'Authorization': `Bearer ${authToken}` }, data: { collectionId: id } });
            //console.log(res);
            setCollections([]) // Clear state to fill it below
            setSuccessPopup({ "success": true, "message": "Successfuly deleted collection" })

        } catch (err) {
            setSuccessPopup({ "success": false, "message": "Cannot delete collection" })
        } finally {
            setCollectionRefresher(!collectionRefresher)
        }
    }
    return (

        <>
            {buyCoinsPopup ? <BuyCoinsPopup setVisible={setBuyCoinsPopup} setSuccessPopup={setSuccessPopup} refresher={setUserRefreshser} setLoading={setLoading} /> : null}
            {isCollectionPopupOpened ? <Popup setVisible={setCollectionPopupOpened} refresher={setCollectionRefresher} setSuccessPopup={setSuccessPopup} /> : null}
            {loading ?
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
                />
                :
                <div className={styles.MyProfile}>
                    {successPopup.success !== null ? <SuccessPopup success={successPopup.success} message={successPopup.message} setSuccess={setSuccessPopup} /> : null}
                    <div className={styles.userInfo}>
                        <div className={styles.subInfo}>
                            <Image src="/profile.jpg" width={156} height={156} alt="" className={styles.avatar} />
                            <div className={styles.info}>
                                {nameEditing ?
                                    <div className={styles.name}>
                                        <label>Name</label>
                                        <input defaultValue={myProfile!.name} ref={nameRef} maxLength={25} />
                                        {nameError !== "" ? <em className={styles.error}>{nameError}</em> : null}
                                    </div>
                                    : <p className={styles.name}><span>@{myProfile ? myProfile!.name : ""}</span></p>}
                                {nameEditing ? <><label>Website</label><input defaultValue={myProfile!.website} ref={websiteRef} /> {websiteError !== "" ? <em className={styles.error}>{websiteError}</em> : null} </> : myProfile && myProfile!.website !== " " &&
                                    myProfile!.website !== "" &&
                                    myProfile!.website !== undefined ?
                                    <p><span>Website: </span>{myProfile && myProfile.website ? myProfile!.website : ""}</p>
                                    : null}
                                <p><span>E-mail: </span>{myProfile ? myProfile!.email : ""}</p>


                                <p><span>Joined: </span>{myProfile && myProfile.whenSignedUp ? dateFormatter(myProfile!.whenSignedUp) : ""}</p>
                            </div>
                            {nameEditing ?
                                <div className={styles.hiddenButtonsWrapper}>
                                    <CircleTransparentButton width={21} height={21} src={"/check.svg"} handler={() => { updateInfo(); }} />
                                    <CircleTransparentButton width={21} height={21} src={"/close.svg"} handler={() => { setNameEditing(false) }} />
                                </div> :
                                <div className={styles.hiddenButtonsWrapper}>
                                    <CircleTransparentButton width={21} height={21} src={"/pencil.svg"} handler={() => { setNameEditing(true) }} />
                                </div>
                            }
                        </div>

                        <div className={styles.info}>
                            <p className={styles.coins}>{myProfile ? myProfile.coins : 0} MC</p>
                            <button className={styles.buyCoins} onClick={() => setBuyCoinsPopup(true)}>Get Coins</button>
                        </div>

                    </div>
                    <div className={styles.description}>
                        <h3>Description{descriptionEditing ? null : <CircleTransparentButton width={21} height={21} src={"/pencil.svg"} handler={() => { setDescriptionEditing(true) }} />}</h3>
                        {descriptionEditing ?
                            <div className={styles.descriptionEditing}>
                                <textarea ref={descriptionRef} defaultValue={myProfile!.description} maxLength={255} />
                                <div>
                                    <CircleTransparentButton width={21} height={21} src={"/check.svg"} handler={() => { updateDescription(); setDescriptionEditing(false) }} />
                                    <CircleTransparentButton width={21} height={21} src={"/close.svg"} handler={() => { setDescriptionEditing(false) }} />
                                </div>
                            </div>
                            : <p className={styles.descriptionContent}>{myProfile ? myProfile!.description : ""}</p>}
                    </div>
                    <div>
                        <div className={styles.collectionsHeader}><h3>Created NFTS</h3><Image className={styles.plus} src="/plus.svg" width={40} height={40} alt="" onClick={() => router.push("/mint-nft")} /> </div>
                        <div className={styles.rentedLibrary}>
                            {myProfile ? (nfts.length === 0 ? <p className={styles.empty}>There{"'"}s nothing here yet.</p> : nfts.map((element: any, index: number) => {
                                return <div className={styles.nft} key={index}><Tile index={index} item={element} isDeletable={true} deleteNft={deleteNFT} /></div>
                            })) : <p className={styles.empty}>There{"'"}s nothing here yet.</p>}
                        </div>
                    </div>
                    <div>
                        <div className={styles.collectionsHeader}><h3>Collections</h3><Image className={styles.plus} src="/plus.svg" width={40} height={40} alt="" onClick={() => setCollectionPopupOpened(true)} /> </div>
                        <div className={styles.rentedLibrary}>
                            {myProfile ? (collections.length === 0 ? <p className={styles.empty}>There{"'"}s nothing here yet.</p> : collections.map((element: any, index: number) => {
                                return <CollectionTile key={index} element={element} index={index} handleClick={handleClick} deleteCollection={deleteCollection} />
                            })) : <p className={styles.empty}>There{"'"}s nothing here yet.</p>}
                        </div>
                    </div>
                    <div>
                        <h4>Owned NFT</h4>
                        <div className={styles.ownedLibrary}>
                            {myProfile ? (myProfile.nftOwned?.length === 0 ? <p className={styles.empty}>There{"'"}s nothing here yet.</p> : myProfile.nftOwned?.map((element: any, index: number) => <div className={styles.nft} key={index}><Tile index={index} item={element} isDeletable={false} deleteNft={() => { }} /></div>)) : <p className={styles.empty}>There{"'"}s nothing here yet.</p>}
                        </div>
                    </div>
                    <div>
                        <h4>Rented NFT</h4>
                        <div className={styles.rentedLibrary}>
                            {myProfile ? (myProfile.nftRented?.length === 0 ? <p className={styles.empty}>There{"'"}s nothing here yet.</p> : myProfile.nftRented?.map((element: any, index: number) => <div className={styles.nft} key={index}><Tile index={index} item={element} isDeletable={false} deleteNft={() => { }} /></div>)) : <p className={styles.empty}>There{"'"}s nothing here yet.</p>}
                        </div>
                    </div>
                </div>}</>
    )
}

export default MyProfile;