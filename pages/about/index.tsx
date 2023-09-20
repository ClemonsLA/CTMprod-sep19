import { NextPage } from "next";
import styles from "./About.module.scss"

interface AboutProps {

}
const About: NextPage<AboutProps> = () => {
    return (

        <div className={styles.About}>
            <h1>About</h1>
            <p>Chase The Moonlite is a groundbreaking music NFT marketplace designed to revolutionize the way artists sell and showcase their music. With the rise of digital media and the transformative power of blockchain technology, Chase The Moonlite provides a seamless platform for musicians to navigate the evolving landscape of the music industry. It empowers artists by offering them a direct channel to sell their music as non-fungible tokens (NFTs), ensuring secure ownership and creating new avenues for artistic expression.</p>
            <p>At Chase The Moonlite, we understand the challenges that artists face in the modern music industry. Our mission is to simplify the process of monetizing musical creations by providing an easy and accessible platform. By leveraging the benefits of NFTs, artists can now tokenize their music and reach a global audience, breaking free from traditional barriers. With just a few clicks, musicians can list their NFTs, set their desired pricing, and connect with passionate collectors who value their artistry.</p>
            <p>One of the key advantages of Chase The Moonlite is its ability to nurture a vibrant community of artists and music enthusiasts. Through our platform, artists can forge meaningful connections with their audience, foster collaborations, and gain valuable feedback. We believe in the power of community engagement and aim to create an environment where artists thrive and fans discover exceptional musical experiences. Chase The Moonlite becomes a hub for discovery, where fans can explore diverse genres and support their favorite artists directly.</p>
            <p>Digital ownership is at the heart of Chase The Moonlite. By utilizing blockchain technology, we provide artists and collectors with the assurance of authenticity, transparency, and security. Artists can retain control over their music, ensuring fair compensation for their work, while collectors can confidently build their unique music collections. With Chase The Moonlite, the music NFT marketplace opens up a world of possibilities, empowering artists to embrace the digital revolution and find new pathways to success in the ever-evolving music industry.</p>
        </div>

    )
}

export default About;