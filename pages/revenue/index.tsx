import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Revenue.module.scss"
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import axios from "axios";

interface RevenueProps {

}
const Revenue: NextPage<RevenueProps> = () => {
    const [revenueList, setRevenueList] = useState([]);
    const router = useRouter()
    const colors = {
        none: 'rgba(255, 0, 0, 0.4)',
        profit: 'rgba(05, 195, 0, 0.4)',
    }
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user')
        const wallet = localStorage.getItem('wallet_address')
        if (wallet !== null && user !== null && token !== null) {
        } else {
            router.replace("/")
        }
    }, [router])
    useEffect(() => {
        (async () => {
            try {
                const authToken = localStorage.getItem("auth_token")
                const config = { headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } }
                const res = await axios.get(`${process.env.API_URL}/user/revenue`, config);
                const data = res.data
                //console.log(data);
                setRevenueList(data.revenue)
            } catch (err) {
                console.warn(err)
            }
        })()
    }, [])
    return (
        <div className={styles.Revenue}>

            {revenueList !== undefined && revenueList.length > 0 ?
                <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    className={styles.swiper}
                    centeredSlides
                    autoHeight
                >
                    {revenueList.map((element: any, index: number) => {
                        return (<SwiperSlide key={index} className={styles.slide} style={{ backgroundColor: colors.profit }}><h4>{months[element.month - 1]} {element.year}</h4>
                            <p>{element.amountSold} NFTs sold for {element.sellRevenue} MC</p>
                            <p>{element.amountRented} NFTs rented for {element.rentRevenue} MC</p>
                            <p style={{ fontWeight: 700, fontSize: "22px", borderBottom: '2px solid #fff', paddingBottom: '5px' }}>Total profit: {element.sellRevenue + element.rentRevenue} MC</p>
                        </SwiperSlide>)
                    })}
                </Swiper>
                :
                <p style={{ color: '#000', textAlign: 'center', margin: 'auto', fontSize: '21px' }}>There is no revenue for this account</p>}
        </div>
    )
}

export default Revenue;