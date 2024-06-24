import { ResponseData } from "@/model/API";
import Results, { ResultsProps } from "./Results";
import { FilterObj } from "@/model/FilterData";
import { TokenPair } from "@/lib/utils";
import styles from "./Results.module.css";

export default function ResultsView(props : ResultsProps) {
    const { responseData, outputToken, feeCurrency, isSelling, filter, tokenPair, includeWithdrawFees, arbitrageView } = props;

    if (!arbitrageView) {
        return (
            <Results
                responseData={responseData}
                outputToken={outputToken}
                feeCurrency={feeCurrency}
                isSelling={isSelling}
                filter={filter}
                tokenPair={tokenPair}
                includeWithdrawFees={includeWithdrawFees}
                arbitrageView={arbitrageView}
            />
        )
    }

    return (
        <div className={styles["arbitrage-view"]}>
            <div className={styles["arbitrage-column"]}>
                <h3>Buy</h3>
                <Results
                    responseData={responseData}
                    outputToken={outputToken}
                    feeCurrency={feeCurrency}
                    isSelling={false}
                    filter={filter}
                    tokenPair={tokenPair}
                    includeWithdrawFees={includeWithdrawFees}
                    arbitrageView={arbitrageView}
                />
            </div>
            

            <div className={styles["arbitrage-column"]}>
                <h3>Sell</h3>
                <Results
                    responseData={responseData}
                    outputToken={outputToken}
                    feeCurrency={feeCurrency}
                    isSelling={true}
                    filter={filter}
                    tokenPair={tokenPair}
                    includeWithdrawFees={includeWithdrawFees}
                    arbitrageView={arbitrageView}
                />
            </div>
        </div>
    )
}