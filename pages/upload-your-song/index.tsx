import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CircularButton from "../../components/CircularButton/CircularButton";
import styles from "./UploadYourSong.module.scss"

interface UploadYourSongProps {

}
const UploadYourSong: NextPage<UploadYourSongProps> = () => {
    const router = useRouter()
    const [isUserLoggedIn, setUserLoggedIn] = useState(false);
    useEffect(() => {
        (async() => {
            const walletAddress = await localStorage.getItem("wallet_address")
            //console.log(walletAddress);
            if (walletAddress === null){
                setUserLoggedIn(false);
            }
            else {
                setUserLoggedIn(true);
            }
        })()
    }, [])
    return (
        <>
        {isUserLoggedIn ?
        <div className={styles.UploadYourSong}>
            <div className={styles.left}>
                <p>Upload your song</p>
                <p>to the</p>
                <p>marketplace</p>
                <CircularButton
                    style={{ width: 85, height: 24, marginTop: "75px", padding: "10px 25px", marginRight: "325px" }}
                    text={"Get Started"}
                    callback={() => router.push("/mint-nft")} />
            </div>
            <div className={styles.right} style={{backgroundImage: "url('/background.jpg')"}}></div>
        </div>
        : <div className={styles.notLogged}>
            <p>Log in to be able to mint NFT</p>
            <Image src="/logo.svg" width={360} height={360} alt="" />
        </div>
        }
        </>
    )
}

export default UploadYourSong;