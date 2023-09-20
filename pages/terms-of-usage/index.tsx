import { NextPage } from "next";
import styles from "./TermsOfUsage.module.scss"

interface TermsOfUsageProps {

}
const TermsOfUsage: NextPage<TermsOfUsageProps> = () => {
    return (

        <div className={styles.TermsOfUsage}>
            <h1>Terms of usage</h1>
            <p>Put content</p>
            <p>Here in the {"<"}p{">"} elements</p>
            <p>To add every new paragraph on a website</p>
        </div>

    )
}

export default TermsOfUsage;