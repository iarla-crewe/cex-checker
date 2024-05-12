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

    const handleSetSelected = (token: string) => {
        onClickHandler(token);
        setSelected(token);
    }

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
                <DropdownMenuRadioGroup value={selected} onValueChange={handleSetSelected}>
                    {currencies.map((currency, index) => (
                        <DropdownMenuRadioItem value={currency}>{currency.toUpperCase()}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}