import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../api/gameApi'
import useGameStore from '../store/useGameStore'

const LoginPage = () => {
    const navigate = useNavigate()
    const setAuth = useGameStore(state => state.setAuth)

    const [form, setForm] = useState({
        usernameOrEmail: '',
        password: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await authApi.login(form)
            setAuth(response.data)
            navigate('/tasks')
        } catch (err: any) {
            const msg = err.message || err.code || 'Credenciales inválidas. Por favor intente de nuevo.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4"
             style={{ backgroundColor: 'var(--bg-dark)' }}>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🚀</div>
                    <h1 className="text-3xl font-black"
                        style={{ color: 'var(--text-primary)' }}>
                        Espacio de Trabajo
                    </h1>
                    <p className="mt-2 text-sm"
                       style={{ color: 'var(--text-secondary)' }}>
                        Inicia sesión para continuar tu viaje
                    </p>
                </div>

                {/* ✨ STANDARDIZED: Tightened padding to p-6 to match Dashboard hero cards */}
                <div className="p-6 rounded-2xl border shadow-xl"
                     style={{ backgroundColor: 'var(--surface-base)',
                              borderColor: 'var(--border-subtle)' }}>

                    <h2 className="text-xl font-bold mb-6 text-center"
                        style={{ color: 'var(--text-primary)' }}>
                        Bienvenido de Nuevo
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username or Email */}
                        <div>
                            <label className="block text-sm font-bold mb-1.5"
                                   style={{ color: 'var(--text-secondary)' }}>
                                Usuario o Correo Electrónico
                            </label>
                            <input
                                type="text"
                                name="usernameOrEmail"
                                value={form.usernameOrEmail}
                                onChange={handleChange}
                                placeholder="Ingresa tu usuario o correo"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--xp-blue)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold mb-1.5"
                                   style={{ color: 'var(--text-secondary)' }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Ingresa tu contraseña"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                                style={{
                                    backgroundColor: 'var(--surface-raised)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--xp-blue)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl text-sm text-center font-bold"
                                style={{
                                    backgroundColor: 'rgba(231,76,60,0.15)',
                                    border: '1px solid var(--danger-red)',
                                    color: 'var(--danger-red)',
                                }}>
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-sm
                                       transition-transform hover:scale-105
                                       active:scale-95 disabled:opacity-50
                                       disabled:cursor-not-allowed mt-2 shadow-lg"
                            style={{
                                backgroundColor: 'var(--xp-blue)',
                                color: '#fff',
                            }}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm mt-6"
                       style={{ color: 'var(--text-secondary)' }}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register"
                              style={{ color: 'var(--xp-blue)' }}
                              className="font-bold hover:underline transition-colors hover:brightness-125">
                            Crea una aquí
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage