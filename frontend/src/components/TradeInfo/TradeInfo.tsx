import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import SwapButton from "./SwapButton";
import styles from "./TradeInfo.module.css";

export default function TradeInfo() {
    let isBuying

    return (
        <div className={styles["trade-info"]}>
            <SwapButton/>
            <InputAmount/>
            <SelectCurrency defaultValue="USDC"/>
            <p>with</p>
            <SelectCurrency defaultValue="SOL"/>
        </div>
    );
}
