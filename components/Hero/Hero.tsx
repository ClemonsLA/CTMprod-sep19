import { SetStateAction, Dispatch, useRef, useEffect, useState, MutableRefObject, useContext } from "react";
import styles from "./Hero.module.scss";
import { Magic } from "magic-sdk"
import Link from "next/link";
import Image from "next/image";
import LoginButton from "../LoginButton/LoginButton";
import axios from "axios"
import { UserMetadata } from "../../types/user.types";
import { useRouter } from "next/router";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { clearUser } from "../../services/user-services";
import { UserContext } from "../../context/context";

interface Props {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isDarkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  bodyRef: MutableRefObject<any>;
}

const Hero = (props: Props) => {
  const router = useRouter();
  const [magicX, setMagicX] = useState<any>();
  const [userRole, setUserRole] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState("");
  //@ts-ignore
  const { user, setUser, magic, setMagic } = useContext(UserContext)
  const customNodeOptions = {
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/', // Polygon RPC URL
    chainId: 80001, // Polygon chain id
}
  useEffect(() => {
    axios.defaults.withCredentials = true
    const newMagic = new Magic('pk_live_5062FA15878DC2A2', {
      network: customNodeOptions, // Ethereum testnet
    });
    setMagicX(newMagic);
    setMagic(newMagic)
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user')
    const wallet = localStorage.getItem('wallet_address')
    const role = localStorage.getItem('role')
    role === null || role === undefined ? setUserRole(0) : setUserRole(parseInt(role))
    if (wallet !== null && user !== null && token !== null) {
      setUser(user);
    } else {
      setUser(null)
    }
  }, [])
  const logout = async () => {
    try {
      router.push("/");
      props.setLoading(true)
      const user = localStorage.getItem('user')
      console.log('user', user)
      const parsedUser = JSON.parse(user!)
      const token = localStorage.getItem('auth_token');
      console.log(token)
      clearUser(setUser);
      setUser(null);
      const res = await axios.post(`${process.env.API_URL}/user/logout`)//, {}, config )
      console.log(res)
      await magicX.user.logout()
      await magicX.wallet.disconnect(); // Logout from frontend magic to get a login prompt
      console.log("Logged out successfuly")
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message)
      setTimeout(() => { setErrorMessage("") }, 2000)
    } finally {
      props.setLoading(false)
    }
  }

  const showProfile = () => {
    router.push({ pathname: '/my-profile' });
  }
  const login = async () => {
    try {
      props.setLoading(true)
      const accounts = await magicX.wallet.connectWithUI();
      //console.log(email)
      //console.log(accounts)
      //console.log(process.env.API_URL)
      const metadata = await magicX.user.getMetadata()
      //console.log(metadata)
      const generatedName = metadata.email.split("@")[0]
      const userInfo: UserMetadata = {
        issuer: metadata.issuer,
        name: generatedName,
        description: "I'm honorable user of Chase The Moonlite marketplace :)",
        tag: 1,
        walletAddress: metadata.publicAddress,
        walletType: metadata.walletType,
        email: metadata.email,
        website: " ",
      }
      localStorage.setItem('wallet_address', metadata.publicAddress)
      //console.log(userInfo)
      const res = await axios.post(`${process.env.API_URL}/user/signup`, userInfo)
      //console.log(res)
      const authToken = await magicX.auth.loginWithMagicLink({ email: metadata.email});
      localStorage.setItem('auth_token', authToken);
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } }
      const loginRes = await axios.post(`${process.env.API_URL}/user/login`, {}, config)
      //console.log(loginRes)
      //console.log(JSON.stringify(res.data))
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('role', res.data.role)
      setUserRole(res.data.role)
      setUser(res.data);
    } catch (error: any) {
      console.error(error)
      if (error.response.status === 403) { // If email/name/wallet exists
        await magicX.user.logout()
        await magicX.wallet.disconnect();
      }
      setErrorMessage(error.message)
      setTimeout(() => { setErrorMessage("") }, 2000)
    } finally {
      props.setLoading(false)
    }
  }
  const dropdownMenuRef = useRef<any>();
  const hideMenu = () => {
    props.setSidebarOpen(props.isSidebarOpen ? false : true)
    //console.log(props);
  }

  const DropDownItem = ({ name, img, callback }: { img: string, name: string, callback: () => void }) => {
    return (
      <li className="dropdownItem" onClick={callback}>
        <Image alt="" width={26} height={26} className={styles.dropdownIcon} src={`/${img}`} />
        <a>{name}</a>
      </li>
    )
  }

  const toggleDropdown = () => {
    if (dropdownMenuRef.current) {
      if (dropdownMenuRef.current.style.display === "" || dropdownMenuRef.current.style.display === undefined) {
        dropdownMenuRef.current.style.display = "block"
      } else {
        dropdownMenuRef.current.style.display == "none" ?
          dropdownMenuRef.current.style.display = "block" :
          dropdownMenuRef.current.style.display = "none"
      }
    }
  }

  const handleDarkMode = () => {
    if (props.isDarkMode) {
      props.setDarkMode(false)
      props.bodyRef.current.classList.add("dark")
      props.bodyRef.current.classList.remove("light")
    } else {
      props.setDarkMode(true)
      props.bodyRef.current.classList.remove("dark")
      props.bodyRef.current.classList.add("light")
    }
  }


  return (
    <div className={styles.Hero}>
      {errorMessage !== "" ? <ErrorMessage message={errorMessage} /> : null}
      <Link href="/"><Image width={108} height={121} className={styles.logo} alt="" src="/logo.png" onClick={() => hideMenu()} /></Link>
      <Image width={32} height={32} className={styles.bars} alt="" src="/bars.svg" />
      <div className={styles.expandedMenu}>
        <ul className={styles.navLinks}>
          <Link className={styles.hot} href="/out-now">Hot</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/browse-charts">Browse Charts</Link>
          <Link href="/upload-your-song">Mint NFT</Link>
          <Link href="/help">Help</Link>
          <Link href="/about">About</Link>
        </ul>
        {/*<Image width={32} height={32} alt="" src={!props.isDarkMode ? "/sunW.svg" : "/moonW.svg"} className={styles.darkMode} onClick={() => handleDarkMode()} />*/}
        {user ?
          <div style={{ zIndex: 35 }}>
            <Image width={32} height={32} alt="" src="/userW.svg" className={styles.rightDiv} onClick={toggleDropdown} />
            <ul ref={dropdownMenuRef} className={styles.dropdownMenu}>
              <DropDownItem name={"Profile"} img={"user.svg"} callback={showProfile} />
              {<DropDownItem name={"Wallet"} img={"wallet.svg"} callback={() => router.push("/wallet")} />}
              {userRole > 1 ? <DropDownItem name={"Admin Panel"} img={"admin.svg"} callback={() => router.push("/admin-panel")} />: null}
              {userRole > 1 ? null :<DropDownItem name={"Revenue"} img={"revenue.svg"} callback={() => router.push("/revenue")} />}
              <DropDownItem name={"Logout"} img={"logout.svg"} callback={logout} />
            </ul>
          </div>
          :
          <LoginButton width={60} height={20} margin={20} text={"Login/Sign"} callback={login} />
        }
      </div>

    </div>
  )
}
export default Hero;