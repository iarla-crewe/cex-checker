"use client";

import React, { useState } from 'react';

export default function InputAmount() {
    const [inputValue, setInputValue] = useState<string>('');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "-" || event.key == "e" || event.key == "E") {
            event.preventDefault();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // TODO - Fix placeholder solution (this one doesn't work on Firefox, and allows for either , or .)
    // If changing type, change css in globals.css

    return (
        <input type="number" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="0.00"/>
    );
}
