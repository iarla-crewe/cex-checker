import styles from "./TradeInfo.module.css"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";

interface SelectCurrencyProps {
    defaultValue: string;
    onClickHandler: (value: string) => void;
}

export default function SelectCurrency(props: SelectCurrencyProps) {
    const { defaultValue, onClickHandler } = props;
    const [position, setPosition] = useState(defaultValue)

    useEffect(() => {
        setPosition(defaultValue)
    }, [defaultValue])

    const handleSetPosition = (token: string) => {
        onClickHandler(token);
        setPosition(token)
    }

    return (
        <>
        <button className={styles["select-currency"]}> {/* TODO: Add onClick={onClickHandler} */}
            <p>{defaultValue}</p>
            {/* TODO: Add in select functionality 
            <Image 
                src="/down_arrow.svg"
                alt="Select"
                width={12}
                height={12}
            /> 
            */}
        </button>
         
        <div className={styles["select-currency"]}>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{position}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Choose Output Token</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={handleSetPosition}>
                        <DropdownMenuRadioItem value="sol">SOL</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="usdc">USDC</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="btc">BTC</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </>
    )
}