import React, { useEffect, useState } from 'react'
import ProductCard from './components/ProductCard'
import './index.css'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Backend linki Render'da canlı olan link
    const API_URL = import.meta.env.VITE_API_URL || 'https://p-3-qfxm.onrender.com'

    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "20px" }}>
        Engagement Rings
      </h1>

      {loading && <div>Loading…</div>}
      {error && <div style={{color:"red"}}>Error: {error}</div>}
      {!loading && !error && (
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap:"20px"}}>
          {products.map(p => <ProductCard key={p.name} product={p} />)}
        </div>
      )}
    </div>
  )
}
