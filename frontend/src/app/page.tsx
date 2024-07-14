"use client";

import styles from "./page.module.css";
import TradeInfo from "@/components/TradeInfo/TradeInfo";
import Settings from "@/components/Settings/Settings";
import Results from "@/components/Results/Results";
import { Suspense, useEffect, useState } from "react";
import { ResponseData, PriceQuery, UpdatePriceQuery, getPriceData, socket, getFeeData, initializeResponseObject } from "@/model/API";
import { setFeeData } from "@/model/CEXList";
import Header from "@/components/Header";
import { TokenPair, getTokenPair } from "@/lib/utils";
import { listToFilter, filterToList, FilterObj } from "@/model/FilterData";
import SettingsModal from "@/components/Settings/SettingsModal";
import ResultsView from "@/components/Results/ResultsView";

export default function Home() {
  const [refreshSpeed, setRefreshSpeed] = useState(5000);
  const [includeWithdrawFees, setIncludeWithdrawFees] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [arbitrageView, setArbitrageView] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const [responseData, setResponseData] = useState<ResponseData>(initializeResponseObject());
  const [queryData, setQueryData] = useState<PriceQuery>({
    inputToken: 'sol',
    outputToken: 'usdt',
    amount: 1,
    filter: filterToList({
      binance: true,
      bybit: true,
      coinbase: true,
      crypto_com: true,
      kraken: true,
      jupiter: true,
      oneInch: true,
      backpack: true,
    }),
    includeFees: includeWithdrawFees,
    isSelling: isSelling,
    isArbitrage: arbitrageView,
  });
  const [tokenPair, setTokenPair] = useState<TokenPair>({
    base: queryData.inputToken,
    quote: queryData.outputToken
  });
  const [currency, setCurrency] = useState<string>(isSelling ? queryData.outputToken : queryData.inputToken);

  const updateArbitrageView = (value: boolean) => {
    handleQueryUpdate({isArbitrage: value, includeFees: includeWithdrawFees || value});
    setArbitrageView(value);
  }

  // Disable arbitrage view if below 600px width
  useEffect(() => {
    const isMobileView = () => setMobileView(window.innerWidth < 600);

    isMobileView();
    window.addEventListener('resize', isMobileView);
    return () => {window.removeEventListener('resize', isMobileView);};
  }, []);

  useEffect(() => {
    // Function to handle "get-price" events
    const handleGetPrice = (response: any) => {
      // This supports older backend response by wrapping with new one
      let value = response.response;
      if (value === undefined) {
        console.log("Warning: outdated Quartz server version detected - results may be not be fully acurate");
        value = {prices: response.prices}
      }
      console.log("Value from server: ", value)
      setResponseData(value);
    }

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

    const intervalId = setInterval(fetchPriceData, refreshSpeed);

    // Clean-up function to remove the old listener when queryData changes
    return () => {
      clearInterval(intervalId);
      socket.off("get-price", handleGetPrice);
    };
  }, [queryData, refreshSpeed])


  useEffect(() => {
    setCurrency(isSelling ? queryData.outputToken : queryData.inputToken)
  }, [isSelling, queryData])

  const handleQueryUpdate = (data: UpdatePriceQuery) => {
    if (data.inputToken === undefined) data.inputToken = queryData.inputToken;
    if (data.outputToken === undefined) data.outputToken = queryData.outputToken;
    if (data.amount === undefined) data.amount = queryData.amount;
    if (data.filter === undefined) data.filter = queryData.filter;
    if (data.includeFees === undefined) data.includeFees = queryData.includeFees;
    if (data.isSelling === undefined) data.isSelling = queryData.isSelling;
    if (data.isArbitrage === undefined) data.isArbitrage = queryData.isArbitrage;

    setTokenPair(getTokenPair(data.inputToken, data.outputToken));

    setQueryData({
      inputToken: data.inputToken, 
      outputToken: data.outputToken, 
      amount: data.amount, 
      filter: data.filter,
      includeFees: data.includeFees,
      isSelling: data.isSelling,
      isArbitrage: data.isArbitrage,
    })
    setResponseData(initializeResponseObject())
  }


  return (
    <main className={styles["main"]}>
      <Suspense>
        <SettingsModal 
          refreshSpeed={refreshSpeed/1000}
          setRefreshSpeed={(value) => {setRefreshSpeed(value*1000)}}
          includeWithdrawFees={includeWithdrawFees}
          setIncludeWithdrawFees={(value) => {
            handleQueryUpdate({includeFees: value || arbitrageView});
            setIncludeWithdrawFees(value);
          }}
          arbitrageView={arbitrageView}
          setArbitrageView={updateArbitrageView}
        /> 
      </Suspense>

      <div className={styles["container"]}>
        <Header short={arbitrageView}/>

        <TradeInfo
          defaultInputToken={queryData.inputToken}
          defaultOutputToken={queryData.outputToken}
          defaultAmount={queryData.amount}
          defaultIsSelling={isSelling}
          handleUpdate={handleQueryUpdate}
          handleSetIsSelling={(value) => {
            handleQueryUpdate({isSelling: value});
            setIsSelling(value);
          }}
          arbitrageView={arbitrageView}
        />

        <Settings 
          handleUpdate={handleQueryUpdate}
          filter={queryData.filter}
          short={arbitrageView}
        />
        
        <ResultsView
          responseData={responseData}
          outputToken={queryData.outputToken}
          feeCurrency={currency}
          isSelling={isSelling}
          tokenPair={tokenPair}
          filter={listToFilter(queryData.filter)}
          includeWithdrawFees={includeWithdrawFees || arbitrageView}
          arbitrageView={arbitrageView}
          mobileView={mobileView}
        />
      </div>
    </main>
  );
}
