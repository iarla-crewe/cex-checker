import { Range, getTrackBackground } from "react-range";

interface SliderProps {
    step: number,
    min: number,
    max: number,
    value: number,
    setDisplayValue: (value: number) => void,
    updateValue?: (value: number) => void
}

export default function Slider({step, min, max, value, setDisplayValue, updateValue}: SliderProps) {
    if (!updateValue) updateValue = () => {}

    return (
        <Range
            values={[value]}
            step={step}
            min={min}
            max={max}
            onChange={(values) => setDisplayValue(values[0])}
            onFinalChange={(values) => updateValue(values[0])}
            renderMark={({ props, index }) => (
            <div
                {...props}
                style={{
                ...props.style,
                height: '0px',
                width: '4px',
                backgroundColor: index * step < value ? 'var(--color-primary-shade)' : 'var(--color-disabled)'
                }}
            />
            )}
            renderTrack={({ props, children }) => (
            <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%'
                }}
            >
                <div
                ref={props.ref}
                style={{
                    height: '5px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                    values: [value],
                    colors: ['var(--color-primary-shade)', '#ccc'],
                    min: min,
                    max: max
                    }),
                    alignSelf: 'center'
                }}
                >
                {children}
                </div>
            </div>
            )}
            renderThumb={({ props, isDragged }) => (
            <div
                {...props}
                style={{
                ...props.style,
                height: '25px',
                width: '25px',
                borderRadius: '100%',
                border: "var(--glass-border)",
                backgroundColor: isDragged ? "var(--color-primary-shade)" : 'var(--background)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 0px 6px #334658',
                }}
            />
            )}
        />
    )
}