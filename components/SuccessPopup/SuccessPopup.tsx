import Image from 'next/image';
import { useEffect } from 'react';
import styles from './SuccessPopup.module.scss'

interface SuccessPopupProps {
    success: boolean;
    message: string;
    setSuccess: any;
}

const SuccessPopup = ({success, message, setSuccess}: SuccessPopupProps) => {
    useEffect(() => {
        setTimeout(() => {
            setSuccess({"success": null, "message": null})
        }, 2000)
    }, [])
    return (
        <div className={styles.SuccessPopup}>
            <div className={styles.body}>
                <Image className={styles.close} src="/close.svg" alt="" width={30} height={30} onClick={() => {setSuccess({"success": null, "message": null})}} />
                <div className={styles.header}>
                {success ? <Image className={styles.result} src="/success.svg" alt="" width={40} height={40} />:
                <Image className={styles.result} src="/error.svg" alt="" width={40} height={40} />}
                    <h3 style={{color: !success ? 'red' : '#00ff00'}}>{success ? "Success" : "Failure"}</h3>
                    
                </div>
                <div className={styles.message}>{message}</div>
            </div>

        </div>
    )
}
export default SuccessPopup;