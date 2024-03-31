import Image from "next/image";
import styles from "./TradeInfo.module.css";

export default function SwapCurrencyButton() {
    return (
        <button className={styles["swap-currency-button"]}>
            <Image 
                src="/swap_icon.svg"
                alt="Swap currency"
                width={17}
                height={17}
                style={{fill: "white"}}
            />
        </button>
    )
}