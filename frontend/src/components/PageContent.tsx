import CEXList from "./CEXList/CEXList";

interface PageContentProps {
    hasSearched: boolean;
}

export default function PageContent(props: PageContentProps) {
    const { hasSearched } = props;
    
    if (hasSearched) return <CEXList/>;
    else return (<></>);
}
