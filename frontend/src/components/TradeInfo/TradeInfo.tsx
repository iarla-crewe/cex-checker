"use client";

import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import BuySellButton from "./BuySellButton";
import styles from "./TradeInfo.module.css";
import SwapCurrencyButton from "./SwapCurrencyButton";
import { useState } from "react";
import { QueryUpdateData } from "@/model/API";

interface TradeInfoProps {
    defaultInputToken: string,
    defaultOutputToken: string,
    defaultAmount: number,
    handleUpdate: (data: QueryUpdateData) => void;
}

export default function TradeInfo(props: TradeInfoProps) {
    const { defaultInputToken, defaultOutputToken, defaultAmount, handleUpdate } = props;

    const [isBuying, setIsBuying] = useState(false);
    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    
    const handleBuySell = () => setIsBuying(!isBuying); // TODO - actually change the query

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

    const text = (isBuying) ? "with" : "for";

    return (
        <div className={styles["trade-info"]}>
            <BuySellButton isBuying={isBuying} onClickHandler={handleBuySell}/>
            <InputAmount defaultValue={defaultAmount} updateAmount={handleAmount}/>
            <SelectCurrency defaultValue={inputToken} onClickHandler={handleInputToken}/>
            <p>{text}</p>
            <SelectCurrency defaultValue={outputToken} onClickHandler={handleOutputToken}/>
            <SwapCurrencyButton onClickHandler={handleSwap}/>
        </div>
    );
}
