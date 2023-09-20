import Image from "next/image";
import styles from "./CollectionTile.module.scss"

interface CollectionTileProps {
    element: any;
    index: number;
    handleClick: (index: number) => void;
    deleteCollection: (id: number) => void;
}

const CollectionTile = ({ element, index, handleClick, deleteCollection }: CollectionTileProps) => {
    return (
        <div className={styles.body}>
            <Image width={26} height={26} alt="" className={styles.delete} src={"/trash.svg"} onClick={() => deleteCollection(element.id)} />

        <div className={styles.CollectionTile} key={index} onClick={() => handleClick(element.id)} >
            <Image width={92} height={92} alt="" className={styles.avatar} src={"/collection.jpg"} />
            <p className={styles.title}>{element.name}</p>
            <div className={styles.bottomWrapper}>
                <div><p>Author name</p><p className={styles.authorName}>{element.creatorName}</p></div>
                <div><p>Tacks number</p><p className={styles.tracks}>{element.nfts.length}</p></div>
            </div>

        </div >
        </div>
    )
}
export default CollectionTile;