import React from "react";
import styles from "./Results.module.css";

interface DisplayPriceProps {
    price: number | undefined;
    currency: string;
    withdrawFee: string;
    textColor: string;
}

export default function DisplayPrice(props: DisplayPriceProps) {
    const { price, currency, withdrawFee, textColor } = props;

    if(price != undefined) {
        return (
            <div className={styles["price-info"]} style={{color: textColor}}>
                <p className={styles["price-heading"]}>Expected {currency}</p>
                <p className={styles["price-subheading"]}>(after maker/taker fees)</p>
                <p className={styles["price"]}>
                    {price}
                </p>
                <p className={styles["price-withdrawal"]}>+{withdrawFee} withdraw fee</p>
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