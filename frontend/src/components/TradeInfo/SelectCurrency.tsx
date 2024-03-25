interface SelectCurrencyProps {
    defaultValue: string;
}

export default function SelectCurrency(props: SelectCurrencyProps) {
    const { defaultValue } = props;

    return (
        <div>
            <p>{defaultValue}</p>
        </div>
    )
}