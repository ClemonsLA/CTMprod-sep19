import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Popup.module.scss'

interface PopupProps {
    setVisible: any;
    refresher: any;
    setSuccessPopup: any;
}

const Popup = ({ setVisible, refresher, setSuccessPopup }: PopupProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("")
    const createCollection = async (e: any) => {
        e.preventDefault()
        if (name.trim() === '' || description.trim() === '') {
            setError('Fields cannot be empty!');
            return;
        }
        if(name.length > 44){
            setError('Name cannot be longer than 44 characters');
            return;
        }
        try {
            const formData: any = new FormData(e.currentTarget);
            const authToken = localStorage.getItem("auth_token")
            const user: any = localStorage.getItem("user")
            const creatorName = JSON.parse(user).name
            //console.log(creatorName)
            const config = { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } }
            formData.append("avatarImage", "")
            formData.append("bannerImage", "")
            formData.append("creatorName", creatorName)
            //formData.append("creatorAddress", creatorAddress)
            formData.append("nfts", [])
            const loginRes = await axios.post(`${process.env.API_URL}/collection/create`, formData, config)
            //console.log(loginRes)
            setSuccessPopup({ "success": true, "message": "Collection added successfuly" })
        } catch (error: any) {
            setSuccessPopup({ "success": false, "message": "Cannot add collection" })
            // setErrorMessage(error.message)
            // setTimeout(() => {setErrorMessage("")}, 2000)
            console.error(error)
        } finally {
            setVisible(false)
            refresher((prev: boolean) => !prev)
        }
    }
    return (
        <div className={styles.Popup}>
            <div className={styles.body}>
                <Image className={styles.close} src="/close.svg" alt="" width={20} height={20} onClick={() => setVisible(false)} />
                <div className={styles.header}>
                    <h3>Create collection</h3>
                </div>
                <form className={styles.form} onSubmit={createCollection}>
                    <label >Name</label>
                    <input name="name" type="text" onChange={(e) => setName(e.target.value)}></input>
                    <label>Description</label>
                    <textarea name="description" rows={5} maxLength={150} onChange={(e) => setDescription(e.target.value)} />
                    {error !== "" ? error : null}
                    <button className={styles.create} >Create</button>
                </form>
            </div>

        </div>
    )
}
export default Popup;