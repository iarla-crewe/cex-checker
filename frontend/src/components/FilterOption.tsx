import { useState } from "react";
import { getCEXDisplayName } from "@/model/CEXList";

interface FilterOptionProps {
    name: string;
    defaultEnabled: boolean;
    onUpdate: (value: boolean) => void;
}

export default function FilterOption(props: FilterOptionProps) {
    const {name, defaultEnabled, onUpdate} = props;
    const [enabled, setEnabled] = useState(defaultEnabled);

    const enabledDisplay = (enabled) ? "✅" : "❌";
    
    return (
        <button onClick={() => {
            setEnabled(!enabled);
            onUpdate(!enabled);
        }}>
            <p>{getCEXDisplayName(name)} {enabledDisplay}</p>
        </button>
    )
}