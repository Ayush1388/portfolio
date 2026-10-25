import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ArrowDown,
  Check,
  Code2,
  Compass,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
} from 'lucide-react'
import {
  profile,
  nav,
  projects,
  stack,
  timeline,
  developerPoints,
  explorerPoints,
} from './data'

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
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
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

function SectionHead({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="section-head">
      <div>
        <p className="label">
          <span aria-hidden>//</span> {label}
        </p>
        <h2 className="display">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-left">
        <div className="hero-inner">
          <p className="label label-on-dark">
            <span aria-hidden>//</span> {profile.role}
          </p>
          <h1 className="hero-title">
            Building reliable systems with <span className="accent">Go.</span>
          </h1>
          <p className="hero-sub">
            I'm Ayush Pandey, a final year B.Tech student who enjoys building scalable backend
            systems, exploring distributed architectures, and turning complex ideas into useful
            products.
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
        <a href="#about" className="scroll-cue label label-on-dark">
          <ArrowDown size={16} /> Scroll down
        </a>
      </div>
      <div className="hero-right" aria-hidden>
        <ul className="hero-words label">
          <li>Ideas</li>
          <li>Systems</li>
          <li>Code</li>
          <li>Impact</li>
        </ul>
        <span className="hero-dash" />
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="about-top">
          <div>
            <p className="label">
              <span aria-hidden>//</span> About me
            </p>
            <h2 className="display display-xl">About me</h2>
          </div>
          <p className="lede">
            I'm a final year B.Tech student passionate about backend systems and distributed
            architecture. I enjoy writing clean, maintainable code and building products that solve
            real problems. Currently, I'm working on AuctionEngine, a distributed live auction and
            bidding platform built in Go.
          </p>
        </div>

        <div className="about-grid">
          <article className="card">
            <span className="chip-icon"><Code2 size={20} /></span>
            <h3 className="display card-title">Developer</h3>
            <p className="muted">Focused on building reliable, scalable and efficient systems.</p>
            <ul className="checks">
              {developerPoints.map((p) => (
                <li key={p}><Check size={14} /> {p}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <span className="chip-icon"><Compass size={20} /></span>
            <h3 className="display card-title">Explorer</h3>
            <p className="muted">Always learning and building.</p>
            <ul className="checks">
              {explorerPoints.map((p) => (
                <li key={p}><Check size={14} /> {p}</li>
              ))}
            </ul>
          </article>
          <div className="orbit" aria-hidden>
            <span className="orbit-dot" />
            <p className="label">
              Curiosity<br />drives<br />better<br />systems
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const [featured, ...rest] = projects
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <SectionHead label="My work" title="My Projects">
          <a href={profile.github} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
            View all <ArrowRight size={14} />
          </a>
        </SectionHead>

        <div className="proj-grid">
          <article className="card proj proj-featured">
            <p className="featured-tag"><span className="dot" /> Featured project</p>
            <h3 className="display card-title">{featured.title}</h3>
            <p className="muted">{featured.blurb}</p>
            <ul className="tags">
              {featured.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <div className="proj-actions">
              <a href={featured.github} className="btn btn-ink btn-sm" target="_blank" rel="noreferrer">
                <Github size={14} /> View on GitHub
              </a>
            </div>
          </article>

          {rest.map((p) => (
            <article key={p.title} className="card proj">
              <a href={p.github} className="proj-ext" target="_blank" rel="noreferrer" aria-label={`${p.title} on GitHub`}>
                <ExternalLink size={16} />
              </a>
              <h3 className="display card-title">{p.title}</h3>
              <p className="muted">{p.blurb}</p>
              <ul className="tags">
                {p.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="proj-actions">
                <a href={p.github} className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
                  <Github size={14} /> View on GitHub <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead label="Tech stack" title="Tools & Technologies">
          <p className="muted side-note">Technologies I use to build, deploy and monitor scalable systems.</p>
        </SectionHead>
        <div className="stack">
          {stack.map((row) => (
            <div key={row.group} className="stack-row">
              <span className="stack-group">{row.group}</span>
              <ul className="stack-items">
                {row.items.map((i) => (
                  <li key={i.name} className={i.hot ? 'is-hot' : ''}>
                    <span className="mono-badge" style={{ background: i.color }} aria-hidden>
                      {i.name.slice(0, 1)}
                    </span>
                    {i.name}
                  </li>
                ))}
              </ul>
            </div>
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
          {timeline.map((t) => (
            <li key={t.title}>
              <span className="tl-dot" aria-hidden />
              <div className="tl-head">
                <h3>{t.title}</h3>
                <p className="muted">{t.when}</p>
              </div>
              <p className="muted tl-text">{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="label label-on-dark">
          <span aria-hidden>//</span> Get in touch
        </p>
        <div className="contact-grid">
          <div>
            <h2 className="contact-title">Let's build something great.</h2>
            <p className="contact-sub">
              I'm always open to discussing new projects, collaborations or internship
              opportunities. Feel free to reach out!
            </p>
            <a href={`mailto:${profile.email}`} className="btn btn-light">
              Send a message <ArrowRight size={16} />
            </a>
          </div>
          <ul className="contact-links">
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
          </ul>
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
  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <Navbar theme={theme} toggle={toggle} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
