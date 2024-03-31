import Image from "next/image";

interface BuySellButtonProps {
    isBuying: boolean
}

export default function BuySellButton(props: BuySellButtonProps) {
    const { isBuying } = props;

    const text = (isBuying) ? "Buy" : "Sell";

    return (
        <button>
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