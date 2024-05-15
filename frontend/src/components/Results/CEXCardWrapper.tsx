"use client";

import Image from "next/image";
import OpenLinkSVG from "./OpenLinkSVG";
import { CEX } from "@/model/CEXList";
import styles from "./Results.module.css";
import { useState } from "react";
import DisplayPrice from "./DisplayPrice";
import CEXCard from "./CEXCard";

interface CEXCardWrapperProps {
    cex: CEX;
    currency: string;
}

export default function CEXCardWrapper(props: CEXCardWrapperProps) {
    const { cex, currency } = props;

    if (typeof cex.price === 'number') {
        return (
            <a href={cex.website} target="_blank">
                <CEXCard cex={cex} currency={currency}/>
            </a>
        )
    } else {
        return (
            <CEXCard cex={cex} currency={currency}/>
        )
    }
}