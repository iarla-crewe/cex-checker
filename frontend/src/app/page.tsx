import styles from "./page.module.css";

import TradeInfo from "@/components/TradeInfo/TradeInfo";
import Filters from "@/components/Filters";
import SearchButton from "@/components/SearchButton";

export default function Home() {
  return (
    <main className={styles.main}>
      <TradeInfo/>
      <Filters/>
      <SearchButton/>
    </main>
  );
}
