"use client";

import React, { useState } from 'react';
import styles from "./TradeInfo.module.css";

interface InputAmountProps {
    defaultValue: number;
    updateAmount: (amount: number) => void;
}

export default function InputAmount(props: InputAmountProps) {
    const { defaultValue, updateAmount } = props;

    const maxLength = 13;
    const emptyPlaceholder = "0.00";

    const [inputValue, setInputValue] = useState<string>('');
    const [placeholder, setPlaceholder] = useState(defaultValue.toFixed(2));
    

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "-" || event.key == "e" || event.key == "E") {
            event.preventDefault();
        } else if (event.key == "," || event.key == ".") {
            if (inputValue.length >= maxLength) {
                event.preventDefault();
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = event.target.value;

        let checkedLength = maxLength;
        if (targetValue.includes(",") || targetValue.includes(".")) {
            checkedLength++;
        }

        if (targetValue.length <= checkedLength) {
            if (targetValue == "") setPlaceholder(emptyPlaceholder);
            setInputValue(targetValue);
            
            const num = Number(targetValue);
            if (!isNaN(num) && num > 0) updateAmount(num);
        }
    };

    // TODO - Fix placeholder solution (this one doesn't work on Firefox, and allows for either , or .)
    // If changing type, change css in globals.css

    return (
        <input 
            type="number" 
            className={styles["input-amount"]}
            value={inputValue} 
            onChange={handleChange} 
            onKeyDown={handleKeyDown} 
            maxLength={9} 
            placeholder={placeholder}
        />
    );
}

