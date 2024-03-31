import Image from "next/image";

interface OpenLinkProps {
    textColor: string
    link: string
}

export default function OpenLink(props: OpenLinkProps) {
    const { textColor, link } = props;

    const svg_file = (textColor == "white") ? "/open_link_light.svg" : "/open_link_dark.svg";
    const altText = "Open Website";
    const width = 35;
    const height = 35;
    
    return (
        <a href={link}>
            <Image
                src={svg_file}
                alt={altText}
                width={width}
                height={height}
            />
        </a>
    )
}