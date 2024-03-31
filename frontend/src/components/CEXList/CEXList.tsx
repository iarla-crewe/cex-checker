import { CEXs } from "@/model/CEX";
import styles from "./CEXList.module.css";
import CEXCard from "./CEXCard";

export default function CEXList() {
    return (
        <ul className={styles["cex-list"]}>
            {CEXs.map((cex, index) => {
                console.log(index)
                return (
                    <CEXCard index={index} cex={cex} />
                )
            })}
        </ul>
    );
}
