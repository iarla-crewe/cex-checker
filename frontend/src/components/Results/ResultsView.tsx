import { ResponseData } from "@/model/API";
import Results from "./Results";
import { FilterObj } from "@/model/FilterData";
import { TokenPair } from "@/lib/utils";
import styles from "./Results.module.css";

export interface ResultsViewProps {
    responseData: ResponseData;
    outputToken: string;
    feeCurrency: string;
    isSelling: boolean;
    filter: FilterObj;
    tokenPair: TokenPair;
    includeWithdrawFees: boolean;
    arbitrageView: boolean;
}

export default function ResultsView(props : ResultsViewProps) {
    const { responseData, outputToken, feeCurrency, isSelling, filter, tokenPair, includeWithdrawFees, arbitrageView } = props;

    if (!arbitrageView) {
        return (
            <Results
                prices={responseData.prices}
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

    // Arbitrage prices should be set if viewing arbitrage, but duplicate results if not
    if (!responseData.arbitrageSellPrices) responseData.arbitrageSellPrices = responseData.prices;
    
    return (
        <div className={styles["arbitrage-view"]}>
            <div className={styles["arbitrage-column"]}>
                <h3>Buy</h3>
                <Results
                    prices={responseData.prices}
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
                    prices={responseData.arbitrageSellPrices}
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