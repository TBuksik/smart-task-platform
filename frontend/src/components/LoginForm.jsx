import { useState } from 'react'
import styles from './LoginForm.module.css'

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        type="password"
      />
      <button className={styles.button} onClick={() => onLogin(email, password)}>
        Zaloguj
      </button>
    </div>
  )
}

export default LoginForm