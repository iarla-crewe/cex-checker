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
import { currencies } from "@/model/SupportedCurrencies";

interface SelectCurrencyProps {
    defaultValue: string;
    onClickHandler: (value: string) => void;
}

export default function SelectCurrency(props: SelectCurrencyProps) {
    const { defaultValue, onClickHandler } = props;
    const [ selected, setSelected ] = useState(defaultValue)

    useEffect(() => {
        setSelected(defaultValue)
    }, [defaultValue])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={styles["select-currency"]}>
                    <p>{selected.toUpperCase()}</p>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Choose Token</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selected} onValueChange={onClickHandler}>
                    {currencies.map((currency, index) => (
                        <DropdownMenuRadioItem key={index} value={currency}>{currency.toUpperCase()}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}