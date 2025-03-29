import React, { useState } from 'react'
import AuthForm from './components/AuthForm'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  const handleToggle = () => {
    setIsLogin(!isLogin)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('Iniciar sesión enviado')
    } else {
      console.log('Registro enviado')
    }
  }

  return (
    <AuthForm
      isLogin={isLogin}
      onToggle={handleToggle}
      onSubmit={handleSubmit}
    />
  )
}
