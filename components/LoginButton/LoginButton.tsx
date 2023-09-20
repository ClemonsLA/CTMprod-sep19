import styles from "./LoginButton.module.scss"

interface LoginButtonProps {
    width: number;
    height: number;
    margin: number;
    text: string;
    callback: () => void;
}

const LoginButton = ({ width, height, margin,  text, callback }: LoginButtonProps) => {
    return (
        <div className={styles.LoginButton} style={{ width: width, height: height, padding: `${height/2}px ${width/2}px`, margin: margin }} onClick={callback}>
            {text}
        </div>
    )
}
export default LoginButton;