import { useEffect, useRef, useState } from 'react'
import type { ElementType, ReactNode } from 'react'
import {
  ArrowRight,
  ArrowDown,
  ExternalLink,
  FileText,
  GraduationCap,
  House,
  LayoutGrid,
  Layers,
  Route,
  Github,
  Linkedin,
  Database,
  Mail,
  Network,
  Webhook,
  Moon,
  Sun,
} from 'lucide-react'
import {
  profile,
  nav,
  projects,
  categories,
  stack,
  marquee,
  timeline,
  imgColors,
} from './data'
import type { Tech } from './data'

type Theme = 'light' | 'dark'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || 'light',
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))] as const
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    // Home while at the very top; otherwise the last section whose box spans the reading line.
    const update = () => {
      if (window.scrollY < 80) return setActive(ids[0])
      const line = window.innerHeight * 0.45
      let current = ids[0]
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= line && r.bottom > 0) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])
  return active
}

/** True once the element has scrolled into view (fires once). */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

function Reveal({
  children,
  delay = 0,
  as,
  className = '',
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}) {
  const Tag: ElementType = as ?? 'div'
  const [ref, seen] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Cursor-follow spotlight on every .card, via delegated pointer events. */
function useSpotlight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.card')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}

function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="progress" style={{ transform: `scaleX(${p})` }} aria-hidden />
}

const sectionIds = nav.map((n) => n.toLowerCase())

function Navbar({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  const active = useActiveSection(sectionIds)
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Primary">
        <a href="#home" className="nav-logo" aria-label="Home">
          {profile.initials}
        </a>
        <ul className="nav-links">
          {nav.map((n) => (
            <li key={n}>
              <a
                href={`#${n.toLowerCase()}`}
                className={active === n.toLowerCase() ? 'is-active' : ''}
                aria-current={active === n.toLowerCase() ? 'true' : undefined}
              >
                {n}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="icon-btn"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <a href={profile.resume} className="btn btn-ink btn-sm nav-resume">
          Resume <ArrowRight size={14} />
        </a>
      </nav>
    </header>
  )
}

const dockItems = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'projects', label: 'Work', Icon: LayoutGrid },
  { id: 'skills', label: 'Stack', Icon: Layers },
  { id: 'experience', label: 'Journey', Icon: Route },
  { id: 'contact', label: 'Contact', Icon: Mail },
]

/** Phone-only navigation: an app-style bottom dock instead of a squeezed desktop navbar. */
function MobileDock() {
  const current = useActiveSection(sectionIds)
  const active = current === 'about' ? 'home' : current
  return (
    <nav className="dock" aria-label="Sections">
      {dockItems.map(({ id, label, Icon }) => (
        <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined}>
          <Icon size={20} aria-hidden />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

function SectionHead({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="section-head">
      <div>
        <p className="label">{label}</p>
        <h2 className="display">{title}</h2>
      </div>
      {children}
    </Reveal>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-left">
        <span className="orb orb-a" aria-hidden />
        <span className="orb orb-b" aria-hidden />
        <div className="hero-grid" aria-hidden />
        <div className="hero-inner">
          <p className="label label-on-dark">{profile.role}</p>
          <h1 className="hero-title">
            Building reliable systems with <span className="accent">Go.</span>
          </h1>
          <p className="hero-sub">
            Open to internships, collaborations and interesting problems.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-light">
              View my work <ArrowRight size={16} />
            </a>
            <a href={profile.resume} className="btn btn-outline-dark" download>
              <FileText size={16} /> Download resume
            </a>
            <a href="#contact" className="btn btn-outline-dark">
              <Mail size={16} /> Contact me
            </a>
          </div>
        </div>
        <a href="#projects" className="scroll-cue label label-on-dark">
          <ArrowDown size={16} className="bob" /> Scroll down
        </a>
      </div>

      <div className="hero-right">
        <div className="hero-right-glow" aria-hidden />
        <div id="about" className="about-card card">
          <div className="about-card-top">
            <span className="avatar" aria-hidden>{profile.initials}</span>
            <div>
              <p className="label">About me</p>
              <p className="about-name">{profile.name}</p>
            </div>
          </div>
          <h2 className="display about-h">
            Hi, I build things <em>that scale.</em>
          </h2>
          <p className="muted about-p">
            B.Tech Computer Science student at {profile.university}. I'm interested in distributed
            systems, and I've been shipping projects since my second year — mostly in Go, plus
            full-stack apps and a bit of Web3 and ML.
          </p>
          <p className="edu">
            <GraduationCap size={16} /> B.Tech CS · 2024 – 2028
          </p>
          <p className="now">
            <span className="pulse" aria-hidden />
            <span>
              Currently building <strong>AuctionEngine</strong>, a distributed live auction platform in Go.
            </span>
          </p>
        </div>
        <span className="float-chip fc-1" aria-hidden>Go</span>
        <span className="float-chip fc-2" aria-hidden>Redis</span>
        <span className="float-chip fc-3" aria-hidden>Kafka</span>
        <span className="float-chip fc-4" aria-hidden>PostgreSQL</span>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden>
      <ul className="marquee-track">
        {items.map((m, i) => (
          <li key={i}>
            <span className="marquee-dot" /> {m}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Projects() {
  const [cat, setCat] = useState<(typeof categories)[number]>('All')
  const shown = projects.filter((p) => cat === 'All' || p.category === cat)
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHead label="My work" title="My Projects">
          <a href={profile.github} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
            All on GitHub <ArrowRight size={14} />
          </a>
        </SectionHead>

        <Reveal delay={60}>
          <div className="filters" role="tablist" aria-label="Filter projects">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`filter ${cat === c ? 'is-on' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
                <span className="filter-n">
                  {c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="proj-grid" key={cat}>
          {shown.map((p, i) => (
            <article
              key={p.title}
              className={`card proj pop ${p.featured && cat === 'All' ? 'proj-featured' : ''}`}
              style={{ '--d': `${i * 55}ms` } as React.CSSProperties}
            >
              <div className="proj-shot">
                {p.shot ? (
                  <img src={p.shot} alt={`${p.title} landing page`} loading="lazy" />
                ) : (
                  <div className="shot-fallback" aria-hidden>
                    <span>{p.title}</span>
                    <small>{p.tags.slice(0, 3).join(' · ')}</small>
                  </div>
                )}
              </div>
              <div className="proj-top">
                {p.featured ? (
                  <p className="featured-tag"><span className="dot" /> Featured project</p>
                ) : (
                  <p className="featured-tag">{p.category}</p>
                )}
                <a
                  href={p.demo ?? p.repo}
                  className="proj-ext"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} ${p.demo ? 'live demo' : 'on GitHub'}`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <h3 className="display card-title">{p.title}</h3>
              <p className="muted">{p.blurb}</p>
              <ul className="tags">
                {p.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="proj-actions">
                {p.demo && (
                  <a href={p.demo} className="btn btn-ink btn-sm" target="_blank" rel="noreferrer">
                    Live demo <ArrowRight size={14} />
                  </a>
                )}
                <a href={p.repo} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
                  <Github size={14} /> View on GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const lucideLogos = { db: Database, api: Webhook, design: Network }

/** Near-black brand colours vanish on the dark theme, so they follow the text colour. */
function isDarkHex(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b < 60
}

function techColor(t: Tech) {
  if (t.icon) return isDarkHex(t.icon.hex) ? 'var(--ink)' : `#${t.icon.hex}`
  if (t.img) return imgColors[t.name] ?? 'var(--ink)'
  return 'var(--muted)'
}

function TechLogo({ t }: { t: Tech }) {
  if (t.img) return <img className="logo" src={t.img} alt="" width={22} height={22} />
  if (t.icon) {
    const dark = isDarkHex(t.icon.hex)
    return (
      <svg className="logo" viewBox="0 0 24 24" width={22} height={22} aria-hidden fill={dark ? 'currentColor' : `#${t.icon.hex}`}>
        <path d={t.icon.path} />
      </svg>
    )
  }
  const L = lucideLogos[t.lucide ?? 'api']
  return <L className="logo logo-lucide" size={22} aria-hidden />
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead label="Tech stack" title="Tools & Technologies">
          <p className="muted side-note">Technologies I use to build, deploy and monitor scalable systems.</p>
        </SectionHead>
        <div className="stack">
          {stack.map((row, r) => (
            <Reveal key={row.group} delay={r * 70} className="stack-row">
              <span className="stack-group">
                {row.group}
                <small>{String(row.items.length).padStart(2, '0')}</small>
              </span>
              <ul className="stack-items">
                {row.items.map((i, n) => (
                  <li
                    key={i.name}
                    className={i.hot ? 'is-hot' : ''}
                    style={{ '--c': techColor(i), '--i': n } as React.CSSProperties}
                  >
                    <TechLogo t={i} />
                    {i.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <SectionHead label="Experience" title="Experience & Education" />
        <ol className="timeline">
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 120}>
              <span className="tl-dot" aria-hidden />
              <div className="tl-head">
                <h3>{t.title}</h3>
                <p className="tl-place">{t.place}</p>
                <p className="muted tl-when">{t.when}</p>
              </div>
              <p className="muted tl-text">{t.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <span className="orb orb-c" aria-hidden />
      <div className="wrap">
        <p className="label label-on-dark">Get in touch</p>
        <div className="contact-grid">
          <Reveal>
            <h2 className="contact-title">Let's build something great.</h2>
            <p className="contact-sub">
              I'm always open to discussing new projects, collaborations or internship
              opportunities. Feel free to reach out!
            </p>
            <a href={`mailto:${profile.email}`} className="btn btn-light">
              Send a message <ArrowRight size={16} />
            </a>
          </Reveal>
          <Reveal as="ul" delay={120} className="contact-links">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={18} /> {profile.githubLabel}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={18} /> {profile.linkedinLabel}
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`}>
                <Mail size={18} /> {profile.email}
              </a>
            </li>
          </Reveal>
        </div>
        <footer className="footer">
          <p>© 2026 {profile.name}. Built with React and a lot of coffee.</p>
          <ul>
            {nav.map((n) => (
              <li key={n}><a href={`#${n.toLowerCase()}`}>{n}</a></li>
            ))}
          </ul>
        </footer>
      </div>
    </section>
  )
}

export default function App() {
  const [theme, toggle] = useTheme()
  useSpotlight()
  return (
    <>
      <a href="#projects" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <Navbar theme={theme} toggle={toggle} />
      <MobileDock />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
