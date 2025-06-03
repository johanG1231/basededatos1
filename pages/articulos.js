import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ArticulosPublic() {
  const [articulos, setArticulos] = useState([])
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    fetchArticulos()
  }, [])

  const fetchArticulos = async () => {
    const { data, error } = await supabase.from('articulos').select('*')
    if (error) console.error(error)
    else setArticulos(data)
  }

  const filtrados = articulos.filter(art =>
    art.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    art.descripcion.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscador de Artículos</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {filtrados.length === 0 ? (
        <p>No se encontraron artículos.</p>
      ) : (
        filtrados.map(art => (
          <div key={art.id} className="border p-3 mb-3 rounded shadow">
            <h3 className="font-semibold">{art.titulo}</h3>
            <p>{art.descripcion}</p>
            {art.link && (
              <a href={art.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Ver enlace
              </a>
            )}
          </div>
        ))
      )}
    </div>
  )
}
