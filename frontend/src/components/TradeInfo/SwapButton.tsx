import styles from "./SwapButton.module.css";
import Image from "next/image";

export default function SwapButton() {
    return (
        <button className={styles["swap-button"]}>
            <p>Buy</p>
            <Image 
                src="/swap_icon.svg"
                alt="Swap"
                width={12}
                height={15}
            />
        </button>
    );
}