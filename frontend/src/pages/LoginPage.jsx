import LoginForm from '../components/LoginForm'
import styles from './LoginPage.module.css'

function LoginPage({ onLogin, error, loading }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Smart Task Platform</h1>
        {loading && <p>Ładowanie...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  )
}

export default LoginPage