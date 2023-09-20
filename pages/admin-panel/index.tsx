import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import styles from "./AdminPanel.module.scss"

interface AdminPanelProps {

}
const AdminPanel: NextPage<AdminPanelProps> = ({ }: AdminPanelProps) => {
    const router = useRouter()
    const [newPrice, setNewPrice] = useState<string>()
    const [isLoading, setLoading] = useState(false)
    const [oldPrice, setOldPrice] = useState<number>()
    const [deleteUserName, setDeleteUserName] = useState("")
    const [blackflagUserName, setBlackflagUserName] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [blackflagList, setBlackflagList] = useState([])
    useEffect(() => {
        const userRole = localStorage.getItem("role")
        if (parseInt(userRole!) < 1) {
            router.replace("/")
            return;
        }
        (async () => {
            const res = await axios.get(`${process.env.API_URL}/buyCoins/coin-price-by-name`)
            //console.log(res.data.coinPrice)
            setOldPrice(res.data.coinPrice)
            const response = await axios.get(`${process.env.API_URL}/user/banned-users`)
            //console.log(response)
            setBlackflagList(response.data)
        })()
    }, [refresh])
    const changePrice = async () => {
        try {
            //console.log(newPrice)
            const res = await axios.put(`${process.env.API_URL}/buyCoins/change-price/${Number(newPrice)}`)
            //console.log(res)
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        }
    }
    const deleteUser = async () => {
        try {
            const res = await axios.delete(`${process.env.API_URL}/user/${deleteUserName}`)
            //console.log(res)
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        }
    }
    const blackflagUser = async () => {
        try {
            const res = await axios.put(`${process.env.API_URL}/user/blacklist/${blackflagUserName}`)
            //console.log(res)
            setRefresh(prev => !prev)
        } catch (err) {
            console.warn(err)
        }
    }
    return (
        <>
            {isLoading ? <SpinningLoader /> :
                <div className={styles.AdminPanel}>
                    <h3>Admin Panel</h3>
                    <div className={styles.row}>
                        <p>Change coin price</p>
                        <input type={"number"} step={"any"} onChange={(e) => { console.log(e.target.value); setNewPrice(e.target.value) }} defaultValue={oldPrice} />
                        <button className={styles.change} onClick={changePrice}>Change</button>
                    </div>
                    <div className={styles.row}>
                        <p>Delete user by name</p>
                        <input type={"text"} placeholder={"User name"} onChange={(e) => setDeleteUserName(e.target.value)} />
                        <button className={styles.delete} onClick={deleteUser}>Delete</button>
                    </div>
                    <div className={styles.row}>
                        <p>Blackflag by name</p>
                        <input type={"text"} placeholder={"User name"} onChange={(e) => setBlackflagUserName(e.target.value)} />
                        <button className={styles.blackflag} onClick={blackflagUser}>Blackflag user</button>
                    </div>
                    <div className={styles.column}>
                        <h4>All banned users</h4>
                        <div className={styles.blackflagUser}>
                            <p>#</p>
                            <p>Name</p>
                            <p>Email</p>
                            {/*<p>Wallet</p>*/}
                            <p>Coins</p>
                        </div>
                        {
                            blackflagList.length > 0 ?
                                blackflagList.map((element: any, index: number) => {
                                    return <div key={index} className={styles.blackflagUser}>
                                        <p>{index + 1}</p>
                                        <p>{element.name}</p>
                                        <p>{element.email}</p>
                                        {/*<p>Wallet {element.walletAddress}</p>*/}
                                        <p>{element.coins} MC</p>
                                    </div>
                                }) : <div className={styles.blackflagUser}>
                                    <span style={{ textAlign: 'center', marginInline: 'auto' }}>There are no banned users</span>
                                </div>}
                    </div>
                </div>}
        </>
    )
}

export default AdminPanel;