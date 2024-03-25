import styles from "./SelectCurrency.module.css"
import Image from "next/image";

interface SelectCurrencyProps {
    defaultValue: string;
}

export default function SelectCurrency(props: SelectCurrencyProps) {
    const { defaultValue } = props;

    return (
        <button className={styles["select-currency"]}>
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