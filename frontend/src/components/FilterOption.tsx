interface FilterOptionProps {
    name: string;
    defaultEnabled: boolean;
    onUpdate: (value: boolean) => void;
}

export default function FilterOption(props: FilterOptionProps) {
    const {name, defaultEnabled, onUpdate} = props;
    
    return (
        <></>
    )
}