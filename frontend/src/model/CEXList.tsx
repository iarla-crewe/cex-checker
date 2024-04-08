export interface CEX {
    name: string;
    displayName: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    borderColor: string;
    website: string;
    price?: string;
}

export const CEXList: CEX[] = [
    {name: "binance", displayName: "Binance", logoSrc: "/binance.svg", brandColor: "#F1B90C", textColor: "black", borderColor: "", website: "https://www.binance.com/"},
    {name: "kraken", displayName: "Kraken", logoSrc: "/kraken.svg", brandColor: "#7132F5", textColor: "white", borderColor: "", website: "https://www.kraken.com/"},
    {name: "bybit", displayName: "ByBit", logoSrc: "/bybit.svg", brandColor: "#17181e", textColor: "white", borderColor: "#f7a600", website: "https://www.bybit.com/"},
    {name: "coinbase", displayName: "Coinbase", logoSrc: "/coinbase.svg", brandColor: "#004af7", textColor: "white", borderColor: "", website: "https://www.coinbase.com/"},
    {name: "crypto_com", displayName: "Crypto.com", logoSrc: "/crypto_com.svg", brandColor: "#032f69", textColor: "white", borderColor: "", website: "https://crypto.com/"}
]
