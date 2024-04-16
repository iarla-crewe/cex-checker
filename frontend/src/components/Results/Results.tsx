import { CEX, CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCardWrapper from "./CEXCardWrapper";
import { PriceData } from "@/model/API";
import { Filter } from "@/model/FIlter";

interface ResultsProps {
    priceData: PriceData;
    currency: string;
    sortHighLow: boolean;
    filter: Filter;
}

export default function Results(props: ResultsProps) {
    const { priceData, currency, sortHighLow, filter } = props;

    let filteredCEXList = CEXList.filter(cex => filter[cex.name] === true)
    console.log("price data: ", priceData)

    let pricedCEXList = filteredCEXList.map((cex) => {
        console.log("cex name: ", cex.name)
        let price = '';
        try {
            price = priceData[cex.name];
        } catch (error) {
            console.log("Parsing price data error: ", error)
        }   
        return {...cex, price};
    });

    pricedCEXList.sort((a, b) => sortCEXList(a, b, sortHighLow));

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
        if (sortHighLow) {
            return parseFloat(b.price) - parseFloat(a.price);
        } else {
            return parseFloat(a.price) - parseFloat(b.price);
        }
    }
}
