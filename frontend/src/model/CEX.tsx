interface CEX {
    name: string;
    logoSrc: string;
    brandColor: string;
    textColor: string;
}

export const CEXs: CEX[] = [
    {name: "Binance", logoSrc: "/binance.svg", brandColor: "#F1B90C", textColor: "black"},
    {name: "Kraken", logoSrc: "/kraken.svg", brandColor: "#7132F5", textColor: "white"},
    {name: "ByBit", logoSrc: "/bybit.svg", brandColor: "#17181e", textColor: "white"},
    {name: "Coinbase", logoSrc: "/coinbase.svg", brandColor: "#004af7", textColor: "white"},
    {name: "Crypto.com", logoSrc: "/crypto-com.svg", brandColor: "#032f69", textColor: "white"}
]
