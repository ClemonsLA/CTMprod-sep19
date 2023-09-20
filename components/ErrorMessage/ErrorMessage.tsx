import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import styles from "./ErrorMessage.module.scss"

const ErrorMessage = ({message}: {message: string}) => {
    const errorRef: any = useRef();
    useEffect(() => {
        try{
            if (message === ""){
                errorRef.current.style.display = "none"
            }else {
                errorRef.current.style.display = "flex"
            }
        }catch(e: any){
            console.warn(e.message)
        }
    }, [message])
    return(
    <div className={styles.ErrorMessage} ref={errorRef} style={{display: 'none'}}>
            <Image src="error.svg" width={50} height={50} alt="" className={styles.image}/>
            <p>{message}</p>
        </div>
    
        
    )
}
export default ErrorMessage;