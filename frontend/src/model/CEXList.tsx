export interface CEX {
    name: string;
    displayName: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    borderColor: string;
    website: string;
    withdrawFee?: number;
    price?: number;
}

export const CEXList: CEX[] = [
    {
        name: "binance", 
        displayName: "Binance", 
        logoSrc: "/binance.svg", 
        brandColor: "#F1B90C", 
        textColor: "black", 
        borderColor: "", 
        website: "https://www.binance.com/en/trade/SOL_USDT?_from=markets&type=spot",
    },
    {
        name: "kraken", 
        displayName: "Kraken", 
        logoSrc: "/kraken.svg", 
        brandColor: "#7132F5", 
        textColor: "white", 
        borderColor: "white", 
        website: "https://pro.kraken.com/app/trade/sol-usdt"
    },
    {
        name: "bybit", 
        displayName: "ByBit", 
        logoSrc: "/bybit.svg", 
        brandColor: "#17181e", 
        textColor: "white", 
        borderColor: "#f7a600", 
        website: "https://www.bybit.com/en/trade/spot/SOL/USDC"
    },
    {
        name: "coinbase", 
        displayName: "Coinbase", 
        logoSrc: "/coinbase.svg", 
        brandColor: "#004af7", 
        textColor: "white", 
        borderColor: "white", 
        website: "https://www.coinbase.com/advanced-trade/spot/SOL-USD",
        withdrawFee: 0
    },
    {
        name: "crypto_com", 
        displayName: "Crypto.com", 
        logoSrc: "/crypto_com.svg", 
        brandColor: "#032f69", 
        textColor: "white", 
        borderColor: "white", 
        website: "https://crypto.com/exchange/trade/SOL_USDT"
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
