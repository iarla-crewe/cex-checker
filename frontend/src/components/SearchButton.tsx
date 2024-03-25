import styles from "./SearchButton.module.css"

export default function SearchButton() {


    return (
        <button className={styles["search-button"]}>
            <p>Search</p>
        </button>
    );
}
