import { MediaRenderer } from "@thirdweb-dev/react";
import axios from "axios";
import Image from "next/image";
import router from "next/router";
import { genreList } from "../../types/genreList";
import { ListingItem } from "../../types/listing.types";
import styles from "./Tile.module.scss"

interface TileProps {
    index: number;
    item: ListingItem;
    isDeletable: boolean;
    deleteNft: (id: number) => void;
}
const Tile = ({ index, item, isDeletable, deleteNft }: TileProps) => {
    const handleClick = () => {
        router.push(`itemOverview/${item.id}`);
    }
    const genreDecoder = (index: number) => {
        return genreList[index - 1];
    }

    return (
        <div className={styles.body}>
            {isDeletable ? <Image width={26} height={26} alt="" className={styles.delete} src={"/trash.svg"} onClick={() => deleteNft(item.contractId)} /> : null}
            <div className={styles.Tile} onClick={handleClick}>
                <MediaRenderer
                    src={item.imageURL}
                    controls
                    style={{ objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
                    width="240px"
                    height="200px" />
                <div className={styles.tileBottom}>
                    <p className={styles.name}>{item.name === "" ? "Unknown name" : item.name}</p>
                    <div className={styles.prices_panel}>
                        <div>
                            <p>GENRE</p>
                            <p>{genreDecoder(item.genre)}</p>
                        </div>
                        <div>
                            <p>PRICE</p>
                            <p>{item.price} MC</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Tile;