import Image from "next/image";

interface OpenLinkProps {
    textColor: string
}

export default function OpenLink(props: OpenLinkProps) {
    const { textColor } = props;

    const altText = "Open Website";
    const width = 35;
    const height = 35;

    if (textColor == "white") {
        return (
            <Image
                src="/open_link_light.svg"
                alt={altText}
                width={width}
                height={height}
            />
        )
    } else {
        return (
            <Image
                src="/open_link_dark.svg"
                alt={altText}
                width={width}
                height={height}
            />
        )
    }
}