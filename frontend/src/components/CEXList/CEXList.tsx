import { CEXs } from "@/model/CEX";
import styles from "./CEXList.module.css"
import Image from "next/image";
import OpenLink from "./OpenLink";

export default function CEXList() {


    return (
        <ul className={styles["cex-list"]}>
            {CEXs.map((cex, index) => (
                <li key={index} style={{backgroundColor: cex.brandColor}}>
                    <Image 
                        src={cex.logoSrc}
                        alt={cex.name}
                        width={0}
                        height={0}
                        style={{ width: "250px", height: "auto"}}
                    />
                    <OpenLink isDark={cex.darkText}/>
                </li>
            ))}
        </ul>
    );
}
