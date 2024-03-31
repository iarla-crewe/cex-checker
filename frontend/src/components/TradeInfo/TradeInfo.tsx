"use client";

import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import BuySellButton from "./BuySellButton";
import styles from "./TradeInfo.module.css";
import SwapCurrencyButton from "./SwapCurrencyButton";
import { useState } from "react";

export default function TradeInfo() {
    const [isBuying, setIsBuying] = useState(false);
    const [amount, setAmount] = useState(0);
    const [currency1, setCurrency1] = useState("USDC");
    const [currency2, setCurrency2] = useState("SOL");
    
    const handleBuySell = () => {
        setIsBuying(!isBuying);
    }

    const handleCurrency1 = () => {
        setCurrency1("WIF");
    }

    const handleCurrency2 = () => {
        setCurrency2("WIF");
    }

    const handleSwap = () => {
        const tmp = currency1;
        setCurrency1(currency2);
        setCurrency2(tmp);
    }

    const text = (isBuying) ? "with" : "for";

    return (
        <div className={styles["trade-info"]}>
            <BuySellButton isBuying={isBuying} onClickHandler={handleBuySell}/>
            <InputAmount/>
            <SelectCurrency defaultValue={currency1} onClickHandler={handleCurrency1}/>
            <p>{text}</p>
            <SelectCurrency defaultValue={currency2} onClickHandler={handleCurrency2}/>
            <SwapCurrencyButton onClickHandler={handleSwap}/>
        </div>
    );
}
