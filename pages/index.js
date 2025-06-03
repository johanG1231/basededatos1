import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert('Credenciales incorrectas')
    else router.push('/admin')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login Administrador</h1>
      <input className="border w-full p-2 mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border w-full p-2 mb-4" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-full rounded">Ingresar</button>
    </div>
  )
}