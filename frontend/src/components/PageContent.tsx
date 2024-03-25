import CEXList from "./CEXList/CEXList";
import SearchButton from "./SearchButton";

interface PageContentProps {
    hasSearched: boolean;
}

export default function PageContent(props: PageContentProps) {
    const { hasSearched } = props;
    
    if (hasSearched) return <CEXList/>;
    else return <SearchButton/>;
}
