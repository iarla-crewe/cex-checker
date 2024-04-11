import { UpdatePriceQuery } from "@/model/API";
import styles from "./SelectFilters.module.css";
import { Filter } from "@/model/FIlter";
import FilterOption from "./FilterOption";
import { useState } from "react";

interface SelectFilterProps {
    handleUpdate: (data: UpdatePriceQuery) => void;
    defaultFilter: Filter
}

export default function SelectFilter(props: SelectFilterProps) {
    const { handleUpdate, defaultFilter } = props;
    const [filter, setFilter] = useState(defaultFilter); 

    return (
        <div className={styles["select-filters"]}>
            {Object.entries(defaultFilter).map(([cex, enabled]) => (
                <FilterOption 
                    name={cex} 
                    defaultEnabled={enabled}
                    onUpdate={(value: boolean) => {
                        let newFilter = filter;
                        newFilter[cex] = value;

                        setFilter(newFilter);
                        handleUpdate({filter: newFilter})
                    }}
                />
            ))}
        </div>
    );
}
