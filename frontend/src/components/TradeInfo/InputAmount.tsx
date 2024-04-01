"use client";

import React, { useState } from 'react';

interface InputAmountProps {
    defaultValue: number;
    updateAmount: (amount: number) => void;
}

export default function InputAmount(props: InputAmountProps) {
    const { defaultValue, updateAmount } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const maxLength = 11;

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
        let checkedLength = maxLength;
        if (event.target.value.includes(",") || event.target.value.includes(".")) {
            checkedLength++;
        }

        if (event.target.value.length <= checkedLength) {
            setInputValue(event.target.value);
            
            const num = Number(event.target.value);
            if (!isNaN(num) && num > 0) updateAmount(num);
        }
    };

    // TODO - Fix placeholder solution (this one doesn't work on Firefox, and allows for either , or .)
    // If changing type, change css in globals.css

    return (
        <input type="number" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} maxLength={9} placeholder={defaultValue.toFixed(2)}/>
    );
}

