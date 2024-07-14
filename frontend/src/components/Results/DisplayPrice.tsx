import React from "react";
import styles from "./Results.module.css";
import { PairStatus } from "@/model/API";

interface DisplayPriceProps {
    price: number | PairStatus;
    outputToken: string;
    isSelling: boolean;
    feeCurrency: string;
    withdrawFee: number | undefined;
    textColor: string;
    includeWithdrawFees: boolean;
}

export default function DisplayPrice(props: DisplayPriceProps) {
    const { price, outputToken, isSelling, feeCurrency, withdrawFee, textColor, includeWithdrawFees } = props;

    let withdrawFeeText = "";
    if (includeWithdrawFees) {
        withdrawFeeText = "including withdrawal fee"
    } else {
        withdrawFeeText = (isSelling) ? "-" : "+";
        if (withdrawFee === 0) withdrawFeeText += ` network gas fee`;
        else if (withdrawFee === undefined) withdrawFeeText += ` withdrawal fee (loading...)`;
        else withdrawFeeText += `${withdrawFee} ${feeCurrency.toUpperCase()} withdrawal fee`;
    }

    let priceHeading = (isSelling) ? `${outputToken.toUpperCase()} received` : `Price in ${outputToken.toUpperCase()}`
    
    if (typeof price === 'number') {
        return (
            <div className={styles["price-info"]} style={{color: textColor}}>
                <p className={styles["price-heading"]}>{priceHeading}</p>
                <p className={styles["price-subheading"]}>(after maker/taker fees)</p>
                <p className={styles["price"]}>
                    {price}
                </p>
                <p className={styles["price-withdrawal"]}>{withdrawFeeText}</p>
            </div>
        );
    } 
    
    if (price == PairStatus.NoPairFound) {
        return (
            <div className={styles["price-info"]} style={{color: textColor}}>
                <p className={styles["token-pair-na"]}>This market is not available on this exchange</p>
            </div>
        );
    }

    return (
        <div className={styles["loading-spinner-wrapper"]} style={{color: textColor}}>
            <svg
                style={{width: '64px'}}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
            >
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    r="35"
                    strokeDasharray="164.93361431346415 56.97787143782138"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1.5s"
                        keyTimes="0;1"
                        values="0 50 50;360 50 50"
                    />
                </circle>
            </svg>
        </div>
    );
};
