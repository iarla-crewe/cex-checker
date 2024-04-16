import { CEX, CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCardWrapper from "./CEXCardWrapper";
import { ResponseData } from "@/model/API";
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
        let price = undefined;
        if (responseData !== undefined) price = responseData[cex.name];
        return {...cex, price};
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
    if (a.price == undefined && b.price == undefined) {
        return 0; // Both are loading, maintain original order
    } else if (a.price == undefined) {
        return 1; // A is loading, place last
    } else if (b.price == undefined) {
        return -1; // B is loading, place first
    } else {
        // Sort all loaded values
        if (sortHighLow) return b.price - a.price;
        else return a.price - b.price;
    }
}
