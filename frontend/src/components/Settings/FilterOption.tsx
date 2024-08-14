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
    
    return (
        <button 
            className={`main-panel ${styles["filter-option"]} ${!enabled ? styles["filter-disabled"] : ""}`} 
            onClick={() => {
                setEnabled(!enabled);
                onUpdate(!enabled);
            }
        }>
            <p>{getCEXDisplayName(name)}</p>
        </button>
    )
}
