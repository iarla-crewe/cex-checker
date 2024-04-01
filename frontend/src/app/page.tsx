"use client"

import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import SelectFilters from "@/components/SelectFilters";
import Results from "@/components/Results/Results";
import { useEffect, useState } from "react";
import { PriceQuery, QueryUpdateData, getPriceData, socket } from "@/model/API";

export default function Home() {
  const [priceData, setPriceData] = useState<any>(null);
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'SOL',
    outputToken: 'USDC',
    amount: 1,
    filter: {
      binance: true,
      kraken: true,
      coinbase: false,
      crypto_com: false,
      bybit: false
    }
  });

  useEffect(() => {
    getPriceData(queryData);
    socket.on("get-price", (sortedPrices: any) => {
      setPriceData(sortedPrices.sortedPrices);
    });
  }, []);

  const handleQueryUpdate = (data: QueryUpdateData) => {
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
        {priceData && (
          <div>
            <h2>Price Data</h2>
            <p>Binance Price: {priceData.binance}</p>
            <p>Kraken Price: {priceData.kraken}</p>
          </div>
        )}
        <div>
          <h2>Query:</h2>
          <p>Input: {queryData.inputToken}</p>
          <p>Output: {queryData.outputToken}</p>
          <p>Amount: {queryData.amount}</p>
        </div>
        <TradeInfo 
          defaultInputToken={queryData.inputToken} 
          defaultOutputToken={queryData.outputToken} 
          defaultAmount={queryData.amount}
          handleUpdate={handleQueryUpdate}
        />
        <SelectFilters handleUpdate={handleQueryUpdate}/>
        <Results/>
      </div>
    </main>
  );
}
