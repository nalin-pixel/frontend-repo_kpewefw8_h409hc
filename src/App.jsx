import React, { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Sparkles, Filter, Star, ChevronRight } from 'lucide-react'

function useEvents() {
  const API_BASE = useMemo(() => {
    const base = import.meta.env.VITE_BACKEND_URL || ''
    return base?.endsWith('/') ? base.slice(0, -1) : base
  }, [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({ events: [] })

  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const qs = new URLSearchParams()
      if (params.category) qs.set('category', params.category)
      if (params.featured !== undefined) qs.set('featured', params.featured)
      const res = await fetch(`${API_BASE}/api/events${qs.toString() ? `?${qs.toString()}` : ''}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...data, loading, error, refetch: fetchEvents }
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
      <Sparkles size={12} className="text-indigo-300" />
      {children}
    </span>
  )
}

function Navbar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-400" />
          <span className="text-white font-semibold tracking-tight">Campus Events</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-white/80">
          <a href="#events" className="hover:text-white transition-colors">Events</a>
          <a href="#featured" className="hover:text-white transition-colors">Featured</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <a href="#events" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur border border-white/15 hover:bg-white/15">
          Explore
        </a>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2),rgba(2,6,23,0))]" />

      <Navbar />

      <div className="relative z-10 h-full">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <Badge>Live this week</Badge>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              A modern portal for college fests, workshops and cultural nights
            </h1>
            <p className="mt-4 text-white/85 md:text-lg">
              Discover trending events, explore categories, and book your seat in seconds. Clean, fast, and futuristic.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#events" className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/50">
                Browse Events
              </a>
              <a href="#featured" className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/15">
                Featured
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }} />
    </section>
  )
}

function FeaturedStrip({ events }) {
  const featured = (events || []).filter(e => e.is_featured).slice(0, 6)
  if (!featured.length) return null
  return (
    <section id="featured" className="relative bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Featured highlights</h2>
            <p className="text-white/60 mt-1">Handpicked experiences happening soon</p>
          </div>
          <a href="#events" className="text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1">See all <ChevronRight size={16} /></a>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((e, i) => (
            <motion.div key={e.id || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={e.cover_image} alt={e.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <Calendar size={14} /> {new Date(e.date).toLocaleDateString()} <Clock size={14} className="ml-3" /> {e.time}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 line-clamp-2 text-white/70 text-sm">{e.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-indigo-300">{e.category}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-300"><Star size={14} /> Featured</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EventCard({ e, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.03 }} className="group overflow-hidden rounded-2xl border border-slate-200/10 bg-white/5 backdrop-blur">
      <div className="aspect-[16/9] overflow-hidden">
        <img src={e.cover_image} alt={e.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4 text-white">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-1"><Calendar size={14} /> {new Date(e.date).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Clock size={14} /> {e.time}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={14} /> {e.location}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
        <p className="mt-1 text-sm text-white/70 line-clamp-2">{e.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-indigo-300">{e.category}</span>
          <a href="#" className="text-sm text-white/90 inline-flex items-center gap-1 hover:text-white">Details <ChevronRight size={16} /></a>
        </div>
      </div>
    </motion.div>
  )
}

function EventsGrid() {
  const { events, loading, error, refetch } = useEvents()
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Tech', 'Cultural', 'Workshop', 'Sports']
  const filtered = (events || []).filter(e => (category === 'All' ? true : e.category === category))

  return (
    <section id="events" className="relative bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">All events</h2>
            <p className="text-white/60 mt-1">Explore what's happening across campus</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur">
              <Filter size={14} className="text-indigo-300" />
              Filter by category
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-1 text-sm border transition ${category === c ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/15 text-white/80 hover:bg-white/10'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-[200px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center py-20 text-white/70">
                Loading events...
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center py-20 text-rose-300">
                {error}
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((e, i) => (
                  <EventCard key={e.id || i} e={e} i={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Campus Events. All rights reserved.</p>
        <div className="text-xs">Built with a futuristic, minimalist vibe ✨</div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />
      <EventsGrid />
      <Footer />
    </div>
  )
}
