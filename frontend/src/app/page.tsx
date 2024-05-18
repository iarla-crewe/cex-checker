"use client"

import styles from "./page.module.css";
import TradeInfo from "@/components/TradeInfo/TradeInfo";
import SelectFilter from "@/components/SelectFilter";
import Results from "@/components/Results/Results";
import { useEffect, useState } from "react";
import { ResponseData, PriceQuery, UpdatePriceQuery, getPriceData, socket, getFeeData, initializeRespobseObject } from "@/model/API";
import { setFeeData } from "@/model/CEXList";
import Header from "@/components/Header";
import { TokenPair, getTokenPair } from "@/lib/utils";
import { listToFilter, filterToList, FilterObj } from "@/model/FilterData";

export default function Home() {
  const [responseData, setResponseData] = useState<ResponseData>(initializeRespobseObject());
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'sol',
    outputToken: 'usdc',
    amount: 1,
    filter: filterToList({
      binance: true,
      bybit: true,
      coinbase: true,
      crypto_com: true,
      kraken: true
    })
  });
  const [isSelling, setIsSelling] = useState(true);
  const [tokenPair, setTokenPair] = useState<TokenPair>({
    base: queryData.inputToken,
    quote: queryData.outputToken
  });
  const [currency, setCurrency] = useState<string>(isSelling ? queryData.outputToken : queryData.inputToken);

  useEffect(() => {
    // Function to handle "get-price" events
    const handleGetPrice = (response: any) => setResponseData(response.prices);

    const fetchPriceData = () => {
      getPriceData(queryData);
    };

    const fetchFeeData = async () => {
      let [depositFees, withdrawalFees] = await getFeeData(queryData.inputToken, queryData.outputToken)
      setFeeData(withdrawalFees, queryData.outputToken, queryData.inputToken)
    };

    // Initial call to getPriceData with queryData
    fetchPriceData();

    //initial call to getFeeData with queryData tokens
    fetchFeeData();

    // Add listener for "get-price" events
    socket.on("get-price", handleGetPrice);

    const intervalId = setInterval(fetchPriceData, 5000);

    // Clean-up function to remove the old listener when queryData changes
    return () => {
      clearInterval(intervalId);
      socket.off("get-price", handleGetPrice);
    };
  }, [queryData])


  useEffect(() => {
    setCurrency(isSelling ? queryData.outputToken : queryData.inputToken)
  }, [isSelling, queryData])

  const handleQueryUpdate = (data: UpdatePriceQuery) => {
    if (data.inputToken === undefined) data.inputToken = queryData.inputToken;
    if (data.outputToken === undefined) data.outputToken = queryData.outputToken;
    if (data.amount === undefined) data.amount = queryData.amount;
    if (data.filter === undefined) data.filter = queryData.filter;

    setTokenPair(getTokenPair(data.inputToken, data.outputToken));

    setQueryData({
      inputToken: data.inputToken, outputToken: data.outputToken, amount: data.amount, filter: data.filter
    })
    setResponseData(initializeRespobseObject())
  }


  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <Header />

        <TradeInfo
          defaultInputToken={queryData.inputToken}
          defaultOutputToken={queryData.outputToken}
          defaultAmount={queryData.amount}
          defaultIsSelling={isSelling}
          handleUpdate={handleQueryUpdate}
          handleSetIsSelling={setIsSelling}
        />

        <SelectFilter
          handleUpdate={handleQueryUpdate}
          filter={queryData.filter}
        />

        <Results
          responseData={responseData}
          outputToken={queryData.outputToken}
          feeCurrency={currency}
          isSelling={isSelling}
          tokenPair={tokenPair}
          filter={listToFilter(queryData.filter)}
        />
      </div>
    </main>
  );
}
