import styles from "./Sidebar.module.scss";
import React, { useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import Image from "next/image";
//import { Link } from 'react-router-dom';

interface Props {
    isSidebarOpen: boolean;
    isDarkMode: boolean;
}
const CTMSidebar = ({ isDarkMode, isSidebarOpen }: Props) => {
    type Theme = 'light' | 'dark';
    useEffect(() => {
        isDarkMode ? setTheme("dark") : setTheme("light")
    }, [isDarkMode])

    const [theme, setTheme] = React.useState<Theme>('light');
    const themes = {
        light: {
            sidebar: {
                backgroundColor: '#ffffff',
                color: '#607489',
            },
            menu: {
                menuContent: '#fbfcfd',
                icon: '#0098e5',
                hover: {
                    backgroundColor: '#c5e4ff',
                    color: '#44596e',
                },
                disabled: {
                    color: '#9fb6cf',
                },
            },
        },
        dark: {
            sidebar: {
                backgroundColor: '#272845',
                color: '#F0E3E3',
            },
            menu: {
                menuContent: '#082440',
                icon: '#59d0ff',
                hover: {
                    backgroundColor: '#00458b',
                    color: '#b6c8d9',
                },
                disabled: {
                    color: '#3e5e7e',
                },
            },
        },
    };
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const menuItemStyles: MenuItemStyles = {
        root: {
            fontSize: '15px',
            fontWeight: 500,
        },
        icon: {
            color: themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
        subMenuContent: ({ level }: any) => ({
            backgroundColor:
                level === 0
                    ? hexToRgba(themes[theme].menu.menuContent, 1)
                    : 'transparent',
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            '&:hover': {
                backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
                color: themes[theme].menu.hover.color,
            },
        },
        label: ({ open }) => ({
            fontWeight: open ? 600 : undefined,
            paddingInline: '10px'
        }),
    };
    return (
        <Sidebar style={{ border: 'none', height: '100vh', position: 'fixed', display: isSidebarOpen ? 'block' : 'none' }}
            rootStyles={{
                color: themes[theme].sidebar.color,
            }}
            backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}>
            <div>
                <Image alt="" height={250} width={250} src="/logo.svg" className="logo" />
            </div>
            <Menu menuItemStyles={menuItemStyles}>
                {/*<div style={{ padding: '0 24px', marginBottom: '8px', }}>
                    <p style={{ letterSpacing: '0.5px', fontWeight: 600 }}>
                        General
                    </p>
                </div>*/}
                <Link href="/"><MenuItem>Home</MenuItem></Link>
                <Link href="/ranking"><MenuItem> Ranking </MenuItem></Link>
                <SubMenu label="Profile">
                    <MenuItem> Pie charts </MenuItem>
                    <MenuItem> Line charts </MenuItem>
                </SubMenu>
                <SubMenu label="Wallet">
                    <MenuItem style={{ marginBlock: '20px', padding: 5 }}><ConnectWallet /></MenuItem>
                    <MenuItem>Create wallet</MenuItem>
                </SubMenu>
                <MenuItem> Mint NFT </MenuItem>
                <MenuItem> Browse Charts </MenuItem>
                <MenuItem>Messages</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Help</MenuItem>
                <MenuItem>About</MenuItem>
            </Menu>
            {/*<button onClick={() => setTheme(theme === "light" ? 'dark' : 'light')}
                style={{ margin: 50, height: 60, borderRadius: 50, border: 'none' }}
            >Change to {theme === "light" ? 'dark' : 'light'}</button>*/}
        </Sidebar>
    )
}
export default CTMSidebar;