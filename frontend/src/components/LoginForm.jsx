import { useState } from "react";

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
                type="password"
            />
            <button onClick={() => onLogin(email, password)}>Zaloguj</button>
        </div>
    )
}

export default LoginForm