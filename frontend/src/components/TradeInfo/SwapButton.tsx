import Image from "next/image";

export default function SwapButton() {
    return (
        <button>
            <p>Buy</p>
            <Image 
                src="/swap_icon.svg"
                alt="Swap"
                width={17}
                height={17}
            />
        </button>
    );
}