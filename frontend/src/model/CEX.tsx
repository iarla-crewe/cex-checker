interface CEX {
    name: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
    website: string;
}

export const CEXs: CEX[] = [
    {name: "Binance", logoSrc: "/binance.svg", brandColor: "#F1B90C", textColor: "black", website: "https://www.binance.com/"},
    {name: "Kraken", logoSrc: "/kraken.svg", brandColor: "#7132F5", textColor: "white", website: "https://www.kraken.com/"},
    {name: "ByBit", logoSrc: "/bybit.svg", brandColor: "#17181e", textColor: "white", website: "https://www.bybit.com/"},
    {name: "Coinbase", logoSrc: "/coinbase.svg", brandColor: "#004af7", textColor: "white", website: "https://www.coinbase.com/"},
    {name: "Crypto.com", logoSrc: "/crypto-com.svg", brandColor: "#032f69", textColor: "white", website: "https://crypto.com/"}
]
