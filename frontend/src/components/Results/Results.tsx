import { CEX, CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCardWrapper from "./CEXCardWrapper";
import { PairStatus, ResponseData } from "@/model/API";
import { Filter } from "@/model/FIlter";

interface ResultsProps {
    responseData: ResponseData;
    currency: string;
    isSelling: boolean;
    filter: Filter;
}

export default function Results(props: ResultsProps) {
    const { responseData, currency, isSelling, filter } = props;

    let filteredCEXList = CEXList.filter(cex => filter[cex.name] === true);

    let pricedCEXList = filteredCEXList.map((cex) => {
        let price: number | PairStatus = PairStatus.Loading;
        //if (responseData !== undefined) price = responseData[cex.name];
        price = responseData[cex.name];
        return { ...cex, price };
    });

    pricedCEXList.sort((a, b) => sortCEXList(a, b, isSelling));

    return (
        <ul className={styles["cex-list"]}>
            {pricedCEXList.map((cex, index) => (
                <li key={index}>
                    <CEXCardWrapper cex={cex} currency={currency}/>
                </li>
            ))}
        </ul>
    );
}

function sortCEXList(a: CEX, b: CEX, sortHighLow: boolean): number {
    if (a.price === PairStatus.Loading && b.price === PairStatus.Loading) {
        return 0; // Both are loading, maintain original order
    }
    if (a.price === PairStatus.NoPairFound && b.price === PairStatus.NoPairFound) {
        return 0; // Both are not found, maintain original order
    }
    if (a.price === PairStatus.Loading && b.price === PairStatus.NoPairFound) {
        return -1; // A is loading, place first
    }
    if (a.price === PairStatus.NoPairFound && b.price === PairStatus.Loading) {
        return 1; // B is loading, place first
    }
    if (a.price === PairStatus.Loading || a.price === PairStatus.NoPairFound) {
        return 1; // A is loading or not found, place last
    }
    if (b.price === PairStatus.Loading || b.price === PairStatus.NoPairFound) {
        return -1; // B is loading or not found, place first
    }

    // Sort all loaded values
    return sortHighLow ? b.price - a.price : a.price - b.price;
}