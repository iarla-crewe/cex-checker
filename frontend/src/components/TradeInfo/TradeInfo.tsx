import InputAmount from "./InputAmount";
import SelectCurrency from "./SelectCurrency";
import SwapButton from "./SwapButton";
import styles from "./TradeInfo.module.css";

export default function TradeInfo() {
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
