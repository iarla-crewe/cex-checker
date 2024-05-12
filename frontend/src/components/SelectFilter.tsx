import { UpdatePriceQuery } from "@/model/API";
import styles from "./SelectFilter.module.css";
import { Filter, FilterOptionValue } from "@/model/FIlter";
import FilterOption from "./FilterOption";
import { useState } from "react";
import Image from "next/image";

interface SelectFilterProps {
    handleUpdate: (data: UpdatePriceQuery) => void;
    defaultFilter: Filter
}

export default function SelectFilter(props: SelectFilterProps) {
    const { handleUpdate, defaultFilter } = props;
    const filter = convertFilterToList(defaultFilter);

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

            let newFilterObj = defaultFilter;
            newFilter.forEach(([cex, enabled]) => {
                newFilterObj[cex] = enabled;
            });
            handleUpdate({filter: newFilterObj});
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

function convertFilterToList(filter: Filter) {
    let enabledList: FilterOptionValue[] = [];
    let disabledList: FilterOptionValue[] = [];
    Object.entries(filter).map(([cex, enabled]) => {
        if (enabled) enabledList.push([cex, enabled]);
        else disabledList.push([cex, enabled]);
    });
    return enabledList.concat(disabledList);
}
