import axios from 'axios';
import Image from 'next/image';
import styles from './NFTPopup.module.scss'

interface NFTPopupProps {
    setVisible: any;
}

const NFTPopup = ({ setVisible }: NFTPopupProps) => {
    const createCollection = async (e: any) => {
        try {
            e.preventDefault()
            const formData: any = new FormData(e.currentTarget);
            const authToken = localStorage.getItem("auth_token")
            const user: any = localStorage.getItem("user")
            const creatorName = JSON.parse(user).name
            const creatorAddress = JSON.parse(user).walletAddress
            const config = { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } }
            formData.append("creatorName", creatorName)
            formData.append("creatorAddress", creatorAddress)
            formData.append("nfts", [])
            const loginRes = await axios.post(`${process.env.API_URL}/collection/create`, formData, config)
            //console.log(loginRes)
        } catch (error: any) {
            // setErrorMessage(error.message)
            // setTimeout(() => {setErrorMessage("")}, 2000)
            console.error(error)
        }
    }
    return (
        <div className={styles.NFTPopup}>
            <div className={styles.body}>
                <Image className={styles.close} src="/close.svg" alt="" width={30} height={30} onClick={() => setVisible(false)} />
                <div className={styles.header}>
                    <h3>Create collection</h3>
                </div>
                <form className={styles.form} onSubmit={createCollection}>
                    <label >Name</label>
                    <input name="name" type="text" pattern="^(?!\s*$).+"></input>
                    {/*<label>Quantity (number)</label>
                    <input name="quantity" type="number"></input>*/}
                    <label>Description</label>
                    <textarea name="description" rows={5} maxLength={150} />
                    <button className={styles.create} >Create</button>
                </form>
            </div>

        </div>
    )
}
export default NFTPopup;