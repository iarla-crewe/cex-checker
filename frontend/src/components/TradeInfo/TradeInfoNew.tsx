import { UpdatePriceQuery } from "@/model/API";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import styles from "./TradeInfo.module.css";
import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";

interface TradeInfoProps {
    defaultInputToken: string,
    defaultOutputToken: string,
    defaultAmount: number,
    defaultIsSelling: boolean,
    handleUpdate: (data: UpdatePriceQuery) => void;
    handleSetIsSelling: (value: boolean) => void;
    arbitrageView: boolean;
}

export default function TradeInfo(props: TradeInfoProps) {
    const { defaultInputToken, defaultOutputToken, defaultAmount, defaultIsSelling, handleUpdate, handleSetIsSelling, arbitrageView } = props;

    const [isSelling, setIsSelling] = useState(defaultIsSelling);
    const [inputToken, setInputToken] = useState(defaultInputToken);
    const [outputToken, setOutputToken] = useState(defaultOutputToken);
    const posthog = usePostHog();

    const handleIsSelling = (value: boolean) => {
        setIsSelling(value);
        handleSetIsSelling(value);
        posthog?.capture('Clicked buy/sell button', { isSelling: value });
    }

    const handleInputToken = (value: string) => {
        if (value === outputToken) {
            handleSwapTokens();
            return;
        }

        setInputToken(value);
        handleUpdate({inputToken: value});
        posthog?.capture('Choose new token', { tokenA: inputToken, tokenB: outputToken })
    }

    const handleOutputToken = (value: string) => {
        if (value === inputToken) {
            handleSwapTokens();
            return;
        }

        setOutputToken(value);
        handleUpdate({outputToken: value});
        posthog?.capture('Choose new token', { tokenA: inputToken, tokenB: outputToken })
    }

    const handleSwapTokens = () => {
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
        <div className={styles["main-panel"]}>
            <div className={styles["buy-sell-select"]}>
                <button 
                    onClick={() => handleIsSelling(false)}
                    className={`${styles["panel-button"]} ${!isSelling ? styles["active"] : styles["inactive"]}`}
                >
                    <p>Buy</p>
                </button>
                <button 
                    onClick={() => handleIsSelling(true)}
                    className={`${styles["panel-button"]} ${isSelling ? styles["active"] : styles["inactive"]}`}
                >
                    <p>Sell</p>
                </button>
            </div>

            <InputAmount defaultValue={defaultAmount} updateAmount={handleAmount}/>

            <div className={styles["currencies"]}>
                <SelectCurrency defaultValue={inputToken} onClickHandler={handleInputToken}/>

                <p className={styles["currencies-text"]}>{text}</p>
                
                <SelectCurrency defaultValue={outputToken} onClickHandler={handleOutputToken}/>
            </div>
        </div>
    )
}