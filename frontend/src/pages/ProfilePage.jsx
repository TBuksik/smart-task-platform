import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ProfilePage.module.css'

function ProfilePage({ token }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/v1/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => response.json())
        .then((data) => {
            setUser(data)
            setFullName(data.full_name || '')
            setLoading(false)
        })
    }, [token])

    if (loading) return <p>Ładowanie...</p>

    function saveProfile() {
        setError('')
        setSuccess('')

        fetch('/api/v1/auth/me', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ full_name: fullName })
        })
        .then((response) => {
            if (!response.ok) throw new Error('Nie udało się zapisać zmian')
            return response.json()
        })
        .then((data) => {
            setUser(data)
            setSuccess('Zapisano zmiany')
        })
        .catch((err) => {
            setError(err.message)
        })
    }

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/dashboard')}>← Powrót</button>
            <h1>Profil</h1>
            <p className={styles.email}>{user.email}</p>
            <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.button}
            />
            <button onClick={saveProfile} className={styles.button}>
                Zapisz
            </button>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
        </div>
    )
}

export default ProfilePage