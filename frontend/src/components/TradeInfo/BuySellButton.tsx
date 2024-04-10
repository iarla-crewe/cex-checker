import Image from "next/image";

interface BuySellButtonProps {
    isSelling: boolean,
    onClickHandler: () => void
}

export default function BuySellButton(props: BuySellButtonProps) {
    const { isSelling, onClickHandler } = props;

    const text = (isSelling) ? "Sell" : "Buy";

    return (
        <button onClick={onClickHandler}>
            <p>{text}</p>
            <Image 
                src="/buy_sell_icon.svg"
                alt=""
                width={25}
                height={25}
            />
        </button>
    );
}