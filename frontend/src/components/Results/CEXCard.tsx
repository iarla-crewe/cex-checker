"use client";

import Image from "next/image";
import OpenLinkSVG from "./OpenLinkSVG";
import { CEX } from "@/model/CEXList";
import styles from "./Results.module.css";
import { useState } from "react";
import DisplayPrice from "./DisplayPrice";

interface CEXCardProps {
    index: number;
    cex: CEX;
}

export default function CEXCard(props: CEXCardProps) {
    const { index, cex } = props;

    const borderColor = (cex.borderColor != "") ? cex.borderColor : cex.brandColor;
    const border = "1.5px solid " + borderColor;

    return (
        <li key={index}>
            <a href={cex.website} target="_blank">
                <div className={styles["cex-card"]} style={{backgroundColor: cex.brandColor, border: border}}>
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

                    <DisplayPrice price={cex.price} textColor={cex.textColor}/>

                    <OpenLinkSVG textColor={cex.textColor} link={cex.website}/>
                </div>
            </a>
        </li>
    )
}