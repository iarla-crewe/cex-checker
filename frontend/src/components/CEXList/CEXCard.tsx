import Image from "next/image";
import OpenLink from "./OpenLink";
import { CEX } from "@/model/CEX";
import styles from "./CEXList.module.css";

interface CEXCardProps {
    index: number,
    cex: CEX
}

export default function CEXCard(props: CEXCardProps) {
    const { index, cex } = props;

    const border = (cex.borderColor) ? "1.5px solid " + cex.borderColor : "0px";

    return (
        <a href={cex.website} target="_blank">
            <li key={index} style={{backgroundColor: cex.brandColor, border: border}}>
                <div className={styles["cex-logo-wrapper"]}>
                    <Image 
                        className={styles["cex-logo"]}
                        src={cex.logoSrc}
                        alt={cex.name}
                        width={0}
                        height={0}
                        style={{ width: "auto", height: "100%"}}
                    />
                </div>

                <div className={styles["price-info"]} style={{color: cex.textColor}}>
                    <p className={styles["price-heading"]}>Expected</p>
                    <p className={styles["price-subheading"]}>(after fees)</p>
                    <p className={styles["price"]}>0.00</p>
                    <p className={styles["price-currency"]}>USDC</p>
                </div>

                <OpenLink textColor={cex.textColor} link={cex.website}/>
            </li>
        </a>
    )
}