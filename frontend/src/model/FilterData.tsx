export interface FilterObj {
    [exchange: string]: boolean;
    binance: boolean;
    bybit: boolean; 
    coinbase: boolean;
    crypto_com: boolean;
    kraken: boolean;
}

export type FilterOptionValue = [string, boolean]

export function filterToList(filterObject: FilterObj) {
    let enabledList: FilterOptionValue[] = [];
    let disabledList: FilterOptionValue[] = [];
    Object.entries(filterObject).map(([cex, enabled]) => {
        if (enabled) enabledList.push([cex, enabled]);
        else disabledList.push([cex, enabled]);
    });
    return enabledList.concat(disabledList);
}

export function listToFilter(filterList: FilterOptionValue[]) {
    const filterObj: FilterObj = {
        binance: false,
        bybit: false,
        coinbase: false,
        crypto_com: false,
        kraken: false
    };

    filterList.forEach(([cex, value]) => {
        if (cex in filterObj) filterObj[cex] = value;
    });

    return filterObj;
}