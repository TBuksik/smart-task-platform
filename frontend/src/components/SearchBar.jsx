import { useState } from "react";
import styles from './SearchBar.module.css'

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('')

    function handleChange(e) {
        setQuery(e.target.value)
        onSearch(e.target.value)
    }

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                value={query}
                onChange={handleChange}
                placeholder="Szukaj zadań..."
            />
        </div>
    )
}

export default SearchBar