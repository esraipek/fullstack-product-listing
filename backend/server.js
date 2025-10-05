// server.js
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// products.json dosyasını oku
const PRODUCTS = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

// Cache mekanizması
let cache = { price: null, ts: 0 };

// Altın fiyatını al
async function fetchGoldPrice() {
  const now = Date.now();
  if (cache.price && now - cache.ts < 5 * 60 * 1000) {
    return cache.price; // 5 dakika cache
  }

  // Eğer API bilgileri .env içinde varsa burayı doldur
  if (process.env.GOLD_API_URL && process.env.GOLD_API_KEY) {
    const resp = await axios.get(process.env.GOLD_API_URL, {
      params: { apikey: process.env.GOLD_API_KEY },
    });
    const price =
      resp.data.pricePerGram ?? resp.data.price ?? parseFloat(process.env.GOLD_PRICE || 60);
    cache = { price, ts: now };
    return price;
  }

  // Fallback: .env dosyasında GOLD_PRICE varsa onu kullan
  return parseFloat(process.env.GOLD_PRICE || 60);
}

// Endpoint: /api/products
app.get('/api/products', async (req, res) => {
  const goldPrice = await fetchGoldPrice();

  let items = PRODUCTS.map((p) => {
    const price = (p.popularityScore + 1) * p.weight * goldPrice;
    return {
      ...p,
      price: Math.round(price * 100) / 100,
      popularity5: +(1 + p.popularityScore * 4).toFixed(1),
    };
  });

  // Filtreleme (opsiyonel)
  if (req.query.minPrice) items = items.filter((i) => i.price >= Number(req.query.minPrice));
  if (req.query.maxPrice) items = items.filter((i) => i.price <= Number(req.query.maxPrice));
  if (req.query.minPopularity) items = items.filter((i) => i.popularity5 >= Number(req.query.minPopularity));

  res.json(items);
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
