import { CSSProperties } from "react";
import styles from "./CircularButton.module.scss"

interface CircularButtonProps {
    style: CSSProperties;
    text: string;
    callback: () => void;
}

const CircularButton = ({ style,  text, callback }: CircularButtonProps) => {
    return (
        <div className={styles.CircularButton} style={ style } onClick={callback}>
            {text}
        </div>
    )
}
export default CircularButton;