import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthForm({ isLogin, onToggle, onSubmit }) {
  const navigate = useNavigate()

  const handleNavigation = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
    if (isLogin) {
      navigate('/dashboard') // Navigate to the dashboard after login
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese su nombre"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su correo"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/login"
            onClick={handleNavigation}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
          </a>
        </div>
      </div>
    </div>
  )
}
