"use client"

import styles from "./page.module.css";
import TradeInfo from "@/components/TradeInfo/TradeInfo";
import SelectFilter from "@/components/SelectFilter";
import Results from "@/components/Results/Results";
import { useEffect, useState } from "react";
import { ResponseData, PriceQuery, UpdatePriceQuery, getPriceData, socket, getFeeData } from "@/model/API";
import { CEXList, setFeeData } from "@/model/CEXList";

export default function Home() {
  const [responseData, setResponseData] = useState<ResponseData>({});
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'sol',
    outputToken: 'usdc',
    amount: 1,
    filter: {
      binance: true,
      kraken: true,
      coinbase: true,
      crypto_com: true,
      bybit: true
    }
  });
  const [isSelling, setIsSelling] = useState(true);
  const [depositFees, setDepositFees] = useState('');
  const [withdrawalFees, setWithdrawalFees] = useState('');


  useEffect(() => {
    // Function to handle "get-price" events
    const handleGetPrice = (response: any) => setResponseData(response.prices);

    const fetchPriceData = () => {
      getPriceData(queryData);
    };

    const fetchFeeData = async () => {
      let [depositFees, withdrawalFees] = await getFeeData(queryData.inputToken, queryData.outputToken)
      setDepositFees(depositFees)
      setWithdrawalFees(withdrawalFees)
      setFeeData(CEXList, withdrawalFees, queryData.outputToken)
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

  const handleQueryUpdate = (data: UpdatePriceQuery) => {
    if (data.inputToken === undefined) data.inputToken = queryData.inputToken;
    if (data.outputToken === undefined) data.outputToken = queryData.outputToken;
    if (data.amount === undefined) data.amount = queryData.amount;
    if (data.filter === undefined) data.filter = queryData.filter;

    setQueryData({
      inputToken: data.inputToken,outputToken: data.outputToken, amount: data.amount, filter: data.filter
    })
    setResponseData({})
  }


  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <TradeInfo 
          defaultInputToken={queryData.inputToken} 
          defaultOutputToken={queryData.outputToken} 
          defaultAmount={queryData.amount}
          defaultIsSelling={isSelling}
          handleUpdate={handleQueryUpdate}
          handleSetIsSelling={setIsSelling}
        />

        { <SelectFilter 
          handleUpdate={handleQueryUpdate}
          defaultFilter={queryData.filter}  
        /> }
        
        <Results 
          responseData={responseData} 
          currency={queryData.outputToken} 
          isSelling={isSelling} 
          filter={queryData.filter}
        />
      </div>
    </main>
  );
}
