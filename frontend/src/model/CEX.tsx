export interface CEX {
    name: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    borderColor: string;
    website: string;
}

export const CEXs: CEX[] = [
    {name: "Binance", logoSrc: "/binance.svg", brandColor: "#F1B90C", textColor: "black", borderColor: "", website: "https://www.binance.com/"},
    {name: "Kraken", logoSrc: "/kraken.svg", brandColor: "#7132F5", textColor: "white", borderColor: "", website: "https://www.kraken.com/"},
    {name: "ByBit", logoSrc: "/bybit.svg", brandColor: "#17181e", textColor: "white", borderColor: "#f7a600", website: "https://www.bybit.com/"},
    {name: "Coinbase", logoSrc: "/coinbase.svg", brandColor: "#004af7", textColor: "white", borderColor: "", website: "https://www.coinbase.com/"},
    {name: "Crypto.com", logoSrc: "/crypto-com.svg", brandColor: "#032f69", textColor: "white", borderColor: "", website: "https://crypto.com/"}
]
