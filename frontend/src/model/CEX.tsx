interface CEX {
    name: string;
    logoSrc: string;
    brandColor: string;
    darkText: boolean;
}

export const CEXs: CEX[] = [
    {name: "Binance", logoSrc: "/binance.svg", brandColor: "#F1B90C", darkText: true},
    {name: "Kraken", logoSrc: "/kraken.svg", brandColor: "#7132F5", darkText: false}
]
