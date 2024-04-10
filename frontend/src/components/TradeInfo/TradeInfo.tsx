"use client";

import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import BuySellButton from "./BuySellButton";
import styles from "./TradeInfo.module.css";
import SwapCurrencyButton from "./SwapCurrencyButton";
import { useState } from "react";
import { UpdatePriceQuery } from "@/model/API";

interface TradeInfoProps {
    defaultInputToken: string,
    defaultOutputToken: string,
    defaultAmount: number,
    defaultIsBuying: boolean,
    handleUpdate: (data: UpdatePriceQuery) => void;
    setSortHighLow: (value: boolean) => void;
}

export default function TradeInfo(props: TradeInfoProps) {
    const { defaultInputToken, defaultOutputToken, defaultAmount, defaultIsBuying, handleUpdate, setSortHighLow } = props;

    const [isSelling, setIsSelling] = useState(defaultIsBuying);
    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    
    const swapBuySell = () => {
        setIsSelling(!isSelling);
        setSortHighLow(!isSelling);
    }

    const handleInputToken = () => {
        const value = "WIF";

        setInputToken(value);
        handleUpdate({inputToken: value});
    }

    const handleOutputToken = () => {
        const value = "WIF";

        setOutputToken(value);
        handleUpdate({outputToken: value});
    }

    const handleSwap = () => {
        const valueInput = outputToken;
        const valueOutput = inputToken;
        
        setInputToken(valueInput);
        setOutputToken(valueOutput);
        handleUpdate({inputToken: valueInput, outputToken: valueOutput});
    }

    const handleAmount = (amount: number) => {
        handleUpdate({amount: amount})
    }

    const text = (isSelling) ? "for" : "with";

    return (
        <div className={styles["trade-info"]}>
            <BuySellButton isSelling={isSelling} onClickHandler={swapBuySell}/>
            <InputAmount defaultValue={defaultAmount} updateAmount={handleAmount}/>
            <SelectCurrency defaultValue={inputToken} onClickHandler={handleInputToken}/>
            <p>{text}</p>
            <SelectCurrency defaultValue={outputToken} onClickHandler={handleOutputToken}/>
            <SwapCurrencyButton onClickHandler={handleSwap}/>
        </div>
    );
}
