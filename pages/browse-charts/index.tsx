import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import SpinningLoader from "../../components/SpinningLoader/SpinningLoader";
import { genreList } from "../../types/genreList";
import { ListingItem } from "../../types/listing.types";
import styles from "./BrowseCharts.module.scss"

interface BrowseChartsProps {

}
const BrowseCharts: NextPage<BrowseChartsProps> = () => {
  const router = useRouter()
  const [currentGenre, setCurrentGenre] = useState<string>("0");
  const [chartTitle, setChartTitle] = useState("Global");
  const [displayData, setDisplayData] = useState<ListingItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    //console.log(currentGenre);
    setLoading(true);
    (async () => {
      if (currentGenre !== "0") {
        try {
          const res = await axios.post(`${process.env.API_URL}/listing/ranking`, {
            genreType: currentGenre,
            amountOfListing: 3
          }, {
            validateStatus: function (status) {
              return status <= 300; // Reject only if the status code is greater than 300
            }
          });
          //console.log(res)
          if (res.data.listings !== undefined) {
            setDisplayData(res.data.listings)
          } else {
            setDisplayData([])
          }

        }
        catch (err) {
          console.error(err);
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
          if (res.status === 300 || res.status === 200 || res.status === 304) {
            if (res.data.allListings !== undefined) {
              setDisplayData([res.data.allListings[0], res.data.allListings[1], res.data.allListings[2]])
            } else {
              setDisplayData([])
            }
          }
        }
        catch (err) {
          console.error(err);
        }
      }

    })()
    setLoading(false)
  }, [currentGenre])
  const [isChartLoading, setChartLoading] = useState(false);
  const Chart = ({ items, title }: { items: any[], title: string }) => {
    return (
      <div className={styles.top100} onClick={() => {
        setChartLoading(true)
        items.length > 0 ?
          router.push({ pathname: `/chart/${currentGenre}`, query: { title: chartTitle } }, `/chart/${currentGenre}`)
          :
          null
        setChartLoading(false);
      }

      }>
        <p className={styles.header}>{title} top 3</p>
        <div className={styles.body}>
          {items.length > 0 ?
            items.map((element, index) => {
              if (element === undefined) {
                return;
              }
              return (
                <div className={styles.place} key={index}>
                  <p style={{ width: '25px', marginInline: 'auto', fontSize: (index + 1) === 1 ? '30px' : '26px' }}>{index + 1}</p>
                  <div className={styles.info}>
                    <p className={styles.author}>{(element !== undefined && element.creator !== undefined && element.creator !== null && element.creator !== null) ? element.creator[0].name : "Honorable author"}</p>
                    <p>{element === undefined ? "" : element.name}</p>
                  </div>
                  <Image width={95} height={95} className={styles.avatar} alt="" src={element.imageURL} />
                </div>
              )
            }) :
            <p style={{ textAlign: 'center', padding: '30px 10px', fontWeight: '700', fontSize: '22px' }}>There are no tracks in {title} genre ranking</p>}
        </div>
        <div className={styles.bottom}>
          {items.length > 0 ? <p>Click to see top 100</p> : <p>Not enough records to see top 100</p>}
        </div>
      </div>
    )
  }


  return (
    <>{isLoading ? <SpinningLoader /> :
      <div className={styles.BrowseCharts}>
        <h1>Charts</h1>
        <select className={styles.select} onChange={(event) => { setCurrentGenre(event.target.value); if (event.target.value === "0") { setChartTitle("Global") } else { setChartTitle(genreList[parseInt(event.target.value) - 1]) } }}>
          <option value={"0"}>All</option>
          {genreList.map((element, index) => {
            return <option value={(index + 1).toString()} key={index}>{element}</option>
          })
          }
        </select>
        {isChartLoading ? <Oval
          height={80}
          width={80}
          color="#1e3799"
          wrapperStyle={{ width: '95%', height: '350px', disple: "flex", justifyContent: "center", alignItems: "center" }}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#4a69bd"
          strokeWidth={2}
          strokeWidthSecondary={2}
        /> : <Chart items={displayData} title={chartTitle}></Chart>}
      </div>}
    </>
  )
}

export default BrowseCharts;