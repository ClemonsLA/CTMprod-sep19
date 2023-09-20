import { NextPage } from "next";
import styles from "./PrivacyPolicy.module.scss"

interface PrivacyPolicyProps {

}
const PrivacyPolicy: NextPage<PrivacyPolicyProps> = () => {
    return (

        <div className={styles.PrivacyPolicy}>
            <h1>Privacy Policy</h1>
            <p>Put content</p>
            <p>Here in the {"<"}p{">"} elements</p>
            <p>To add every new paragraph on a website</p>
        </div>

    )
}

export default PrivacyPolicy;