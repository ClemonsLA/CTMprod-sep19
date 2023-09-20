import { AuctionListing, DirectListing } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/App.module.scss";
import { Magic } from "magic-sdk"
import { Router, useRouter } from 'next/router'
import Artists from "./collections";
import axios from "axios"
import { ListingItem } from "../types/listing.types";
import OutNow from "./out-now";
import { Collection } from "../types/collections.types";
import SpinningLoader from "../components/SpinningLoader/SpinningLoader";
import { clearUser } from "../services/user-services";
import { UserContext } from "../context/context";
import SuccessPopup from "../components/SuccessPopup/SuccessPopup";

interface StaticProps {
  listing: ListingItem[];
  collections: Collection[];
}

/*export const getStaticProps = async () => {
  const res = await axios.get(`${process.env.API_URL}/listing`);
  const data = res.data.listing
  const collectionRes = await axios.get(`${process.env.API_URL}/collection`);
  const collectionData = collectionRes.data;
  return {
    props: { listing: data, collections: collectionData.collections }
  }
}*/

const App: NextPage<StaticProps> = (/*{ listing, collections }: StaticProps*/) => {
  const router = useRouter()
  const handleBuy = async (nft: (AuctionListing | DirectListing)) => {

  }
  const [magic, setMagic] = useState<Magic>();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([])
  const [collections, setCollections] = useState([])
  const [successPopup, setSuccessPopup] = useState<any>({ "success": null, "message": null })
  //@ts-ignore
  const { user, setUser } = useContext(UserContext)

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response !== undefined) {
      if (error.response.status === 401) {
        // handle error: inform user, go to login, etc
        router.push('/')
        clearUser(setUser);
       // setSuccessPopup({ "success": false, "message": "Please log in again, session expired." })
      } else {
        return Promise.reject(error);
      }
    }
  });

  useEffect(() => {
    setLoading(true);
    (async() => {
      const res = await axios.get(`${process.env.API_URL}/listing`);
      const data = res.data.listing
      setListing(data)
      const collectionRes = await axios.get(`${process.env.API_URL}/collection`);
      const collectionData = collectionRes.data;
      setCollections(collectionData.collections)
      setLoading(false)
    })()
    
  }, [])

  useEffect(() => {
    (async () => {
      const newMagic = new Magic('pk_live_5062FA15878DC2A2', {
        network: 'goerli',
        //testMode: true,
      });
      setMagic(newMagic);
      //@ts-ignore
      //const web3 = new Web3(newMagic.rpcProvider);
      newMagic.preload().then(() => console.log('Magic iframes loaded'));
      try {
        /*const accounts = await magic!.wallet.connectWithUI();
        if (typeof accounts[0] === "string") {
           setUser(accounts[0]);
        } else {
          setUser(null);
        }*/
      } catch (error) {
        console.warn(error)
      }
    })()

  }, [])
  return (
    <div className={styles.container} style={{ colorScheme: 'dark' }}>
      {successPopup.success !== null ? <SuccessPopup success={successPopup.success} message={successPopup.message} setSuccess={setSuccessPopup} /> : null}
      {loading ? <SpinningLoader /> :
        <main className={styles.main}>
          <div className={styles.main_body} >
            {!loading ? (
              <div className={styles.wrapper}>
                <h4 className={styles.section_header}>Collections</h4>
                <Artists collections={collections} displayNumber={8} showLoadMore={false} />
                <h4 className={styles.section_header}>Out now</h4>
                <OutNow listing={listing} />
                {/*<h4 className={styles.section_header}> Ranking </h4>
                <Ranking />*/}
              </div>
            ) : (
              <SpinningLoader />
            )}
          </div>
        </main>
      }
    </div>
  );
};

export default App;
