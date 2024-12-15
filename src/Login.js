import React, { useState } from 'react';
import axios from 'axios';
import Minesweeper from './Minesweeper';
import './Login.css';

// Importaciones de iconos
import { 
    FaGamepad,           // Logo principal 
    FaUser,              // Ícono de usuario
    FaLock,              // Ícono de contraseña
    FaSignInAlt,         // Ícono de inicio de sesión
    FaUserPlus           // Ícono de registro
} from 'react-icons/fa';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }
        if (password.length < 4) {
            setError('La contraseña debe tener al menos 4 caracteres');
            return;
        }

        try {
            const endpoint = isRegistering
                ? 'http://localhost:8080/api/usuarios/registro'
                : 'http://localhost:8080/api/usuarios/login';
            
            const response = await axios.post(endpoint, {
                username,
                password
            });

            if (response.data) {
                setIsLoggedIn(true);
            }
        } catch (err) {
            const errorMessage = err.response?.data || 
                'Error de conexión. Verifica tu conexión a internet.';
            setError(errorMessage);
            console.error('Error completo:', err);
        }
    };

    if (isLoggedIn) {
        return <Minesweeper username={username} />;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <FaGamepad className="login-logo-icon" />
                    <h2>
                        {isRegistering 
                            ? 'Crear Nueva Cuenta' 
                            : 'Iniciar Sesión en Buscaminas'}
                    </h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <FaUser className="login-input-icon" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            placeholder="Nombre de Usuario"
                            required
                            minLength={3}
                        />
                    </div>
                    <div className="login-input-group">
                        <FaLock className="login-input-icon" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            placeholder="Contraseña"
                            required
                            minLength={4}
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button
                        type="submit"
                        className="login-button"
                    >
                        {isRegistering 
                            ? (<><FaUserPlus style={{marginRight: '10px'}} /> Crear Cuenta</>) 
                            : (<><FaSignInAlt style={{marginRight: '10px'}} /> Iniciar Sesión</>)
                        }
                    </button>
                    <div className="login-switch">
                        {isRegistering ? (
                            <p>
                                ¿Ya tienes una cuenta?
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(false)}
                                    className="login-switch-link"
                                >
                                    Iniciar Sesión
                                </button>
                            </p>
                        ) : (
                            <p>
                                ¿No tienes cuenta?
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(true)}
                                    className="login-switch-link"
                                >
                                    Registrarse
                                </button>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;