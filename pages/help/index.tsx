import { NextPage } from "next";
import styles from "./Help.module.scss"

interface HelpProps {

}
const Help: NextPage<HelpProps> = () => {
    return (

        <div className={styles.Help}>
            <h1>Help</h1>
            <p>If you encounter any issues or have questions regarding Chase The Moonlite, we are here to assist you. Our dedicated support team is available to address your concerns and provide guidance. Please feel free to reach out to our owner, John Smith, via the contact information provided below.</p>
            <p>
                Help Section:

                If you encounter any issues or have questions regarding Chase The Moonlite, we are here to assist you. Our dedicated support team is available to address your concerns and provide guidance. Please feel free to reach out to our owner, John Smith, via the contact information provided below.

                In the unfortunate event that you come across any suspicious or potentially fraudulent activities on the platform, we take such matters seriously. We have implemented robust security measures to ensure a safe and trustworthy environment for all users. If you suspect any unauthorized or fraudulent behavior, please report it immediately to our owner, John Smith. Your vigilance helps us maintain the integrity of the Chase The Moonlite community.</p>
                <p>Contact informations are placed on the bottom of website</p>
                <p>We appreciate your cooperation and are committed to providing prompt assistance and resolving any issues that may arise. Your trust and satisfaction are our top priorities at Chase The Moonlite.</p>
        </div>

    )
}

export default Help;