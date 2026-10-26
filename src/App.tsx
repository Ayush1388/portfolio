import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Database,
  Github,
  Linkedin,
  Mail,
  Network,
  Play,
  SkipBack,
  SkipForward,
  Webhook,
  X,
} from 'lucide-react'
import { profile, projects, stack, timeline, imgColors } from './data'
import type { Project, Tech } from './data'

/* ---------------------------------------------------------------- tracks */

type Track = {
  key: string
  short: string
  kicker: string
  sub: string
  blurb: string
  shot?: string
  art: { hue: number; lines: string[] }
  links: { label: string; href: string }[]
}

const intro: Track = {
  key: 'intro',
  short: 'Ayush',
  kicker: 'Software engineer',
  sub: "SRM IST · Class of '28",
  blurb: 'B.Tech CS student building distributed systems and Web3 products. Shipping since my second year.',
  art: { hue: 22, lines: ['package main', '', 'func main() {', '  build(distributed.Systems)', '  ship(web3.OnChain)', '}'] },
  links: [
    { label: 'About me', href: '#about' },
    { label: 'Resume', href: profile.resume },
  ],
}

const toTrack = (p: Project): Track => ({
  key: p.title,
  short: p.short,
  kicker: p.category === 'Backend' ? 'Distributed systems' : p.category,
  sub: p.tags.slice(0, 3).join(' · '),
  blurb: p.blurb,
  shot: p.shot,
  art: p.art ?? { hue: 22, lines: [] },
  links: [
    ...(p.demo ? [{ label: 'Live', href: p.demo }] : []),
    ...(p.repo ? [{ label: 'Code', href: p.repo }] : []),
  ],
})

const tracks: Track[] = [intro, ...projects.map(toTrack)]
const pad = (n: number) => String(n).padStart(2, '0')
/* --------------------------------------------------------------- reveal */

function useInView<T extends HTMLElement>(threshold = 0.2) {
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
    <Tag ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

/** Headline that rises in word by word once it scrolls into view. */
function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const [ref, seen] = useInView<HTMLParagraphElement>(0.35)
  return (
    <p ref={ref} className={`words ${seen ? 'is-in' : ''} ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word" aria-hidden style={{ '--i': i } as CSSProperties}>
          <span>{w}</span>
        </span>
      ))}
    </p>
  )
}

/* ---------------------------------------------------------------- pieces */

function Badge({ text, children, className = '' }: { text: string; children?: ReactNode; className?: string }) {
  const id = `badge-${text.length}-${className}`
  return (
    <div className={`badge ${className}`}>
      <svg viewBox="0 0 120 120" className="badge-text" aria-hidden>
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      {children}
    </div>
  )
}

function Cover({ t, index }: { t: Track; index: number }) {
  return (
    <div className="cover" style={{ '--h': t.art.hue } as CSSProperties}>
      {t.shot ? (
        <img src={t.shot} alt={`${t.key} landing page`} />
      ) : (
        <div className="cover-art" aria-hidden>
          <span className="cover-glyph">{t.short.slice(0, 2)}</span>
          <pre>{t.art.lines.join('\n')}</pre>
        </div>
      )}
      <span className="cover-wear" aria-hidden />
      <span className="cover-index" aria-hidden>{pad(index)}</span>
    </div>
  )
}

/* ---------------------------------------------------------------- player */

const PHONE = '(max-width: 720px)'

function useMedia(query: string) {
  const [match, setMatch] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** Scroll distance (in viewport heights) that each track owns while the player is pinned. */
const TRACK_VH = 0.35

/** Scroll the page to the middle of a track's slice of the pinned player. */
function scrollToTrack(i: number) {
  const wrap = document.getElementById('home')
  if (!wrap) return
  const per = (wrap.offsetHeight - window.innerHeight) / tracks.length
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: wrap.offsetTop + per * (i + 0.5), behavior: reduced ? 'auto' : 'smooth' })
}

function Player({ index, setIndex }: { index: number; setIndex: (i: number) => void }) {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isPhone = useMedia(PHONE)
  const touch = useRef<{ x: number; y: number } | null>(null)
  // Direction of the latest change, so covers slide in from the matching side.
  const last = useRef(index)
  const dir = useRef(1)
  if (index !== last.current) {
    dir.current = index > last.current ? 1 : -1
    last.current = index
  }
  const n = tracks.length
  const t = tracks[index]
  const prev = tracks[(index - 1 + n) % n]
  const next = tracks[(index + 1) % n]

  // Desktop: scroll position inside the pinned section picks the track; native scrolling stays untouched.
  // Phones swipe sideways instead, so vertical scrolling simply moves down the page.
  useEffect(() => {
    if (isPhone) return
    // Cheap enough to run on every scroll event; no rAF, which Chrome throttles in background windows.
    const update = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const span = wrap.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, (window.scrollY - wrap.offsetTop) / span))
      stageRef.current?.style.setProperty('--p', String(p))
      const i = Math.min(n - 1, Math.floor(p * n))
      if (i !== last.current) setIndex(i)
    }

    // Directional settle: when a scroll gesture inside the player comes to rest, glide to the next
    // project in the direction travelled, so one light notch moves exactly one project. The wheel is
    // never blocked, and scrolling past the last project simply carries on down the page.
    const center = (i: number) => {
      const wrap = wrapRef.current!
      return wrap.offsetTop + ((wrap.offsetHeight - window.innerHeight) / n) * (i + 0.5)
    }
    let settledY = window.scrollY
    let timer = 0
    const settle = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const y = window.scrollY
      const delta = y - settledY
      const span = wrap.offsetHeight - window.innerHeight
      const inPlayer = y >= wrap.offsetTop && y <= wrap.offsetTop + span
      if (!inPlayer || Math.abs(delta) < 6) {
        settledY = y
        return
      }
      const fromIdx = Math.min(n - 1, Math.max(0, Math.floor(((settledY - wrap.offsetTop) / span) * n)))
      const here = last.current
      const target = here !== fromIdx ? here : here + Math.sign(delta)
      if (target < 0 || target > n - 1) {
        settledY = y
        return
      }
      settledY = center(target)
      window.scrollTo({ top: settledY, behavior: 'smooth' })
    }
    const onScroll = () => {
      update()
      clearTimeout(timer)
      timer = window.setTimeout(settle, 140)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [n, setIndex, isPhone])

  const go = useCallback(
    (step: number) => {
      const i = Math.min(n - 1, Math.max(0, last.current + step))
      if (isPhone) setIndex(i)
      else scrollToTrack(i)
    },
    [n, isPhone, setIndex],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const wrap = wrapRef.current
      if (!wrap || e.target instanceof HTMLInputElement) return
      const inPlayer = window.scrollY >= wrap.offsetTop - 10 && window.scrollY <= wrap.offsetTop + wrap.offsetHeight - window.innerHeight
      if (!inPlayer) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const seg = 100 / n

  return (
    <section
      id="home"
      ref={wrapRef}
      className="player"
      style={{ '--tracks': n, '--track-vh': TRACK_VH } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="Projects player. Scroll to change project."
    >
      <div
        ref={stageRef}
        className={`stage ${dir.current > 0 ? 'fwd' : 'back'}`}
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          const start = touch.current
          touch.current = null
          if (!isPhone || !start) return
          const dx = e.changedTouches[0].clientX - start.x
          const dy = e.changedTouches[0].clientY - start.y
          if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
        }}
      >
        {index > 0 && <span className="ghost ghost-l" key={`gl-${prev.key}`} aria-hidden>{prev.short}</span>}
        {index < n - 1 && <span className="ghost ghost-r" key={`gr-${next.key}`} aria-hidden>{next.short}</span>}

        <div className="deck" key={t.key} aria-live="polite">
          <Cover t={t} index={index + 1} />
          <h1 className="track-title" style={{ '--len': t.short.length } as CSSProperties} aria-label={t.short}>
            {t.short.split('').map((c, i) => (
              <span key={i} aria-hidden style={{ '--i': i } as CSSProperties}>{c}</span>
            ))}
          </h1>
          <div className="track-meta">
            <p className="kicker">{t.kicker}</p>
            <p className="sub">{t.sub}</p>
            <p className="blurb">{t.blurb}</p>
            <div className="track-links">
              {t.links.map((l) => (
                <a key={l.label} href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {l.label} <ArrowUpRight size={14} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Badge text={index < n - 1 ? 'NEXT ✦ SCROLL FOR THE NEXT PROJECT ✦ ' : 'THAT’S ALL ✦ KEEP SCROLLING ✦ '} className="next-badge">
          <button
            className="badge-btn"
            onClick={() => (index < n - 1 ? go(1) : document.getElementById('about')?.scrollIntoView())}
            aria-label={index < n - 1 ? `Next: ${next.short}` : 'Continue to About'}
          >
            {index < n - 1 ? <SkipForward size={18} /> : <ArrowDown size={18} />}
          </button>
          <svg viewBox="0 0 120 120" className="ring" aria-hidden>
            <circle cx="60" cy="60" r="34" pathLength={100} className="ring-fill" />
          </svg>
        </Badge>

        {index === 0 && (
          <p className="scroll-hint" aria-hidden>
            <span className="scroll-hint-line" /> Scroll to play
          </p>
        )}
        <p className="swipe-hint" aria-hidden>
          <span>←</span> Swipe for projects <span>→</span>
        </p>
        <a href="#about" className="skip-player">
          Skip to about <ArrowDown size={13} aria-hidden />
        </a>

        <div className="console">
          <svg className="arc" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
            <path d="M10,58 Q200,-40 390,58" pathLength={100} className="arc-track" />
            <path
              d="M10,58 Q200,-40 390,58"
              pathLength={100}
              className="arc-seg"
              style={{ strokeDasharray: `${seg} ${100 - seg}`, strokeDashoffset: -index * seg }}
            />
          </svg>
          <p className="mini-title" aria-hidden>
            <span>{pad(index + 1)}</span> {t.short}
          </p>
          <div className="console-row">
            <button onClick={() => go(-1)} disabled={index === 0} aria-label={`Previous: ${prev.short}`}>
              <SkipBack size={16} />
            </button>
            <button className="menu-btn" onClick={() => document.dispatchEvent(new Event('open-menu'))}>
              Menu
            </button>
            <button onClick={() => go(1)} disabled={index === n - 1} aria-label={`Next: ${next.short}`}>
              <SkipForward size={16} />
            </button>
          </div>
          <span className="counter" aria-hidden>
            {pad(index + 1)} / {pad(n)}
          </span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ menu */

const sections = [
  ['Player', '#home'],
  ['About', '#about'],
  ['Work', '#work'],
  ['Stack', '#stack'],
  ['Journey', '#journey'],
  ['Contact', '#contact'],
] as const

function Menu({ onPick }: { onPick: (i: number) => void }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const show = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('open-menu', show)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('open-menu', show)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) closeRef.current?.focus()
  }, [open])

  return (
    <div className={`menu ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
      <button ref={closeRef} className="menu-close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
        Close <X size={16} />
      </button>
      <nav className="menu-nav" aria-label="Sections">
        {sections.map(([label, href], i) => (
          <a key={href} href={href} onClick={() => setOpen(false)} style={{ '--i': i } as CSSProperties} tabIndex={open ? 0 : -1}>
            <small>{pad(i + 1)}</small>
            {label}
          </a>
        ))}
      </nav>
      <div className="menu-side">
        <p className="label">Tracklist</p>
        <ol>
          {tracks.map((t, i) => (
            <li key={t.key}>
              <button
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setOpen(false)
                  setTimeout(() => onPick(i), 80)
                }}
              >
                <span>{pad(i + 1)}</span> {t.key === 'intro' ? 'Intro' : t.key}
              </button>
            </li>
          ))}
        </ol>
        <p className="label">Elsewhere</p>
        <p className="menu-links">
          <a href={profile.github} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>LinkedIn</a>
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1}>Email</a>
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- sections */

function Head({ title }: { title: string }) {
  return (
    <Reveal className="head">
      <h2 className="h2">{title}</h2>
    </Reveal>
  )
}

function About() {
  const facts = [
    ['Studying', `B.Tech CS · ${profile.university}`],
    ['Class of', '2024 – 2028'],
    ['Building since', 'My second year'],
    ['Now playing', 'AuctionEngine, a distributed live auction engine'],
  ]
  return (
    <section id="about" className="section">
      <div className="wrap">
        <WordReveal
          className="statement"
          text="I'm Ayush. I build distributed systems in Go and Web3 products that settle on-chain."
        />
        <dl className="facts">
          {facts.map(([k, v], i) => (
            <Reveal key={k} delay={i * 90} className="fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Work({ onPick }: { onPick: (i: number) => void }) {
  const [hover, setHover] = useState<number | null>(null)
  const peek = useRef<HTMLDivElement>(null)
  return (
    <section id="work" className="section">
      <div className="wrap">
        <Head title="Selected work" />
        <ol
          className="tracklist"
          onMouseMove={(e) => {
            peek.current?.style.setProperty('--x', `${e.clientX}px`)
            peek.current?.style.setProperty('--y', `${e.clientY}px`)
          }}
          onMouseLeave={() => setHover(null)}
        >
          {projects.map((p, i) => {
            const t = tracks[i + 1]
            return (
              <Reveal as="li" key={p.title} delay={i * 60}>
                <button
                  className="row"
                  onMouseEnter={() => setHover(i + 1)}
                  onFocus={() => setHover(i + 1)}
                  onClick={() => onPick(i + 1)}
                  aria-label={`Play ${p.title} in the player`}
                >
                  <span className="row-n">{pad(i + 2)}</span>
                  <span className="row-thumb" aria-hidden>
                    <Cover t={t} index={i + 2} />
                  </span>
                  <span className="row-title">{p.title}</span>
                  <span className="row-cat">{p.category}</span>
                  <span className="row-tags">{p.tags.slice(0, 3).join(' · ')}</span>
                  <Play className="row-play" size={16} aria-hidden />
                </button>
              </Reveal>
            )
          })}
        </ol>
      </div>
      <div ref={peek} className={`peek ${hover !== null ? 'is-on' : ''}`} aria-hidden>
        {hover !== null && <Cover t={tracks[hover]} index={hover + 1} />}
      </div>
    </section>
  )
}

const lucideLogos = { db: Database, api: Webhook, design: Network }

function isDarkHex(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b < 60
}

function techColor(t: Tech) {
  if (t.icon) return isDarkHex(t.icon.hex) ? '#f1ede6' : `#${t.icon.hex}`
  if (t.img) return imgColors[t.name] ?? '#f1ede6'
  return '#9a958c'
}

function TechLogo({ t }: { t: Tech }) {
  if (t.img) return <img className="logo" src={t.img} alt="" width={22} height={22} />
  if (t.icon)
    return (
      <svg className="logo" viewBox="0 0 24 24" width={22} height={22} aria-hidden fill={techColor(t)}>
        <path d={t.icon.path} />
      </svg>
    )
  const L = lucideLogos[t.lucide ?? 'api']
  return <L className="logo" size={22} aria-hidden color={techColor(t)} />
}

function Stack() {
  return (
    <section id="stack" className="section">
      <div className="wrap">
        <Head title="The stack" />
      </div>
      <div className="lanes">
        {stack.map((row, r) => (
          <Reveal key={row.group} delay={r * 80} className={`lane ${r % 2 ? 'rev' : ''}`}>
            <span className="lane-name">{row.group}</span>
            <div className="lane-viewport">
              <ul className="lane-track" style={{ '--speed': `${26 + row.items.length * 3}s` } as CSSProperties}>
                {[...row.items, ...row.items, ...row.items, ...row.items].map((t, i) => (
                  <li
                    key={i}
                    className={t.hot ? 'is-hot' : ''}
                    style={{ '--c': techColor(t) } as CSSProperties}
                    aria-hidden={i >= row.items.length}
                  >
                    <TechLogo t={t} />
                    {t.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Journey() {
  const years = ['2024', '2025', 'Now']
  return (
    <section id="journey" className="section">
      <div className="wrap">
        <Head title="Journey" />
        <ol className="journey">
          {timeline.map((t, i) => (
            <Reveal as="li" key={t.title} delay={i * 110}>
              <span className="j-year" aria-hidden>{years[i]}</span>
              <div>
                <p className="j-when">{t.when}</p>
                <h3>{t.title}</h3>
                <p className="j-place">{t.place}</p>
                <p className="j-text">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="wrap">
        <a className="talk" href={`mailto:${profile.email}`}>
          <span className="talk-line">Let's</span>
          <span className="talk-line talk-out">talk</span>
          <Badge text="OPEN TO INTERNSHIPS ✦ SAY HELLO ✦ " className="talk-badge">
            <ArrowUpRight size={22} aria-hidden />
          </Badge>
        </a>
        <div className="contact-grid">
          <a href={`mailto:${profile.email}`}>
            <Mail size={18} aria-hidden /> {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            <Github size={18} aria-hidden /> {profile.githubLabel}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={18} aria-hidden /> {profile.linkedinLabel}
          </a>
        </div>
        <footer className="footer">
          <p>© 2026 {profile.name}</p>
          <p>Built with React, Go energy and a lot of coffee.</p>
        </footer>
      </div>
    </section>
  )
}

function TopBar() {
  return (
    <header className="top">
      <a href="#home" className="brand" aria-label="Home">
        <span className="brand-sq" aria-hidden /> AP.
      </a>
      <nav className="top-links" aria-label="Primary">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
        <a href={profile.resume} className="top-resume">Resume</a>
      </nav>
    </header>
  )
}

export default function App() {
  const [index, setIndex] = useState(0)
  const pick = (i: number) => {
    if (matchMedia(PHONE).matches) {
      setIndex(i)
      document.getElementById('home')?.scrollIntoView()
    } else scrollToTrack(i)
  }
  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <div className="grain" aria-hidden />
      <TopBar />
      <Menu onPick={pick} />
      <main>
        <Player index={index} setIndex={setIndex} />
        <About />
        <Work onPick={pick} />
        <Stack />
        <Journey />
        <Contact />
      </main>
    </>
  )
}
