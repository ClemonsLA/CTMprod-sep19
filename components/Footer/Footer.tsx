import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from "./Footer.module.scss"

interface SocialLinkProps {
    src: string;
    url: string;
}
const Footer = () => {
    // Change informations below
    const location = "61 Sugar Ave. Los Angeles, CA 90004";
    const mail = "mail@example.com";
    const phone = "+ 01 234 567 89";
    // Social links - if you don't want to show any link just change its content to ""
    let twitterLink = "https://google.com";
    let linkedinLink = "https://google.com";
    let instagramLink = "https://google.com";
    let facebookLink = "https://google.com";

    const SocialLink = ({ src, url }: SocialLinkProps) => {
        return (
            <Image src={src} width={24} height={24} className={styles.socialLink} alt="" onClick={() => {
                window.open(url);
            }} />
        )
    }
    return (
        <div className={styles.Footer}>
            <div className={styles.sections}>
                <div className={styles.column}>
                    <p>CHASE THE MOONLITE</p>
                    <p style={{ lineHeight: "26px" }}>Explore the world of music like never before with Chase the Moonlite, a cutting-edge music NFT marketplace. Immerse yourself in a unique ecosystem where artists, collectors, and enthusiasts come together to celebrate the beauty of music.</p>
                </div>
                <div className={styles.column}>
                    <p>USEFUL LINKS</p>
                    <ul>
                        <li><Link href="/privacy-policy" className={styles.routeLink}>Privacy policy</Link></li>
                        <li><Link href="/terms-of-usage" className={styles.routeLink}>Terms of usage</Link></li>
                        <li><Link href="/help" className={styles.routeLink}>Help</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <p>CONTACT</p>
                    <ul>
                        <li><Image alt="" width={22} height={22} src="/home.svg" />{location}</li>
                        <li><Image alt="" width={22} height={22} src="/mail.svg" />{mail}</li>
                        <li><Image alt="" width={22} height={22} src="/tel.svg" />{phone}</li>
                    </ul>
                </div>
            </div>
            <div className={styles.socials}>
                <p>All rights reserved.</p>
                <div>
                    {twitterLink !== "" ? <SocialLink src="/twitter.svg" url={twitterLink} /> : null}
                    {linkedinLink !== "" ? <SocialLink src="/linkedin.svg" url={linkedinLink} /> : null}
                    {instagramLink !== "" ? <SocialLink src="/instagram.svg" url={instagramLink} /> : null}
                    {facebookLink !== "" ? <SocialLink src="/facebook.svg" url={facebookLink} /> : null}
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} Chase The Moonlite</p>
            </div>
        </div>
    )
}

export default Footer