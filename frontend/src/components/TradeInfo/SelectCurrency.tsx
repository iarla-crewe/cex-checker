import styles from "./TradeInfo.module.css"
import Image from "next/image";

interface SelectCurrencyProps {
    defaultValue: string;
    onClickHandler: () => void;
}

export default function SelectCurrency(props: SelectCurrencyProps) {
    const { defaultValue, onClickHandler } = props;

    return (
        <button className={styles["select-currency"]} onClick={onClickHandler}>
            <p>{defaultValue}</p>
            <Image 
                src="/down_arrow.svg"
                alt="Select"
                width={12}
                height={12}
            />
        </button>
    )
}