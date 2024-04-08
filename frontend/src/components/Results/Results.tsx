import { CEX, CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCard from "./CEXCard";
import { PriceData } from "@/model/API";

function generateCEX(cex: CEX, index: number, priceData: PriceData) {
    let price = priceData[cex.name];
    if (price == "") price = "0.00";

    return (
        <CEXCard index={index} cex={cex} price={price} />
    )
}

interface ResultsProps {
    priceData: PriceData
}

export default function Results(props: ResultsProps) {
    const { priceData } = props;

    return (
        <ul className={styles["cex-list"]}>
            {CEXList.map((cex, index) => generateCEX(cex, index, priceData))}
        </ul>
    );
}
