import LoginForm from "../components/LoginForm";

function LoginPage({ onLogin, error, loading }) {
    return (
        <div>
            <h1>Smart Task Platform</h1>
            {loading && <p>Ładowanie...</p>}
            {error && <p>{error}</p>}
            <LoginForm onLogin={onLogin}/>
        </div>
    )
}

export default LoginPage