import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import Filters from "@/components/Filters";
import PageContent from "@/components/PageContent";

export default function Home() {
  let hasSearched = true;

  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <TradeInfo/>
        <Filters/>
        <PageContent hasSearched={hasSearched}/>
      </div>
    </main>
  );
}
