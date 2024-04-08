import { CEX, CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCard from "./CEXCard";
import { PriceData } from "@/model/API";

interface ResultsProps {
    priceData: PriceData;
    sortHighLow: boolean;
}

export default function Results(props: ResultsProps) {
    const { priceData, sortHighLow } = props;

    let pricedCEXList = CEXList.map((cex) => {
        let price = priceData[cex.name];
        return {...cex, price};
    })

    pricedCEXList.sort((a, b) => sortCEXList(a, b, sortHighLow));

    return (
        <ul className={styles["cex-list"]}>
            {pricedCEXList.map((cex, index) => (
                <CEXCard index={index} cex={cex}/>
            ))}
        </ul>
    );
}

function sortCEXList(a: CEX, b: CEX, sortHighLow: boolean): number {
    if (a.price == undefined && b.price == undefined) {
        return 0; // Both are loading, maintain original order
    } else if (a.price == undefined) {
        return 1; // A is loading, place last
    } else if (b.price == undefined) {
        return -1; // B is loading, place first
    } else {
        // Sort all loaded values
        if (sortHighLow) {
            return parseFloat(b.price) - parseFloat(a.price);
        } else {
            return parseFloat(a.price) - parseFloat(b.price);
        }
    }
}
