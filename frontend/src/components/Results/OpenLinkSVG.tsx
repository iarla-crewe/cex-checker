import Image from "next/image";

interface OpenLinkSVGProps {
    textColor: string
    loaded: boolean
}

export default function OpenLinkSVG(props: OpenLinkSVGProps) {
    const { textColor, loaded } = props;

    const svg_file = (textColor == "white") ? "/open_link_light.svg" : "/open_link_dark.svg";
    const altText = "Open Website";
    const width = 35;
    const height = 35;
    
    if (loaded) {
        return (
            <Image
                src={svg_file}
                alt={altText}
                width={width}
                height={height}
            />
        )
    } else {
        return (
            <div style={{width: width, height: height}} />
        )
    }
}