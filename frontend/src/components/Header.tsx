import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
    const mainSiteLink = "https://www.quartzpay.io/";
    const logoSrc = "/quartz.png";

    return (
        <div className={styles["header-container"]}>
            <a href={mainSiteLink}>
                <Image 
                    className={styles["quartz-logo"]}
                    src={logoSrc}
                    alt={"Quartz"}
                    width={300}
                    height={100}
                    priority={true}
                />
            </a>
        </div>
    )
}