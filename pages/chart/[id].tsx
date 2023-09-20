import { NextPage } from "next"
import { useRouter } from "next/router"
import styles from "./Chart.module.scss"
import Image from "next/image";
import axios from "axios"
import { useEffect, useState } from "react";
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import { genreList } from "../../types/genreList"

const Chart: NextPage<any> = (/*{items}: {items:any}*/) => {
    const router = useRouter()
    const { id, title } = router.query
    const [items, setItems] = useState<any>([])
    const [isLoading, setLoading] = useState(true);
    const [displayTitle, setDisplayTitle] = useState(title);

    useEffect(() => {
        setLoading(true);
        if (router.isReady) {
            if(id!== "0" && id !== undefined){
                //@ts-ignore
               setDisplayTitle(genreList[parseInt(id) -1 ])
                
            }else{
                setDisplayTitle("Global")
            }
            
            (async () => {
                if (id !== "0") {
                    try {
                        const res = await axios.post(`${process.env.API_URL}/listing/ranking`, {
                            genreType: id,
                            amountOfListing: 100
                        }, {
                            validateStatus: function (status) {
                                return status <= 300; // Reject only if the status code is greater than 300
                            }
                        });
                        const data = res.data.listings
                        setItems(data)
                        //console.log(data)
                    }
                    catch (err) {
                        console.warn(err)
                    }
                    finally {
                        setLoading(false);
                    }
                }
                else {
                    try {
                        const res = await axios.get(`${process.env.API_URL}/listing/allRanking/0`, {
                            validateStatus: function (status) {
                                return status <= 300; // Reject only if the status code is greater than 300
                            }
                        });
                        //console.log(res)
                        if (res.status === 300 || res.status === 200) {
                            //console.log(res.data.listing)
                            if (res.data.allListings !== undefined) {
                                //@ts-ignore
                                setItems(res.data.allListings)
                            } else {
                                setItems([])
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                }
            })()
        }
    }, [router.isReady])

    useEffect(() => {
        setLoading(true);
        (async () => {
            if (id !== "0") {
                try {
                    const res = await axios.post(`${process.env.API_URL}/listing/ranking`, {
                        genreType: id,
                        amountOfListing: 100
                    }, {
                        validateStatus: function (status) {
                            return status <= 300; // Reject only if the status code is greater than 300
                        }
                    });
                    const data = res.data.listings
                    setItems(data)
                    //console.log(data)

                }
                catch (err) {
                    console.warn(err)
                }
                finally {
                    setLoading(false);
                }
            }
            else {
                try {
                    const res = await axios.get(`${process.env.API_URL}/listing/allRanking/0`, {
                        validateStatus: function (status) {
                            return status <= 300; // Reject only if the status code is greater than 300
                        }
                    });
                    //console.log(res)
                    if (res.status === 300 || res.status === 200) {
                        //console.log(res.data.listing)
                        if (res.data.allListings !== undefined) {
                            //@ts-ignore
                            setItems(res.data.allListings)
                        } else {
                            setItems([])
                        }
                    }
                }
                catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        })()
    }, [])
    const PlaceTile = ({ item, index }: { item: any, index: number }) => {
        return (
            <div className={styles.place} key={0} onClick={() => router.push(`/itemOverview/${item.id}`)}>
                <p style={{ fontSize: '24px' }}>{index + 1}</p>
                <Image width={95} height={95} className={styles.avatar} alt="" src={item.imageURL} />
                <p className={styles.author}>{item.creator[0].name}</p>
                <p>{item.name}</p>
                <p>{item.rankingPoints}</p>
            </div>
        );
    }
    return (
        <>
            {isLoading ? <SpinningLoader /> : <div className={styles.Chart}>

                <p className={styles.header}>{displayTitle} top 100</p>
                <div className={styles.wrapper}>
                    <div className={styles.placeHeader}>
                        <p>#</p>
                        <span>Cover</span>
                        <p className={styles.author}>Author</p>
                        <p>Name</p>
                        <p>Ranking Points</p>
                    </div>
                    {items !== undefined && items.length > 0 ? items.map((element: any, index: number) => {
                        return <PlaceTile key={index} item={element} index={index} />
                    }) : null}
                </div>
            </div>}
        </>
    )
}
export default Chart;