import { UpdatePriceQuery } from "@/model/API";
import styles from "./SelectFilter.module.css";
import { FilterObj, FilterOptionValue } from "@/model/Filter";
import FilterOption from "./FilterOption";
import { useState } from "react";
import Image from "next/image";

interface SelectFilterProps {
    handleUpdate: (data: UpdatePriceQuery) => void;
    filter: FilterOptionValue[]
}

export default function SelectFilter(props: SelectFilterProps) {
    const { handleUpdate, filter } = props;

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
        }
    }

    return (
        <div className={styles["select-filter"]}>
            <Image
                src="/filter_icon.svg"
                alt="CEX Filter"
                height={30}
                width={30}
                style={{paddingRight: 15}}
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
    );
}
