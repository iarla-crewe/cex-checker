"use client"

import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import Filters from "@/components/Filters";
import PageContent from "@/components/PageContent";
import { io } from "socket.io-client"
import { useEffect, useState } from "react";

const socket = io('http://localhost:3001')

export default function Home() {
  let hasSearched = true;
  const [priceData, setPriceData] = useState<any>(null); // State to store price data

  type CexList = {
    binance: boolean,
    kraken: boolean,
    coinbase: boolean,
    crypto_com: boolean,
    bybit: boolean,
  }

  type PriceQuery = {
    inputToken: string,
    outputToken: string,
    inputAmount: number,
    cexList: CexList
  }

  function getPriceData({ inputToken, outputToken, inputAmount, cexList }: PriceQuery) {
    //sends the server the params and get-price query
    socket.emit('get-price', { inputToken, outputToken, inputAmount, cexList })
    console.log("get price data")
    //update the front end 
  }

  let cexList: CexList = {
    binance: true,
    kraken: true,
    coinbase: false,
    crypto_com: false,
    bybit: false
  }

  let params: PriceQuery = {
    inputToken: 'sol',
    outputToken: 'usdc',
    inputAmount: 1,
    cexList: cexList
  }

  useEffect(() => {
    getPriceData(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    socket.on("get-price", (sortedPrices: any) => {
      setPriceData(sortedPrices);
    });
  }, []);

  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        {priceData && (
          <div>
            <h2>Price Data</h2>
            <p>Binance Price: {priceData.sortedPrices.binance}</p>
            <p>Kraken Price: {priceData.sortedPrices.kraken}</p>
          </div>
        )}
        <TradeInfo />
        <Filters />
        <PageContent hasSearched={hasSearched} />
      </div>
    </main>
  );
}
