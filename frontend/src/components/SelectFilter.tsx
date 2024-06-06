import { UpdatePriceQuery } from "@/model/API";
import styles from "./SelectFilter.module.css";
import { FilterObj, FilterOptionValue } from "@/model/FilterData";
import FilterOption from "./FilterOption";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePostHog } from 'posthog-js/react'

interface SelectFilterProps {
    handleUpdate: (data: UpdatePriceQuery) => void;
    filter: FilterOptionValue[]
}

export default function SelectFilter(props: SelectFilterProps) {
    const { handleUpdate, filter } = props;
    const posthog = usePostHog();
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    const updateFadeSizes = () => {
        const wrapper = scrollableWrapperRef.current;
        const scrollable = scrollableContentRef.current;
        if (!wrapper || !scrollable) return;

        if (scrollable.scrollWidth <= wrapper.clientWidth) {
            document.documentElement.setAttribute('filter-fade', "none");
            return;
        }
        
        if (wrapper.scrollLeft === 0) {
            document.documentElement.setAttribute('filter-fade', "start");
        } 
        else if (wrapper.scrollLeft + wrapper.clientWidth + 1 < scrollable.scrollWidth) {
            document.documentElement.setAttribute('filter-fade', "middle");
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
            posthog?.capture('Changed Exchange Filter', { exchangeFilter: newFilter })
        }
    }

    return (
        <div className={styles["select-filter-wrapper"]} ref={scrollableWrapperRef}>
            <div className={styles["select-filter-content"]} ref={scrollableContentRef}>
                <Image
                    src="/filter_icon.svg"
                    alt="CEX Filter"
                    height={30}
                    width={30}
                    className={styles["filter-icon"]}
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
    );
}
