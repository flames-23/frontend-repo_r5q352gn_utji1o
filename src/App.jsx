import { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, Github, ExternalLink, Play, ShieldCheck, LogIn, LogOut } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'

const ACCENTS = {
  violet: '#7C3AED',
  mint: '#10B981',
  orange: '#F97316',
}

const THEME_COLORS = {
  light: { bg: '#FFFFFF', text: '#0F172A', card: '#F8FAFC' },
  dark: { bg: '#0D1117', text: '#E5E7EB', card: '#111827' },
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}

function useScrollDirection() {
  const [dir, setDir] = useState('up')
  const last = useRef(window.scrollY)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setDir(y > last.current ? 'down' : 'up')
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return dir
}

function Navbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const dir = useScrollDirection()
  const navVariants = {
    visible: { y: 0, opacity: 0.95 },
    hidden: { y: -24, opacity: 0.6 },
  }
  const location = useLocation()

  const links = [
    { to: '#about', label: 'About' },
    { to: '#tech', label: 'Tech' },
    { to: '#projects', label: 'Projects' },
    { to: '#xp', label: 'Experience' },
    { to: '#blog', label: 'Insights' },
  ]

  const linkBase = 'px-3 py-2 text-sm font-medium tracking-wide transition-all duration-100'

  return (
    <motion.nav
      variants={navVariants}
      animate={dir === 'up' ? 'visible' : 'hidden'}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40 backdrop-blur-md bg-white/60 dark:bg-black/30 border border-black/5 dark:border-white/10 rounded-full shadow-sm"
    >
      <div className="flex items-center gap-2 pl-3 pr-2">
        <Link to="/" className="px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">FS Engineer</Link>
        <div className="hidden sm:flex items-center">
          {links.map((l) => (
            <a key={l.to} href={l.to} className={`${linkBase} group relative`}> 
              <span>{l.label}</span>
              <span className="absolute left-3 -bottom-0.5 h-0.5 w-0 bg-current transition-all group-hover:w-[calc(100%-1.5rem)]" />
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg:white/10">
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>} 
          </button>
          <button className="sm:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="sm:hidden px-3 pb-3">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm opacity-90">{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function Hero({ onCTAClick }) {
  const { theme } = useTheme()
  // subtle code scroll effect
  const codeLines = useMemo(() => [
    'const greet = (name) => `hello ${name}`',
    'app.get("/api", handler)',
    'useEffect(() => fetch("/home"), [])',
    'docker compose up -d',
    'db.collection("project").find({ featured: true })',
  ], [])

  return (
    <section className="relative overflow-hidden pt-28 pb-14">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-7">
          <h1 className="text-[clamp(32px,6vw,48px)] leading-tight font-extrabold tracking-tight">
            Full‑stack engineer crafting fast, accessible products.
          </h1>
          <p className="mt-3 text-[15px] leading-7 opacity-80 max-w-[52ch]">
            I design resilient systems, ship delightful UIs, and obsess over performance budgets. Minimal surfaces, strong grids, and humane interactions.
          </p>
          <button onClick={onCTAClick} className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text:white bg-[#0F172A] dark:bg-[#7C3AED] relative overflow-hidden">
            <span className="relative z-10">View Projects</span>
            <ExternalLink size={16} className="relative z-10"/>
            <span className="absolute inset-0 bg-white/20 animate-[pulse_1.6s_ease-out_infinite]" style={{ maskImage: 'radial-gradient(60% 60% at 50% 50%, black, transparent)' }} />
          </button>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="relative h-40 rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 overflow-hidden">
            <div className="absolute inset-0 [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] font-mono text-xs leading-6">
              <div className="absolute inset-0 animate-[scroll_12s_linear_infinite] will-change-transform">
                {codeLines.concat(codeLines).map((l, i) => (
                  <div key={i} className="px-4 text-[11px] opacity-80">
                    <span className="text-[#7C3AED] dark:text-[#10B981]">$</span> {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-6">
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  )
}

function About() {
  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      <div className="col-span-12 md:col-span-4">
        <div className="aspect-[3/4] rounded-lg bg-black/5 dark:bg-white/10" />
      </div>
      <div className="col-span-12 md:col-span-8 text-[15px] leading-7 opacity-85">
        <p>
          I’m a full‑stack software engineer focused on elegant systems and crisp UI. I work end‑to‑end—from research and wireframes to CI/CD and observability. I favor small, composable modules, type‑safe APIs, and DX that feels effortless. I champion accessibility, color‑blind‑safe palettes, and performance budgets.
          I have shipped products in fintech, health, and developer tools, with emphasis on reliability, security, and measurable outcomes. I love Swiss‑style design: clear hierarchy, strong grids, and generous breathing room.
        </p>
      </div>
    </div>
  )
}

function TechStack({ tech = [] }) {
  const items = tech.length ? tech : ['TypeScript','React','Node','FastAPI','MongoDB','PostgreSQL','Docker','Kubernetes','AWS','Vite','Tailwind','Framer Motion']
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="px-3 py-1 rounded-full text-sm border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur hover:shadow-[0_0_0_2px_#7C3AED] dark:hover:shadow-[0_0_0_2px_#10B981] transition-all">
          {t}
        </span>
      ))}
    </div>
  )
}

function Projects({ items = [] }) {
  const data = items.length ? items : [
    { title: 'Realtime Collab', tags:['react','ws'], demo_url:'#', repo_url:'#' },
    { title: 'Design System', tags:['ts','tailwind'], demo_url:'#', repo_url:'#' },
    { title: 'Analytics ETL', tags:['python','airflow'], demo_url:'#', repo_url:'#' },
    { title: 'Infra as Code', tags:['terraform'], demo_url:'#', repo_url:'#' },
  ]
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
      {data.map((p, i) => (
        <article key={i} className="mb-4 break-inside-avoid rounded-lg border border-black/10 dark:border-white/10 p-4 hover:border-[#7C3AED] dark:hover:border-[#10B981] transition-colors">
          <h3 className="font-semibold">{p.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            {p.demo_url && <a href={p.demo_url} className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10" aria-label="Live demo"><ExternalLink size={16} /></a>}
            {p.repo_url && <a href={p.repo_url} className="p-2 rounded hover:bg:black/5 dark:hover:bg-white/10" aria-label="Repository"><Github size={16} /></a>}
          </div>
        </article>
      ))}
    </div>
  )
}

function Timeline() {
  const items = [
    { title: 'Senior Full‑stack Engineer', meta: '2022—Now · Remote', body: 'Leading platform engineering and design systems.' },
    { title: 'Full‑stack Engineer', meta: '2019—2022 · NYC', body: 'Built fintech web apps, APIs, and infra.' },
    { title: 'B.S. Computer Science', meta: '2015—2019 · University', body: 'Focused on HCI and distributed systems.' },
  ]
  return (
    <ol className="relative border-s border-black/10 dark:border-white/10">
      {items.map((it, idx) => (
        <li key={idx} className="ms-4 py-4">
          <div className="absolute -start-1.5 mt-2 size-3 rounded-full bg-[#7C3AED] dark:bg-[#10B981]" />
          <h4 className="font-semibold">{it.title}</h4>
          <div className="text-xs opacity-60">{it.meta}</div>
          <p className="mt-1 text-sm opacity-85">{it.body}</p>
        </li>
      ))}
    </ol>
  )
}

function Blog({ posts = [] }) {
  const data = posts.length ? posts : [
    { title:'Edge rendering mental models', tags:['web','perf'], read_time:6 },
    { title:'Designing with a 12‑col grid', tags:['design'], read_time:4 },
    { title:'DX as product', tags:['devex'], read_time:5 },
  ]
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((p, i) => (
        <article key={i} className="rounded-lg border border-black/10 dark:border:white/10 p-4 bg-white dark:bg-[#0F1115]">
          <h4 className="font-semibold">{p.title}</h4>
          <div className="mt-2 flex items-center gap-2">
            {p.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-black/5 dark:bg-white/10">{t}</span>)}
            <span className="ml-auto text-xs opacity-60">{p.read_time} min</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function Footer(){
  return (
    <footer className="py-10 text-center text-xs opacity-60">
      © {new Date().getFullYear()} • Built with care
    </footer>
  )
}

function Home(){
  const navigate = useNavigate()
  const [home, setHome] = useState(null)
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL || ''
    fetch(`${base}/home`).then(r=>r.json()).then(setHome).catch(()=>{})
  }, [])
  return (
    <main>
      <Hero onCTAClick={() => navigate('#projects')} />
      <Section id="about" title="About"><About/></Section>
      <Section id="tech" title="Tech Stack"><TechStack tech={home?.tech?.map(t=>t.name)}/></Section>
      <Section id="projects" title="Projects"><Projects items={home?.projects}/></Section>
      <Section id="xp" title="Experience & Education"><Timeline/></Section>
      <Section id="blog" title="Insights"><Blog posts={home?.posts}/></Section>
      <Footer/>
    </main>
  )
}

function Studio(){
  const base = import.meta.env.VITE_BACKEND_URL || ''
  const [token, setToken] = useState(localStorage.getItem('token')||'')
  const [password, setPassword] = useState('')

  async function login(){
    const res = await fetch(`${base}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) })
    if(res.ok){
      const data = await res.json();
      setToken(data.access_token); localStorage.setItem('token', data.access_token)
    }
  }

  const [form, setForm] = useState({ type:'project', title:'', slug:'', summary:'', tech:'' })

  async function create(){
    const body = form.type==='project' ? {
      title: form.title, slug: form.slug, summary: form.summary, tech: form.tech.split(',').map(s=>s.trim())
    } : form.type==='blog' ? {
      title: form.title, slug: form.slug, excerpt: form.summary, tags: form.tech.split(',').map(s=>s.trim()), read_time: 4
    } : {
      name: form.title, category: form.slug, level: form.summary
    }
    const endpoint = form.type==='project' ? '/projects' : form.type==='blog' ? '/blog' : '/tech'
    await fetch(`${base}${endpoint}`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(body)})
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold">Studio</h1>
      {!token && (
        <div className="mt-6 flex gap-2">
          <input type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} className="px-3 py-2 border rounded"/>
          <button onClick={login} className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">Login</button>
        </div>
      )}
      {token && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-3">
            <select value={form.type} onChange={e=>setForm(f=>({...f, type:e.target.value}))} className="w-full px-3 py-2 border rounded">
              <option value="project">Project</option>
              <option value="blog">Blog</option>
              <option value="tech">Tech Item</option>
            </select>
            <input placeholder="Title / Name" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} className="w-full px-3 py-2 border rounded"/>
            <input placeholder="Slug / Category" value={form.slug} onChange={e=>setForm(f=>({...f, slug:e.target.value}))} className="w-full px-3 py-2 border rounded"/>
            <input placeholder="Summary / Level" value={form.summary} onChange={e=>setForm(f=>({...f, summary:e.target.value}))} className="w-full px-3 py-2 border rounded"/>
            <input placeholder="Tech / Tags (comma sep)" value={form.tech} onChange={e=>setForm(f=>({...f, tech:e.target.value}))} className="w-full px-3 py-2 border rounded"/>
            <button onClick={create} className="px-3 py-2 rounded bg-[#7C3AED] text-white">Create</button>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Preview</h3>
            <pre className="text-xs whitespace-pre-wrap opacity-80">{JSON.stringify(form, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

function ProjectDetail(){
  const { pathname } = useLocation()
  const slug = pathname.split('/').pop()
  const base = import.meta.env.VITE_BACKEND_URL || ''
  const [project, setProject] = useState(null)
  const [tab, setTab] = useState('overview')
  useEffect(()=>{ fetch(`${base}/projects/slug/${slug}`).then(r=>r.json()).then(setProject).catch(()=>{}) },[slug])
  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="h-40 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#10B981] mb-6" />
      <div className="sticky top-16 z-10 bg-white/60 dark:bg-black/30 backdrop-blur border rounded-full inline-flex p-1">
        {['overview','process','demo','learnings'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full text-sm ${tab===t?'bg-white dark:bg-black shadow':''}`}>{t}</button>
        ))}
      </div>
      {tab==='overview' && project && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="mt-2 opacity-80">{project.summary}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {project.tech?.map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-black/5 dark:bg-white/10">{t}</span>)}
            </div>
          </div>
          <div className="text-sm">
            <div><span className="opacity-60">Role:</span> {project.role||'Engineer'}</div>
            <div><span className="opacity-60">Timeline:</span> {project.timeline||'—'}</div>
            <div className="mt-3 flex gap-2">
              {project.demo_url && <a href={project.demo_url} className="btn">Live Demo</a>}
              {project.repo_url && <a href={project.repo_url} className="btn">Repository</a>}
            </div>
          </div>
        </div>
      )}
      {tab==='process' && (
        <div className="mt-6 space-y-6">
          <div className="aspect-video rounded bg-black/5 dark:bg-white/10" />
          <div className="aspect-[3/1] rounded bg-black/5 dark:bg:white/10" />
          <div className="aspect-video rounded bg-black/5 dark:bg-white/10" />
        </div>
      )}
      {tab==='demo' && (
        <div className="mt-6">
          <div className="aspect-video rounded overflow-hidden bg-black">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
      {tab==='learnings' && (
        <ul className="mt-6 list-disc pl-6 text-sm">
          <li>Shipped observable pipelines with clear SLOs.</li>
          <li>Improved TTI by 38% using code‑splitting and cache hints.</li>
          <li>Reduced infra cost 22% via autoscaling and right‑sizing.</li>
        </ul>
      )}
    </div>
  )
}

function Layout(){
  const { theme } = useTheme()
  useEffect(()=>{
    document.documentElement.style.setProperty('--bg', THEME_COLORS[theme].bg)
    document.documentElement.style.setProperty('--text', THEME_COLORS[theme].text)
  },[theme])
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-[background-color,color] duration-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/projects/:slug" element={<ProjectDetail/>} />
        <Route path="/studio" element={<Studio/>} />
      </Routes>
    </div>
  )
}

export default function App(){
  return <Layout />
}
