import Image from "next/image";
import styles from "./Header.module.css";

interface HeaderProps {
    short: boolean
}

export default function Header({short}: HeaderProps) {
    const mainSiteLink = "https://www.quartzpay.io/";
    const logoSrc = "/quartz.jpg";

    const marginBottom = short ? {"--header-margin-bottom": "15px"} : {"--header-margin-bottom": "22.5px"}

    return (
        <div className={styles["header-container"]} style={marginBottom as React.CSSProperties}>
            <a href={mainSiteLink}>
                <Image 
                    className={styles["quartz-logo"]}
                    src={logoSrc}
                    alt={"Quartz"}
                    width={250}
                    height={100}
                    priority={true}
                />
            </a>
        </div>
    )
}