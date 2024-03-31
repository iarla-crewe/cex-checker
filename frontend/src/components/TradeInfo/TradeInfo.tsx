import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import BuySellButton from "./BuySellButton";
import styles from "./TradeInfo.module.css";
import SwapCurrencyButton from "./SwapCurrencyButton";

export default function TradeInfo() {
    let isBuying = false;

    const text = (isBuying) ? "with" : "for";

    return (
        <div className={styles["trade-info"]}>
            <BuySellButton isBuying={isBuying}/>
            <InputAmount/>
            <SelectCurrency defaultValue="USDC"/>
            <p>{text}</p>
            <SelectCurrency defaultValue="SOL"/>
            <SwapCurrencyButton/>
        </div>
    );
}
