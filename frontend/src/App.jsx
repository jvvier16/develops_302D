import { useState, useEffect } from 'react'
import { BrowserRouter, NavLink, Routes, Route, Link, Navigate } from 'react-router-dom'
import iconoImg from '../icono.png'
import './App.css'
import drinksData from './drinks.json'

const drinks = drinksData

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    onLogin({ email, name: email.split('@')[0] })
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={iconoImg} className="brand-icon" alt="Icono" />
          <h1>Bebidas</h1>
        </div>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        <p className="login-hint">
          Usa cualquier email y contraseña de 6+ caracteres para probar
        </p>
      </div>
    </div>
  )
}

function ProtectedRoutes({ user, onLogout, onAddToCart, searchTerm, setSearchTerm, cartItems, cartCount, onRemoveItem, onClearCart, cartOpen, setCartOpen }) {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="site-nav">
          <div className="brand">
            <img src={iconoImg} className="brand-icon" alt="Icono de Bebidas" />
            Bebidas
          </div>
          <div className="search-box">
            <img src={iconoImg} className="search-icon" alt="Buscar bebidas" />
            <input
              type="search"
              className="search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar bebidas..."
              aria-label="Buscar bebidas"
            />
          </div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Inicio
            </NavLink>
            <NavLink to="/productos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Productos
            </NavLink>
            <span className="user-info">👤 {user.name}</span>
            <button className="logout-button" onClick={onLogout}>
              Salir
            </button>
          </div>
          <button className="cart-toggle" onClick={() => setCartOpen((value) => !value)}>
            🛒 Carrito <span className="cart-count">{cartCount}</span>
          </button>
        </nav>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductosPage onAddToCart={onAddToCart} searchTerm={searchTerm} />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <p>© 2026 Bebidas. Página simple creada para mostrar tu selección de bebidas.</p>
        </footer>

        {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)} aria-hidden="true" />}
        <CartDrawer
          cartItems={cartItems}
          cartCount={cartCount}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onClose={() => setCartOpen(false)}
          isOpen={cartOpen}
        />
      </div>
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <>
      <header className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Bienvenido</span>
          <h1>Tu rincón de bebidas</h1>
          <p>
            Explora sabores únicos y frescos desde cafés reconfortantes hasta cócteles
            chispeantes. Elige una categoría y encuentra tu próxima bebida favorita.
          </p>
          <Link to="/productos" className="hero-action">
            Ver productos
          </Link>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="bubble bubble-1" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-3" />
        </div>
      </header>

      <section className="feature-panel">
        <div>
          <h2>Descubre nuevas sensaciones</h2>
          <p>
            Nosotros seleccionamos bebidas de todo tipo para que disfrutes en casa,
            en una reunión o en un momento de relax.
          </p>
        </div>
        <div className="feature-list">
          <span>Calientes</span>
          <span>Frías</span>
          <span>Afternoon</span>
          <span>Festivas</span>
        </div>
      </section>
    </>
  )
}

function ProductosPage({ onAddToCart, searchTerm }) {
  const filteredDrinks = drinks.filter((drink) => {
    const query = searchTerm.toLowerCase()
    return (
      drink.name.toLowerCase().includes(query) ||
      drink.category.toLowerCase().includes(query) ||
      drink.description.toLowerCase().includes(query)
    )
  })

  return (
    <section className="drink-list">
      <div className="section-header">
        <h2>Productos</h2>
        <p>Todas las bebidas disponibles para explorar y añadir al carrito.</p>
      </div>
      <div className="grid">
        {filteredDrinks.length > 0 ? (
          filteredDrinks.map((drink) => (
            <article key={drink.name} className="drink-card">
              <div className="drink-image" style={{ backgroundColor: drink.color }}>
                <span className="drink-image-icon">{drink.icon}</span>
              </div>
              <div className="drink-meta">
                <span className="drink-category">{drink.category}</span>
                <h3>{drink.name}</h3>
                <p>{drink.description}</p>
              </div>
              <button className="product-button" onClick={() => onAddToCart(drink)}>
                Añadir al carrito
              </button>
            </article>
          ))
        ) : (
          <div className="empty-search">
            <p>No se encontraron bebidas con ese término de búsqueda.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function CartDrawer({ cartItems, cartCount, onRemoveItem, onClearCart, onClose, isOpen }) {
  return (
    <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <div>
          <p className="cart-title">Carrito de compras</p>
          <span className="cart-subtitle">{cartCount} artículo{cartCount === 1 ? '' : 's'}</span>
        </div>
        <button className="close-cart" onClick={onClose} aria-label="Cerrar carrito">
          ×
        </button>
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.name} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p>{item.category}</p>
              </div>
              <div className="item-meta">
                <span>{item.qty}x</span>
                <button className="remove-item" onClick={() => onRemoveItem(item.name)}>
                  -
                </button>
              </div>
            </div>
          ))}
          <button className="clear-cart" onClick={onClearCart}>
            Vaciar carrito
          </button>
        </div>
      ) : (
        <div className="cart-empty">
          <p>Tu carrito está vacío. Agrega alguna bebida para comenzar.</p>
        </div>
      )}
    </aside>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setCart({})
    localStorage.removeItem('user')
  }

  const addToCart = (drink) => {
    setCart((current) => ({
      ...current,
      [drink.name]: (current[drink.name] || 0) + 1,
    }))
    setCartOpen(true)
  }

  const removeFromCart = (name) => {
    setCart((current) => {
      const quantity = current[name] || 0
      if (quantity <= 1) {
        const next = { ...current }
        delete next[name]
        return next
      }
      return { ...current, [name]: quantity - 1 }
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const cartItems = Object.entries(cart).map(([name, qty]) => {
    const drink = drinks.find((item) => item.name === name)
    return { ...drink, qty }
  })

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0)

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <ProtectedRoutes
      user={user}
      onLogout={handleLogout}
      onAddToCart={addToCart}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      cartItems={cartItems}
      cartCount={cartCount}
      onRemoveItem={removeFromCart}
      onClearCart={clearCart}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
    />
  )
}

export default App
