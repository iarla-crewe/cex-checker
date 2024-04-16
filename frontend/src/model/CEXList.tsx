export interface CEX {
    name: string;
    displayName: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    borderColor: string;
    website: string;
    withdrawFee: string;
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
        withdrawFee: "4 USDC"
    },
    {
        name: "kraken", 
        displayName: "Kraken", 
        logoSrc: "/kraken.svg", 
        brandColor: "#7132F5", 
        textColor: "white", 
        borderColor: "", 
        website: "https://pro.kraken.com/app/trade/sol-usdt",
        withdrawFee: "1 USDC"
    },
    {
        name: "bybit", 
        displayName: "ByBit", 
        logoSrc: "/bybit.svg", 
        brandColor: "#17181e", 
        textColor: "white", 
        borderColor: "#f7a600", 
        website: "https://www.bybit.com/en/trade/spot/SOL/USDC",
        withdrawFee: "1 USDC"
    },
    {
        name: "coinbase", 
        displayName: "Coinbase", 
        logoSrc: "/coinbase.svg", 
        brandColor: "#004af7", 
        textColor: "white", 
        borderColor: "", 
        website: "https://www.coinbase.com/advanced-trade/spot/SOL-USD",
        withdrawFee: ""
    },
    {
        name: "crypto_com", 
        displayName: "Crypto.com", 
        logoSrc: "/crypto_com.svg", 
        brandColor: "#032f69", 
        textColor: "white", 
        borderColor: "", 
        website: "https://crypto.com/exchange/trade/SOL_USDT",
        withdrawFee: ""
    },
]
