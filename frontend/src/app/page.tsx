"use client"

import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import SelectFilters from "@/components/SelectFilters";
import Results from "@/components/Results/Results";
import { useEffect, useState } from "react";
import { PriceData, PriceQuery, UpdatePriceQuery, getPriceData, socket } from "@/model/API";

export default function Home() {
  const [priceData, setPriceData] = useState<PriceData>({binance: "", bybit: "", coinbase: "", crypto_com: "", kraken: ""});
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'SOL',
    outputToken: 'USDC',
    amount: 1,
    filter: {
      binance: true,
      kraken: true,
      coinbase: false,
      crypto_com: false,
      bybit: true
    }
  });
  const [sortHighLow, setSortHighLow] = useState(true);

  useEffect(() => {
    // Function to handle "get-price" events
    const handleGetPrice = (sortedPrices: any) => {
      setPriceData(sortedPrices.sortedPrices);
    };

    // Initial call to getPriceData with queryData
    getPriceData(queryData);

    // Add listener for "get-price" events
    socket.on("get-price", handleGetPrice);

    // Clean-up function to remove the old listener when queryData changes
    return () => {
      socket.off("get-price", handleGetPrice);
    };
  }, [queryData])

  const handleQueryUpdate = (data: UpdatePriceQuery) => {
    if (data.inputToken === undefined) data.inputToken = queryData.inputToken;
    if (data.outputToken === undefined) data.outputToken = queryData.outputToken;
    if (data.amount === undefined) data.amount = queryData.amount;
    if (data.filter === undefined) data.filter = queryData.filter;

    setQueryData({
      inputToken: data.inputToken,outputToken: data.outputToken, amount: data.amount, filter: data.filter
    })
  }


  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <TradeInfo 
          defaultInputToken={queryData.inputToken} 
          defaultOutputToken={queryData.outputToken} 
          defaultAmount={queryData.amount}
          defaultIsBuying={sortHighLow}
          handleUpdate={handleQueryUpdate}
          setSortHighLow={setSortHighLow}
        />
        <SelectFilters handleUpdate={handleQueryUpdate}/>
        <Results priceData={priceData} currency={queryData.outputToken} sortHighLow={sortHighLow}/>
      </div>
    </main>
  );
}
