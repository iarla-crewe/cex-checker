type Prices = {
    Binance: string,
    Kraken: string
}

export let sortedPrices: Prices = {
    Binance: "",
    Kraken: ""
};

export const sortPrices = (binancePrice: string, krakenPrice: string) => { 

    //sort prices into an object
    let priceOrder: Prices = {
        "Binance": sortedPrices.Binance,
        "Kraken": sortedPrices.Kraken
    }

    if (binancePrice !== sortedPrices.Binance && binancePrice !== undefined && binancePrice !== "NaN") {
        priceOrder.Binance = binancePrice
        console.log("New Binance price")
    }
    if (krakenPrice !== sortedPrices.Kraken && krakenPrice !== undefined && krakenPrice !== "NaN") {
        priceOrder.Kraken = krakenPrice
        console.log("New kraken price")
    }

    if (priceOrder.Binance !== sortedPrices.Binance || priceOrder.Kraken !== sortedPrices.Kraken) {
        // Convert the object into an array of key-value pairs
        let priceOrderArray = Object.entries(priceOrder);

        // Sort the array based on the values in descending order
        //@ts-ignore
        priceOrderArray.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

        // Convert the sorted array back into an object
        let sortedPriceOrder = Object.fromEntries(priceOrderArray);
        console.log(sortedPriceOrder)

        //@ts-ignore
        sortedPrices = sortedPriceOrder
    } 
}

export const minusFees = (tokenPrice: string, takerFee: number, tokenAmount: number): string => {
    let price = (Number(tokenPrice) * (1 - takerFee))
    return (price * tokenAmount).toFixed(5)
}