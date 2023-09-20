import axios from 'axios';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import Web3, { Bytes } from 'web3';
import { UserContext } from '../../context/context';
import styles from './BuyCoinsPopup.module.scss'

const contractNetwork = "mumbai";
export const nftContractType = "edition";
interface BuyCoinsPopupProps {
    setVisible: any;
    refresher: any;
    setSuccessPopup: any;
    setLoading: any;
}

const BuyCoinsPopup = ({ setVisible, setSuccessPopup, refresher, setLoading }: BuyCoinsPopupProps) => {
    //@ts-ignore
    const { user, setUser, magic, setMagic } = useContext(UserContext)
    const [amountOfCoins, setAmountOfCoins] = useState<number>();

    async function generateSign(rawTx: any) {
        try {
            const web3 = new Web3(magic.rpcProvider);
            const metadata = await magic.user.getMetadata()
            const balance = Number(web3.utils.fromWei(await web3.eth.getBalance(metadata.publicAddress), "ether"))
            //console.log("BALANCE", balance)
            //console.log("value ", rawTx.value)
            const signedTx: any = await web3.eth.signTransaction(rawTx, rawTx.from);
            //console.log(signedTx)
            signedTx.rawTransaction = signedTx.raw
            finalizeTransaction(signedTx.raw, signedTx)
        } catch (err) {
            //console.warn(err)
            console.warn("Not enough MATIC coins")
            setSuccessPopup({ "success": false, "message": "Not enough MATIC coins" })
            setLoading(false)
        }

    }

    const finalizeTransaction = async (rawTransaction: string, transactionHash: Bytes) => {
        try {
            //console.log(amountOfCoins)
            const res = await axios.post(`${process.env.API_URL}/buyCoins/buy`, {
                coinsAmount: amountOfCoins,
                signedTx: transactionHash
            })
            //console.log(res)
            //  generateSign(res.data.init)
            setSuccessPopup({ "success": true, "message": "Success" })
            refresher((prev: any) => !prev)
        } catch (err) {
            console.warn(err)
            //console.warn("Service problems")
            setSuccessPopup({ "success": false, "message": "Not enough MATIC coins in wallet" })
        } finally {
            setLoading(false)
            //setSuccessPopup({ "success": true, "message": "Success" })
        }
    }

    const buyCoins = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        setVisible(false)
        try {
            //console.log(amountOfCoins)
            const res = await axios.post(`${process.env.API_URL}/buyCoins/initTransaction`, {
                coinsAmount: amountOfCoins
            })
            //console.log(res)
            generateSign(res.data.init)
        } catch (err) {
            console.warn(err)
            setLoading(false);
        } finally {

        }
    }
    return (
        <div className={styles.BuyCoinsPopup}>

            <div className={styles.body}>
                <Image className={styles.close} src="/close.svg" alt="" width={20} height={20} onClick={() => setVisible(false)} />
                <div className={styles.header}>
                    <h3>Buy Moolite Coins</h3>
                </div>
                <form onSubmit={buyCoins}>
                    <label>Amount of coins</label>
                    <input type={'number'} defaultValue={0} onChange={(e: any) => setAmountOfCoins(parseInt(e.target.value))} min={1} />
                    <p className={styles.mayTake}>Buying Moonlite Coins may take a minute</p>
                    <button className={styles.create} >Buy</button>
                </form>
            </div>
        </div>

    )
}
export default BuyCoinsPopup;