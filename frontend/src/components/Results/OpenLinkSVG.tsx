import Image from "next/image";
import styles from "./Results.module.css";

interface OpenLinkSVGProps {
    textColor: string;
    loaded: boolean;
    arbitrageView: boolean;
}

export default function OpenLinkSVG(props: OpenLinkSVGProps) {
    const { textColor, loaded, arbitrageView } = props;

    const svg_file = (textColor == "white") ? "/open_link_light.svg" : "/open_link_dark.svg";
    const altText = "Open Website";
    const width = 35;
    const height = 35;

    const classGridItem = arbitrageView ? "grid-item-arb" : "grid-item";
    const classOpenLinkIcon = arbitrageView ? "open-link-icon-arb" : "open-link-icon-arb";
    
    if (loaded) {
        return (
            <div className={styles[classGridItem]}>
                <Image
                    src={svg_file}
                    alt={altText}
                    width={width}
                    height={height}
                    className={styles[classOpenLinkIcon]}
                />
            </div>
        )
    } else {
        return (<></>)
    }
}