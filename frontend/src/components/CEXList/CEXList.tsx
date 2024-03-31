import { CEXs } from "@/model/CEX";
import styles from "./CEXList.module.css"
import Image from "next/image";
import OpenLink from "./OpenLink";

export default function CEXList() {
    

    return (
        <ul className={styles["cex-list"]}>
            {CEXs.map((cex, index) => (
                <li key={index} style={{backgroundColor: cex.brandColor}}>
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
            ))}
        </ul>
    );
}
