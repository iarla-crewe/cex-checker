"use client";

import Image from "next/image";
import OpenLinkSVG from "./OpenLinkSVG";
import { CEX } from "@/model/CEXList";
import styles from "./Results.module.css";
import { useState } from "react";
import DisplayPrice from "./DisplayPrice";

interface CEXCardProps {
    cex: CEX;
    currency: string;
}

export default function CEXCard(props: CEXCardProps) {
    const { cex, currency } = props;

    const borderColor = (cex.borderColor != "") ? cex.borderColor : cex.brandColor;
    const hoverColor = (cex.textColor == "white") ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    const cssVariables = {
        '--brand-color': cex.brandColor,
        '--cex-border': "1.5px solid " + borderColor,
        '--hover-color': hoverColor
    } as React.CSSProperties;

    return (
        <div className={styles["cex-card"]} style={cssVariables}>
            <div className={styles["cex-logo-wrapper"]}>
                <Image 
                    className={styles["cex-logo"]}
                    src={cex.logoSrc}
                    alt={cex.name}
                    width={0}
                    height={0}
                    style={{ width: "auto", height: "100%"}}
                />
            </div>

            <DisplayPrice price={cex.price} currency={currency} withdrawFee={cex.withdrawFee} textColor={cex.textColor}/>

            <OpenLinkSVG textColor={cex.textColor} loaded={(cex.price != undefined)}/>
        </div>
    )
}