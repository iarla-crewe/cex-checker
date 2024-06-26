import { useState } from "react";
import { getCEXDisplayName } from "@/model/CEXList";
import styles from "./Settings.module.css";
import Image from "next/image";

interface FilterOptionProps {
    name: string;
    defaultEnabled: boolean;
    onUpdate: (value: boolean) => void;
}

interface CloseFilterProps {
    enabled: boolean;
}

export default function FilterOption(props: FilterOptionProps) {
    const {name, defaultEnabled, onUpdate} = props;
    const [enabled, setEnabled] = useState(defaultEnabled);

    const borderColor = enabled ? "var(--primary)" : "var(--text)";
    const cssVariables = {
        '--filter-border': "var(--card-border-colorless) " + borderColor,
        '--filter-opacity': enabled ? "1" : "0.7"
    } as React.CSSProperties;
    
    return (
        <button 
            className={styles["filter-option"]} 
            style={cssVariables} 
            onClick={() => {
                setEnabled(!enabled);
                onUpdate(!enabled);
            }
        }>
            <p>{getCEXDisplayName(name)}</p>
            <CloseFilter enabled={enabled}/>
        </button>
    )
}

function CloseFilter(props: CloseFilterProps) {
    const { enabled } = props;
    if (!enabled) return (<></>)

    return (
        <Image
            src="/close_icon.svg"
            alt="x"
            height={25}
            width={25}
            className={styles["close-filter"]}
        />
    )
}