"use client";

import { CEX } from "@/model/CEXList";
import CEXCard, { Tokens } from "./CEXCard";
import { usePostHog } from 'posthog-js/react'

interface CEXCardWrapperProps {
    cex: CEX;
    outputToken: string;
    feeCurrency: string;
    isSelling: boolean;
}

export default function CEXCardWrapper(props: CEXCardWrapperProps) {
    const { cex, outputToken, feeCurrency, isSelling } = props;
    const posthog = usePostHog();

    const handleClick = () => {
        posthog.capture('Exchange clicked', {
            exchange: cex.name,
        });
    };

    if (typeof cex.price === 'number') {
        return (
            <a href={cex.website} target="_blank"  onClick={handleClick}>
                <CEXCard cex={cex} outputToken={outputToken} feeCurrency={feeCurrency} isSelling={isSelling}/>
            </a>
        )
    } else {
        return (
            <CEXCard cex={cex} outputToken={outputToken} feeCurrency={feeCurrency} isSelling={isSelling}/>
        )
    }
}