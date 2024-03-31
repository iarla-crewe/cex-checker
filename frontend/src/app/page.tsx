import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import Filters from "@/components/Filters";
import CEXList from "@/components/CEXList/CEXList";

export default function Home() {
  

  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <TradeInfo/>
        <Filters/>
        <CEXList/>
      </div>
    </main>
  );
}
