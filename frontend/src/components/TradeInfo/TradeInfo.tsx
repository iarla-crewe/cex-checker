"use client";

import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import BuySellButton from "./BuySellButton";
import styles from "./TradeInfo.module.css";
import SwapCurrencyButton from "./SwapCurrencyButton";
import { useState } from "react";
import { UpdatePriceQuery } from "@/model/API";
import { usePostHog } from 'posthog-js/react'

interface TradeInfoProps {
    defaultInputToken: string,
    defaultOutputToken: string,
    defaultAmount: number,
    defaultIsSelling: boolean,
    handleUpdate: (data: UpdatePriceQuery) => void;
    handleSetIsSelling: (value: boolean) => void;
}

export default function TradeInfo(props: TradeInfoProps) {
    const { defaultInputToken, defaultOutputToken, defaultAmount, defaultIsSelling, handleUpdate, handleSetIsSelling } = props;

    const [isSelling, setIsSelling] = useState(defaultIsSelling);
    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    const posthog = usePostHog()

    const swapBuySell = () => {
        setIsSelling(!isSelling);
        handleSetIsSelling(!isSelling);
        posthog?.capture('Clicked buy/sell button', { isSelling: isSelling })
    }

    const handleInputToken = (value: string) => {
        if (value === outputToken) {
            handleSwap();
            return;
        }

        setInputToken(value);
        handleUpdate({inputToken: value});
        posthog?.capture('Choose new token', { tokenA: inputToken, tokenB: outputToken })
    }

    const handleOutputToken = (value: string) => {
        if (value === inputToken) {
            handleSwap();
            return;
        }

        setOutputToken(value);
        handleUpdate({outputToken: value});
        posthog?.capture('Choose new token', { tokenA: inputToken, tokenB: outputToken })
    }

    const handleSwap = () => {
        const valueInput = outputToken;
        const valueOutput = inputToken;
        
        setInputToken(valueInput);
        setOutputToken(valueOutput);
        handleUpdate({inputToken: valueInput, outputToken: valueOutput});
        posthog?.capture('Choose new token', { tokenA: inputToken, tokenB: outputToken })
    }

    const handleAmount = (amount: number) => {
        handleUpdate({amount: amount})
        posthog?.capture('Changed Amount', { amount: amount })
    };

    const text = (isSelling) ? "for" : "with";

    return (
        <div className={styles["trade-info"]}>
            <BuySellButton isSelling={isSelling} onClickHandler={swapBuySell}/>

            <InputAmount defaultValue={defaultAmount} updateAmount={handleAmount}/>

            <div className={styles["currencies"]}>
                <SelectCurrency defaultValue={inputToken} onClickHandler={handleInputToken}/>

                <p className={styles["currencies-text"]}>{text}</p>
                
                <SelectCurrency defaultValue={outputToken} onClickHandler={handleOutputToken}/>

                <SwapCurrencyButton onClickHandler={handleSwap}/>
            </div>
        </div>
    );
}
