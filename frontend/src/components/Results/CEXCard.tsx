"use client";

import Image from "next/image";
import OpenLinkSVG from "./OpenLinkSVG";
import { CEX } from "@/model/CEXList";
import styles from "./Results.module.css";
import DisplayPrice from "./DisplayPrice";

interface CEXCardProps {
    cex: CEX;
    outputToken: string,
    feeCurrency: string;
    isSelling: boolean;
}

export type Tokens = {
    [token: string]: string;
}

export default function CEXCard(props: CEXCardProps) {
    const { cex, outputToken,  feeCurrency, isSelling } = props;
    
    const loaded = (typeof cex.price === 'number')
    const cardClass = loaded ? styles["cex-card"] + " " + styles["cex-card-loaded"] : styles["cex-card"];

    const borderColor = (cex.borderColor != "") ? cex.borderColor : cex.brandColor;
    const hoverColor = (cex.textColor == "white") ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    let withdrawFee;
    if (isSelling) { 
        withdrawFee = cex.withdrawFees?.tokenA 
    }
    else { 
        withdrawFee = cex.withdrawFees?.tokenB
    }

    const cssVariables = {
        '--brand-color': cex.brandColor,
        '--cex-border': "1.5px solid " + borderColor,
        '--hover-color': hoverColor
    } as React.CSSProperties;

    return (
        <div className={cardClass} style={cssVariables}>
            <div className={styles["cex-logo-wrapper"] + " " + styles["grid-item"]}>
                <Image 
                    className={styles["cex-logo"]}
                    src={cex.logoSrc}
                    alt={cex.name}
                    width={0}
                    height={0}
                    style={{ width: "auto", height: "100%"}}
                />
            </div>

            <div className={styles["grid-item"]}>
                <DisplayPrice price={cex.price} outputToken={outputToken} isSelling={isSelling} feeCurrency={feeCurrency} withdrawFee={withdrawFee} textColor={cex.textColor}/>
            </div>

            <OpenLinkSVG textColor={cex.textColor} loaded={loaded}/>
        </div>
    )
}