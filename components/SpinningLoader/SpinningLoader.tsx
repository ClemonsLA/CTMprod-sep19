import { Oval } from "react-loader-spinner";

const SpinningLoader = () => {
    return (
        <>
            <Oval
                height={80}
                width={80}
                color="#1e3799"
                wrapperStyle={{ width: '95%', height: '100vh', disple: "flex", justifyContent: "center", alignItems: "center" }}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#4a69bd"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </>
    )
}
export default SpinningLoader;