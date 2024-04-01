"use client"

import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import SelectFilters from "@/components/SelectFilters";
import Results from "@/components/Results/Results";
import { useEffect, useState } from "react";
import { PriceQuery, getPriceData, socket } from "@/model/API";

export default function Home() {
  const [priceData, setPriceData] = useState<any>(null);
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'sol',
    outputToken: 'usdc',
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
        <TradeInfo />
        <SelectFilters />
        <Results/>
      </div>
    </main>
  );
}
