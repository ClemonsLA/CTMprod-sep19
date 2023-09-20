import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { LegacyRef, useEffect, useRef, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import styles from "./MintNft.module.scss"
import * as Yup from 'yup'
import { useFormik } from "formik";
import { clearUser } from "../../services/user-services";

interface MintNftProps {

}
const MintNft: NextPage<MintNftProps> = () => {
    const router = useRouter();
    const musicFileRef = useRef<LegacyRef<HTMLInputElement> | any>()
    const imageFileRef = useRef<any>()
    const genreList = ["Rap", "EDM", "Tech House", "House", "Techno", "Melodic Techno", "Drum and Bass", "Future Bass", "Dubstep", "Trance", "Trap", "Garage", "Nu Disco", "Rock", "Alternative", "Heavy Metal", "Grunge", "Blues", "Punk", "Progressive", "Hip-Hop", "Trap-music", "Hip-Hop beat producer", "R&B", "Pop", "Dance-Pop", "K-Pop", "J-Pop", "Vocals", "Singers", "Rappers"];
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successPopup, setSuccessPopup] = useState<any>({ "success": null, "message": null })
    const [price, setPrice] = useState(1)
    const [rentPrice, setRentPrice] = useState(1)
    const [usr, setUsr] = useState();

    axios.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if (error.response !== undefined) {
          if (error.response.status === 401) {
            // handle error: inform user, go to login, etc
            clearUser(setUsr);
            router.push('/')
          
           // setSuccessPopup({ "success": false, "message": "Please log in again, session expired." })
          } else {
            return Promise.reject(error);
          }
        }
      });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        quantity: Yup.number()
            .required('Quantity is required')
            .positive('Quantity must be a positive number')
            .integer('Quantity must be an integer'),
        description: Yup.string().required('Description is required'),
        genre: Yup.string().required('Genre is required'),
        music: Yup.mixed().required('Music file is required'),
        coverImage: Yup.mixed().required('Cover image is required'),
    });

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user')
        const wallet = localStorage.getItem('wallet_address')
        if (wallet !== null && user !== null && token !== null) {
        } else {
            router.replace("/")
            setLoading(false)
        }
    }, [])


    const formik = useFormik({
        initialValues: {
            name: '',
            quantity: '',
            description: '',
            genre: "1",
            music: null,
            coverImage: null,
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission
            console.log(values)
            mintButton(values);
        },
    });

    const mintButton = async (formData: any) => { //React.FormEvent<HTMLFormElement>
        try {
            setLoading(true)
            //e.preventDefault()
            //const formData: any = new FormData(e.currentTarget);
            const authToken = localStorage.getItem("auth_token")
            const walletAddress = localStorage.getItem('wallet_address')
    
                const config = { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } }
                // formData.append("address", walletAddress)
                formData = { address: walletAddress, ...formData }
                const loginRes = await axios.post(`${process.env.API_URL}/mint`, formData, config)
                console.log(loginRes)
                const contractId = loginRes.data.contractId

                const result = await axios.put(`${process.env.API_URL}/listing/create-and-save/`, {
                    idFromContract: parseInt(contractId),
                    newPrice: price,
                    newRentPrice: rentPrice,
                    amount: formData.quantity
                }, { headers: { 'Authorization': `Bearer ${authToken}` } })
                console.log(result)
                setSuccessPopup({ "success": true, "message": "NFT created succeffuly" })
            
        } catch (error: any) {
            console.error(error)
            //setErrorMessage(error.message)
            //setTimeout(() => { setErrorMessage("") }, 2000)
            setSuccessPopup({ "success": false, "message": "Cannot mint NFT" })//error.response.data
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {isLoading ? <SpinningLoader /> :
                <div className={styles.MintNft}>
                    {errorMessage !== "" ? <ErrorMessage message={errorMessage} /> : null}
                    {successPopup.success !== null ? <SuccessPopup success={successPopup.success} message={successPopup.message} setSuccess={setSuccessPopup} /> : null}
                    <h1>Minft NFT</h1>
                    <form className={styles.form} onSubmit={formik.handleSubmit}>
                        <div className={styles.joined}>
                            <div>
                                <label>Name</label>
                                <input name="name" type="text" value={formik.values.name} onChange={formik.handleChange} />
                                {formik.errors.name && formik.touched.name && <div>{formik.errors.name}</div>}
                            </div>
                            <div>
                                <label>Quantity (number)</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    value={formik.values.quantity}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors.quantity && formik.touched.quantity && <div>{formik.errors.quantity}</div>}
                            </div>
                        </div>
                        <div className={styles.joined}>
                            <div>
                                <label>Purchase price (Moonlite Coins)</label>
                                <input type="number" min={"1"} defaultValue={1} onChange={(e) => setPrice(parseInt(e.target.value))}></input>
                            </div>
                            <div>
                                <label>Rent price (Moonlite Coins)</label>
                                <input type="number" min={"1"} defaultValue={1} onChange={(e) => setRentPrice(parseInt(e.target.value))}></input>
                            </div>
                        </div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <div>{formik.errors.description}</div>
                        )}
                        <label>Genre</label>
                        <select name="genre" value={formik.values.genre} onChange={formik.handleChange}>
                            {genreList.map((element, index) => (
                                <option key={index} value={(index + 1).toString()}>
                                    {element}
                                </option>
                            ))}
                        </select>
                        {formik.errors.genre && formik.touched.genre && <div>{formik.errors.genre}</div>}
                        <div className={styles.joined}>
                            <div>
                                <label>Music</label>
                                <input
                                    name="music"
                                    type="file"
                                    id="file"
                                    accept="audio/*"
                                    onChange={(event: any) => {
                                        formik.setFieldValue('music', event.currentTarget.files[0]);
                                    }}
                                />
                                {formik.errors.music && formik.touched.music && <div>{formik.errors.music}</div>}
                            </div>
                            <div>
                                <label>Cover Image</label>
                                <input
                                    name="coverImage"
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={(event: any) => {
                                        formik.setFieldValue('coverImage', event.currentTarget.files[0]);
                                    }}
                                />
                                {formik.errors.coverImage && formik.touched.coverImage && (
                                    <div>{formik.errors.coverImage}</div>
                                )}
                            </div>
                        </div>
                        <p className={styles.mayTake}>Minting NFT may take a minute</p>
                        <button type="submit">Mint NFT</button>
                    </form>

                </div>}
        </>
    )
}

export default MintNft;