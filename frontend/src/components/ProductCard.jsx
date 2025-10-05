import React, { useState } from 'react'

export default function ProductCard({ product }) {
  const colors = ['yellow', 'white', 'rose']
  const [selectedColor, setSelectedColor] = useState('yellow')

  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price)

  return (
    <div className="card">
      <img src={product.images[selectedColor]} alt={product.name} />

      <h3>{product.name}</h3>
      <div className="price">{priceFormatted}</div>

      <div className="stars">{renderStars(product.popularity5)}</div>
      <div style={{marginBottom:"10px"}}>{product.popularity5.toFixed(1)} / 5</div>

      <div className="color-buttons">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            className={selectedColor === c ? "active" : ""}
            title={c}
          >
            <img src={product.images[c]} alt={c} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
          </button>
        ))}
      </div>
    </div>
  )
}

function renderStars(value) {
  const fullCount = Math.floor(value)
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(
      <span key={i}>{i < fullCount ? "★" : "☆"}</span>
    )
  }
  return arr
}
