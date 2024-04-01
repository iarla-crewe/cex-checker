import { CEXList } from "@/model/CEXList";
import styles from "./Results.module.css";
import CEXCard from "./CEXCard";

export default function Results() {
    return (
        <ul className={styles["cex-list"]}>
            {CEXList.map((cex, index) => (
                <CEXCard index={index} cex={cex} />
            ))}
        </ul>
    );
}
