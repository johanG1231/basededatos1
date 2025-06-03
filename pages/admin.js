import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function AdminPage() {
  const [articulos, setArticulos] = useState([])
  const [form, setForm] = useState({ id: null, titulo: '', descripcion: '', link: '' })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/')
      else fetchArticulos()
    }
    checkUser()
  }, [])

  const fetchArticulos = async () => {
    const { data, error } = await supabase.from('articulos').select('*').order('id', { ascending: true })
    if (error) console.error(error)
    else setArticulos(data)
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.titulo || !form.descripcion) {
      alert('Por favor completa título y descripción')
      return
    }

    if (form.id === null) {
      // Insertar nuevo artículo
      const { error } = await supabase.from('articulos').insert({ titulo: form.titulo, descripcion: form.descripcion, link: form.link })
      if (error) alert('Error al agregar artículo: ' + error.message)
      else {
        setForm({ id: null, titulo: '', descripcion: '', link: '' })
        fetchArticulos()
      }
    } else {
      // Actualizar artículo existente
      const { error } = await supabase.from('articulos').update({
        titulo: form.titulo,
        descripcion: form.descripcion,
        link: form.link
      }).eq('id', form.id)

      if (error) alert('Error al actualizar artículo: ' + error.message)
      else {
        setForm({ id: null, titulo: '', descripcion: '', link: '' })
        fetchArticulos()
      }
    }
  }

  const handleEditar = art => {
    setForm({ id: art.id, titulo: art.titulo, descripcion: art.descripcion, link: art.link || '' })
  }

  const handleBorrar = async id => {
    if (confirm('¿Seguro que quieres borrar este artículo?')) {
      const { error } = await supabase.from('articulos').delete().eq('id', id)
      if (error) alert('Error al borrar: ' + error.message)
      else fetchArticulos()
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administrar Artículos</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Link (opcional)"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {form.id === null ? 'Agregar' : 'Actualizar'}
        </button>
        {form.id !== null && (
          <button
            type="button"
            onClick={() => setForm({ id: null, titulo: '', descripcion: '', link: '' })}
            className="ml-4 px-4 py-2 border rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      <div>
        {articulos.length === 0 && <p>No hay artículos aún.</p>}
        {articulos.map(art => (
          <div key={art.id} className="border p-3 mb-3 rounded shadow">
            <h3 className="font-semibold">{art.titulo}</h3>
            <p>{art.descripcion}</p>
            {art.link && (
              <a href={art.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Ver enlace
              </a>
            )}
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEditar(art)} className="bg-yellow-400 px-3 py-1 rounded">Editar</button>
              <button onClick={() => handleBorrar(art.id)} className="bg-red-600 text-white px-3 py-1 rounded">Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
