import Image from "next/image"
import styles from "./CircleTransparentButton.module.scss"

interface CircleTransparentButtonProps {
    width: number;
    height: number;
    src: string;
    handler: () => void;
}
const CircleTransparentButton = ({ width, height, src, handler }: CircleTransparentButtonProps) => {
    return (
        <div className={styles.CircleTransparentButton} style={{width: width, height: height}} onClick={handler}>
            <Image width={width} height={height} alt="" src={src} />
        </div>
    )
}
export default CircleTransparentButton;