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
    withdrawFees?: WithdrawalFees;
    price: number | PairStatus;
}

type WithdrawalFees = {
    [token: string]: number | undefined;
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
        withdrawFees: {
            tokenA: 0,
            tokenB: 0
        },
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
    {
        name: "jupiter",
        displayName: "Jupiter",
        logoSrc: "/jupiter.svg",
        brandColor: "#131B24",
        textColor: "white",
        borderColor: "#C7F283",
        templateUrl: "https://jup.ag/swap/™-†",
        capStyle: "UPPER",
        price: PairStatus.Loading,
    },
    {
        name: "oneInch",
        displayName: "1inch",
        logoSrc: "/1inch.svg",
        brandColor: "#0B121E",
        textColor: "white",
        borderColor: "#2E8AF5",
        templateUrl: "https://app.1inch.io/#/42161/simple/swap/™/†",
        capStyle: "UPPER",
        price: PairStatus.Loading,
    },
    {
        name: "backpack",
        displayName: "Backpack",
        logoSrc: "/backpack.svg",
        brandColor: "#0E0F14",
        textColor: "white",
        borderColor: "#E33E40",
        templateUrl: "https://backpack.exchange/trade/™_†",
        capStyle: "UPPER",
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

export function setFeeData(withdrawalFees: any, tokenA: string, tokenB: string) {
    const combinedWithdrawalFees = withdrawalFees.combinedWithdrawalFees;

    for (let cex of CEXList) {
        //TokenA is the outputToken if selling, TokenB is the input token if selling
        cex.withdrawFees = {
            tokenA: 0,
            tokenB: 0
        }

        //@ts-ignore
        let matchingObject = combinedWithdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == tokenA);
        if (matchingObject) {
            const roundedNumber = parseFloat(matchingObject.fee).toFixed(10)
            cex.withdrawFees.tokenA = parseFloat(roundedNumber); //set wthdrawalfees.tokenA = rounded numberA , set wthdrawalfees.tokenB = rounded numberB
        }

        //@ts-ignore
        matchingObject = combinedWithdrawalFees.find(obj => obj.exchange_name == cex.name && obj.token == tokenB);
        if (matchingObject) {
            const roundedNumber = parseFloat(matchingObject.fee).toFixed(10)
            cex.withdrawFees.tokenB = parseFloat(roundedNumber); //set wthdrawalfees.tokenB = rounded numberB
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


    if (cex.name === "kraken" || cex.name === 'bybit' || cex.name === 'coinbase') {
        if (tokenPair.base == "eur" && tokenPair.quote == "usdt") {
            base = tokenPair.quote
            quote = tokenPair.base
        }
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