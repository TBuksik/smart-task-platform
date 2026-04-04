import { useState } from "react";
import styles from './SearchBar.module.css'

function SearchBar({ value, onSearch }) {
    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Szukaj zadań..."
            />
        </div>
    )
}

export default SearchBar