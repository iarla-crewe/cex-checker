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
    includeWithdrawFees: boolean;
    arbitrageView: boolean;
}

export type Tokens = {
    [token: string]: string;
}

export default function CEXCard(props: CEXCardProps) {
    const { cex, outputToken,  feeCurrency, isSelling, includeWithdrawFees, arbitrageView } = props;
    
    const loaded = (typeof cex.price === 'number')
    

    const borderColor = (cex.borderColor != "") ? cex.borderColor : cex.brandColor;
    const hoverColor = (cex.textColor == "white") ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    const withdrawFee = isSelling ? cex.withdrawFees?.tokenA : cex.withdrawFees?.tokenB;

    const cssVariables = {
        '--brand-color': cex.brandColor,
        '--cex-border': "1.5px solid " + borderColor,
        '--hover-color': hoverColor
    } as React.CSSProperties;

    const classGridItem = arbitrageView ? "grid-item-arb" : "grid-item";
    const classCexLogoWrapper = arbitrageView ? "cex-logo-wrapper-arb" : "cex-logo-wrapper";
    const classCardResponsive = arbitrageView ? "cex-card-responsive-arb" : "cex-card-responsive";
    const classCard = 
        loaded 
        ? styles["cex-card"] + " " + styles[classCardResponsive] + " " + styles["cex-card-loaded"] 
        : styles["cex-card"] + " " + styles[classCardResponsive];

    return (
        <div className={classCard} style={cssVariables}>
            <div className={styles[classCexLogoWrapper] + " " + styles[classGridItem]}>
                <Image 
                    className={styles["cex-logo"]}
                    src={cex.logoSrc}
                    alt={cex.name}
                    width={0}
                    height={0}
                    style={{ width: "auto", height: "100%"}}
                />
            </div>

            <div className={styles[classGridItem]}>
                <DisplayPrice 
                    price={cex.price} 
                    outputToken={outputToken} 
                    isSelling={isSelling} 
                    feeCurrency={feeCurrency} 
                    withdrawFee={withdrawFee} 
                    textColor={cex.textColor}
                    includeWithdrawFees={includeWithdrawFees}
                />
            </div>

            <OpenLinkSVG textColor={cex.textColor} loaded={loaded} arbitrageView={arbitrageView}/>
        </div>
    )
}