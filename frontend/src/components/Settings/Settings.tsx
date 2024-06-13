import { UpdatePriceQuery } from "@/model/API";
import styles from "./Settings.module.css";
import { FilterObj, FilterOptionValue } from "@/model/FilterData";
import FilterOption from "./FilterOption";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePostHog } from 'posthog-js/react'
import Link from "next/link";

interface SettingsProps {
    handleUpdate: (data: UpdatePriceQuery) => void;
    filter: FilterOptionValue[];
    short: boolean;  
} 

interface ScrollArrowProps {
    src: string;
    alt: string;
    direction: string;
    onClick: () => void;
    enabled: boolean;
}

export default function Settings({ handleUpdate, filter, short }: SettingsProps) {
    const posthog = usePostHog();
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    const [leftScroll, setLeftScroll] = useState(false);
    const [rightScroll, setRightScroll] = useState(true);

    const marginBottom = short ? {"--settings-margin-bottom": "40px"} : {"--settings-margin-bottom": "60px"}

    const updateFadeSizes = () => {
        const wrapper = scrollableWrapperRef.current;
        const scrollable = scrollableContentRef.current;
        if (!wrapper || !scrollable) return;

        if (scrollable.scrollWidth <= wrapper.clientWidth) {
            document.documentElement.setAttribute('filter-fade', "none");
            setLeftScroll(false);
            setRightScroll(false);
        }
        else if (wrapper.scrollLeft === 0) {
            document.documentElement.setAttribute('filter-fade', "start");
            setLeftScroll(false);
            setRightScroll(true);
        } 
        else if (wrapper.scrollLeft + wrapper.clientWidth + 1 < scrollable.scrollWidth) {
            document.documentElement.setAttribute('filter-fade', "middle");
            setLeftScroll(true);
            setRightScroll(true);
        } else {
            setLeftScroll(true);
            setRightScroll(false);
        }
    };

    useEffect(() => {
        updateFadeSizes();
        const wrapper = scrollableWrapperRef.current;

        if (wrapper) wrapper.addEventListener('scroll', updateFadeSizes);

        return () => {
            if (wrapper) wrapper.removeEventListener('scroll', updateFadeSizes);
        };
    }, []);

    const manuallyScroll = (amount: number) => {
        const wrapper = scrollableWrapperRef.current;
        if (wrapper) {
            wrapper.scrollTo({
                left: wrapper.scrollLeft + amount,
                behavior: 'smooth'
            });
        }
        updateFadeSizes();
    }

    const updateFilter = (value: FilterOptionValue) => {
        const index = filter.findIndex(([val]) => val === value[0]);

        if (index !== -1) {
            let newFilter = filter;
            newFilter[index] = value;
            newFilter.sort((a, b) => {
                if (a[1] === b[1]) return 0;
                if (a[1]) return -1;
                return 1;
            });

            handleUpdate({filter: newFilter});
            updateFadeSizes();
            posthog?.capture('Changed Exchange Filter', { exchangeFilter: newFilter })
        }
    }

    return (
        <div className={styles["settings"]} style={marginBottom as React.CSSProperties}>
            <Link href="?settings=true">
                <button className={styles["settings-button"] + " " + styles["icon-padding"]}>
                    <Image
                        src="/settings.svg"
                        alt="Settings"
                        height={30}
                        width={30}
                        className={styles["icon-size"]}
                    />
                </button>
            </Link>
            
            <ScrollArrow src="/left_arrow.svg" alt="Scroll Left" direction="s-left" onClick={() => {manuallyScroll(-150)}} enabled={leftScroll}/>
            <ScrollArrow src="/right_arrow.svg" alt="Scroll Right" direction="s-right" onClick={() => {manuallyScroll(150)}} enabled={rightScroll}/>

            <div className={styles["filters-wrapper"]} ref={scrollableWrapperRef}>
                <div className={styles["filters-content"]} ref={scrollableContentRef}>
                    <Image
                        src="/filter_icon.svg"
                        alt="CEX Filter"
                        height={30}
                        width={30}
                        className={styles["icon-size"] + " " + styles["icon-padding"]}
                    />
                    {filter.map(([cex, enabled], _) => (
                        <FilterOption 
                            key={cex}
                            name={cex} 
                            defaultEnabled={enabled}
                            onUpdate={(value: boolean) => updateFilter([cex, value])}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ScrollArrow(props: ScrollArrowProps) {
    const { src, alt, direction, onClick, enabled } = props;

    if (!enabled) return (<></>)

    return (
        <button
            className={styles[direction]}
            onClick={onClick}
        >
            <Image
                src={src}
                alt={alt}
                height={25}
                width={25}
                className={styles["scroll-icon"]}
            />
        </button>
    )
}
