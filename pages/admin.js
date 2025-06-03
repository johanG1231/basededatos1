import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function AdminPage() {
  const [articulos, setArticulos] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [link, setLink] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/')
    }
    checkUser()
    fetchArticulos()
  }, [])

  const fetchArticulos = async () => {
    const { data, error } = await supabase.from('articulos').select('*')
    if (error) console.error(error)
    else setArticulos(data)
  }

  const handleAdd = async () => {
    // Primero consultamos si ya existe un artículo con ese título
    const { data: existing, error: errorCheck } = await supabase
      .from('articulos')
      .select('id')
      .eq('titulo', titulo)
      .limit(1);

    if (errorCheck) {
      alert('Error al verificar artículo existente');
      return;
    }

    if (existing.length > 0) {
      alert('Ya existe un artículo con ese título');
      return;
    }

    // Si no existe, insertar
    const { error } = await supabase
      .from('articulos')
      .insert({ titulo, descripcion, link });

    if (!error) {
      setTitulo('');
      setDescripcion('');
      setLink('');
      fetchArticulos();
    } else {
      alert('Error al agregar artículo');
    }
  }


  const handleDelete = async (id) => {
    await supabase.from('articulos').delete().eq('id', id)
    fetchArticulos()
  }

  const handleUpdate = async (id) => {
    const nuevoTitulo = prompt('Nuevo título:')
    if (nuevoTitulo) {
      await supabase.from('articulos').update({ titulo: nuevoTitulo }).eq('id', id)
      fetchArticulos()
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Administrar Artículos</h1>
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Link" value={link} onChange={e => setLink(e.target.value)} />
        <button onClick={handleAdd} className="bg-green-500 text-white p-2">Agregar</button>
      </div>
      {articulos.map(art => (
        <div key={art.id} className="border p-2 mb-2">
          <h2 className="font-bold">{art.titulo}</h2>
          <p>{art.descripcion}</p>
          <a href={art.link} className="text-blue-500" target="_blank">Ver</a>
          <div className="mt-2">
            <button onClick={() => handleUpdate(art.id)} className="bg-yellow-400 p-1 mr-2">Modificar</button>
            <button onClick={() => handleDelete(art.id)} className="bg-red-500 text-white p-1">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}