import Image from "next/image";
import styles from "./TradeInfo.module.css";

interface SwapCurrencyButtonProps {
    onClickHandler: () => void;
}

export default function SwapCurrencyButton(props: SwapCurrencyButtonProps) {
    const { onClickHandler } = props;

    return (
        <button className={styles["swap-currency-button"]} onClick={onClickHandler}>
            <Image 
                src="/swap_icon.svg"
                alt="Swap currency"
                width={17}
                height={17}
                style={{fill: "white"}}
                className={styles["swap-currency-icon"]}
            />
        </button>
    )
}