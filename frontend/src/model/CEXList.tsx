import { TokenPair } from "@/lib/utils";
import { PairStatus } from "./API";

export interface CEX {
    name: string;
    displayName: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    borderColor: string;
    templateUrl: string;
    website?: string
    capStyle: string;
    withdrawFee?: number;
    price: number | PairStatus;
}

export const CEXList: CEX[] = [
    {
        name: "binance", 
        displayName: "Binance", 
        logoSrc: "/binance.svg", 
        brandColor: "#F1B90C", 
        textColor: "black", 
        borderColor: "", 
        templateUrl: "https://www.binance.com/en/trade/™_†?_from=markets&type=spot",
        capStyle: "UPPER",
        price: PairStatus.Loading
    },
    {
        name: "bybit", 
        displayName: "ByBit", 
        logoSrc: "/bybit.svg", 
        brandColor: "#17181e", 
        textColor: "white", 
        borderColor: "#f7a600", 
        templateUrl: "https://www.bybit.com/en/trade/spot/™/†",
        capStyle: "UPPER",
        price: PairStatus.Loading
    },
    {
        name: "coinbase", 
        displayName: "Coinbase", 
        logoSrc: "/coinbase.svg", 
        brandColor: "#004af7", 
        textColor: "white", 
        borderColor: "white", 
        templateUrl: "https://www.coinbase.com/advanced-trade/spot/™-†",
        capStyle: "UPPER",
        withdrawFee: 0,
        price: PairStatus.Loading
    },
    {
        name: "crypto_com", 
        displayName: "Crypto.com", 
        logoSrc: "/crypto_com.svg", 
        brandColor: "#032f69", 
        textColor: "white", 
        borderColor: "white", 
        templateUrl: "https://crypto.com/exchange/trade/™_†",
        capStyle: "UPPER",
        price: PairStatus.Loading
    },
    {
        name: "kraken", 
        displayName: "Kraken", 
        logoSrc: "/kraken.svg", 
        brandColor: "#7132F5", 
        textColor: "white", 
        borderColor: "white", 
        templateUrl: "https://pro.kraken.com/app/trade/™-†",
        capStyle: "LOWER",
        price: PairStatus.Loading,
    },
]


export function getCEXDisplayName(name: string) {
    // Returns input if no matching CEX found
    for (const cex of CEXList) {
        if (cex.name === name) return cex.displayName;
    }
    return name;
}


export function setFeeData(withdrawalFees: any, token: string) {
    const combinedWithdrawalFees = withdrawalFees.combinedWithdrawalFees;

    for (let cex of CEXList) {
        if (cex.withdrawFee === 0) continue;

        //@ts-ignore
        let matchingObject = combinedWithdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == token);
        if (matchingObject) {
            const roundedNumber = parseFloat(matchingObject.fee).toFixed(10)
            cex.withdrawFee = parseFloat(roundedNumber);
        }
    }
}

export function setExchangeLink(tokenPair: TokenPair, cex: CEX) {
    let link = cex.templateUrl
    let base = tokenPair.base
    let quote = tokenPair.quote

    if (cex.name === "coinbase") {
        if (tokenPair.base == "usdc") base = "usd"
        if (tokenPair.quote == "usdc") quote = "usd"
    }
 
    if (cex.capStyle === "UPPER") {
        link = link
            .replace("™", base.toUpperCase())
            .replace("†", quote.toUpperCase());
    }
    else if (cex.capStyle == "LOWER") {
        link = link
            .replace("™", base.toLowerCase())
            .replace("†", quote.toLowerCase());
    }
    cex.website = link;
}  