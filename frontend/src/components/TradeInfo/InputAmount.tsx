"use client";

import React, { useState } from 'react';

export default function InputAmount() {
    const [inputValue, setInputValue] = useState<string>('');
    const maxLength = 12;

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
        }
    };

    // TODO - Fix placeholder solution (this one doesn't work on Firefox, and allows for either , or .)
    // If changing type, change css in globals.css

    return (
        <input type="number" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} maxLength={9} placeholder="0.00"/>
    );
}

