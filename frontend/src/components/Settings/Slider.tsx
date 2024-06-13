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
                height: '16px',
                width: '5px',
                backgroundColor: index * step < value ? 'var(--primary)' : '#ccc'
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
                    height: '8px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                    values: [value],
                    colors: ['var(--primary)', '#ccc'],
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
                border: "5px solid var(--primary)",
                backgroundColor: isDragged ? "var(--secondary-hover)" : 'var(--background)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 0px 6px var(--primary)',
                }}
            />
            )}
        />
    )
}