import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import styles from "./Wallet.module.scss"
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { UserContext } from "../../context/context";
import Web3 from 'web3'
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import Image from "next/image";

interface WalletProps {

}
const Wallet: NextPage<WalletProps> = () => {
    const [wallet, setWallet] = useState()
    const [hiddenWallet, setHiddenWallet] = useState(true);
    const [email, setEmail] = useState()
    const [balance, setBalance] = useState<number>()
    const [isLoading, setLoading] = useState(false)
    const [buyCrypto, setBuyCrypto] = useState(false)
    //@ts-ignore
    const { user, setUser, magic, setMagic } = useContext(UserContext)

    const router = useRouter()
    useEffect(() => {
        getMagicInfo()
    }, [])
    const getMagicInfo = async () => {
        setLoading(true)
        try {
            const metadata = await magic.user.getMetadata()
            setWallet(metadata.publicAddress)
            setEmail(metadata.email)
            const web3 = new Web3(magic.rpcProvider);
            const balance = Number(web3.utils.fromWei(await web3.eth.getBalance(metadata.publicAddress), "ether"))
            setBalance(balance)
        } catch (err) {
            console.warn(err)
            router.push("/")
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {!isLoading ?
                <div className={styles.Wallet}>
                    <h3>Wallet Info</h3>
                    {buyCrypto ?
                        <iframe
                            style={{ borderRadius: "4px", margin: "auto;", maxWidth: "420px", marginTop: '25px' }}
                            src={`https://buy.onramper.com?onlyCryptoNetworks=POLYGON&onlyCryptos=MATIC_ETHEREUM&wallets=MATIC_ETHEREUM:${wallet}`}
                            height="630px"
                            width="420px"
                            title="Onramper widget"
                            allow="accelerometer; autoplay; camera; gyroscope; payment">
                        </iframe> : null}
                    <div className={styles.row}>
                        <p><Image alt="" src={"/email.svg"} height={22} width={22} style={{ marginRight: "10px" }} />Email address</p>
                        <span>{email}</span>
                    </div>
                    <div className={styles.row}>
                        <p><Image alt="" src={"/wallet.svg"} height={22} width={22} style={{ marginRight: "10px" }} /> Wallet address</p>

                        <span><Image alt="" onClick={() => setHiddenWallet(prev => !prev)} src={hiddenWallet ? "/eye.svg" : "/eye-off.svg"} width={22} height={22} style={{ marginInline: '10px', marginBlock: 'auto', cursor: 'pointer' }} />
                            {/*@ts-ignore*/}
                            {!hiddenWallet ? wallet : `${wallet !== undefined ? wallet!.slice(0, 10) : null}...`}</span>
                    </div>
                    <div className={styles.row}>
                        <p><Image src={"/coins.svg"} height={22} width={22} style={{ marginRight: "10px" }} alt="" />MATIC Balance</p>
                        <span>{balance} MATIC</span>
                    </div>
                    {!buyCrypto ? <button onClick={() => setBuyCrypto(true)}>Buy crypto</button> : <button onClick={() => setBuyCrypto(false)}>Close window</button>}
                </div>
                : <SpinningLoader />}</>
    )
}

export default Wallet;