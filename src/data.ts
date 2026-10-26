import type { SimpleIcon } from 'simple-icons'
import {
  siApachekafka, siC, siCaddy, siCplusplus, siDocker, siElasticsearch, siEthers, siGit, siGithub,
  siGo, siLinux, siNginx, siPostgresql, siPostman, siPython, siReact, siRedis, siSocketdotio,
  siSolana, siTailwindcss,
} from 'simple-icons'

// Everything you'd want to edit lives here.
export const profile = {
  name: 'Ayush Pandey',
  initials: 'AP',
  role: 'Software engineering student',
  university: 'SRM Institute of Science and Technology, Delhi NCR Campus',
  github: 'https://github.com/Ayush1388',
  githubLabel: 'github.com/Ayush1388',
  linkedin: 'https://www.linkedin.com/in/ayush-pandey-662a4037b/',
  linkedinLabel: 'linkedin.com/in/ayush-pandey-662a4037b',
  email: 'ayushcan1388@gmail.com',
  resume: '/resume.pdf',
}

export const nav = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact']

export type Category = 'Backend' | 'Full-stack' | 'Web3' | 'ML'

export type Project = {
  title: string
  category: Category
  blurb: string
  tags: string[]
  repo?: string
  demo?: string
  shot?: string
  featured?: boolean
  /** Giant title on the player stage — keep it short. */
  short: string
  /** Generated cover art for projects without a live screenshot. */
  art?: { hue: number; lines: string[] }
}

const gh = (repo: string) => `https://github.com/Ayush1388/${repo}`

export const projects: Project[] = [
  {
    title: 'AuctionEngine',
    short: 'Auction',
    category: 'Backend',
    featured: true,
    blurb:
      'A distributed live auction and bidding engine built in Go with real-time bidding, a wallet system, and a scalable architecture.',
    tags: ['Go', 'PostgreSQL', 'Redis', 'WebSockets', 'Kafka', 'Elasticsearch', 'Docker'],
    repo: gh('auctionEngine'),
    demo: 'https://auctionengine-frontend.vercel.app',
    shot: '/shots/auctionengine.jpg',
  },
  {
    title: 'Vaultline',
    short: 'Vaultline',
    category: 'Web3',
    blurb: 'Fractional ownership of real-world assets (real estate, art, vehicles and invoices) tokenized and settled on-chain.',
    tags: ['Ethereum', 'RWA', 'Tokenization'],
    demo: 'https://vaultline-rwa.vercel.app',
    shot: '/shots/vaultline.jpg',
  },
  {
    title: 'Log Aggregator',
    short: 'Logs',
    category: 'Backend',
    blurb:
      'A high-throughput, self-hosted observability pipeline and log aggregator built with Go, PostgreSQL, and React.',
    tags: ['Go', 'PostgreSQL', 'React'],
    repo: gh('log-aggregator'),
    demo: 'https://log-aggregator-pml5.onrender.com/',
    shot: '/shots/logs.jpg',
  },
  {
    title: 'Blockchain Picture House',
    short: 'PictureHouse',
    category: 'Web3',
    blurb: 'A decentralized freelancing platform: hire developers and pay in USDC. Funds sit in escrow and release when each milestone is approved.',
    tags: ['Ethereum', 'USDC escrow', 'JavaScript'],
    repo: gh('decentralizedFrellancingPlatform'),
    demo: 'https://decentralized-frellancing-platform.vercel.app',
    shot: '/shots/freelancing.jpg',
  },
  {
    title: 'Rumour Desk',
    short: 'RumourDesk',
    category: 'ML',
    blurb: 'Checks whether a tweet looks like a true, false or unverified rumour from its text and how it spread, using a graph-enhanced stacked ensemble trained on Twitter15/16.',
    tags: ['Python', 'ML', 'Graph features'],
    repo: gh('fakeNewsDetection'),
    demo: 'https://rumour-desk.onrender.com',
    shot: '/shots/rumourdesk.jpg',
  },
  {
    title: 'HD Wallet',
    short: 'Wallet',
    category: 'Web3',
    blurb:
      'A simple crypto wallet interface built with React, TailwindCSS, Ethers.js, Solana Web3.js, and Bip39.',
    tags: ['React', 'Tailwind', 'Ethers.js', 'Solana', 'Bip39'],
    repo: gh('HDWallet'),
    demo: 'https://hd-wallet-yoet.vercel.app/',
    shot: '/shots/hdwallet.jpg',
  },
  {
    title: 'InternHunt',
    short: 'InternHunt',
    category: 'Full-stack',
    blurb: 'A web platform to discover and track internship opportunities in one place.',
    tags: ['JavaScript'],
    repo: gh('InternHunt'),
    demo: 'https://internhunt-liart.vercel.app',
    shot: '/shots/internhunt.jpg',
  },
  {
    title: 'Food Delivery',
    short: 'Tomato',
    category: 'Full-stack',
    blurb: 'A food delivery website with a browsable menu and a smooth ordering experience.',
    tags: ['JavaScript'],
    repo: gh('Food_Delivery'),
    demo: 'https://food-delivery-hazel-alpha.vercel.app',
    shot: '/shots/fooddelivery.jpg',
  },
]

export const categories: ('All' | Category)[] = ['All', 'Backend', 'Full-stack', 'Web3', 'ML']

export const imgColors: Record<string, string> = { JavaScript: '#f7df1e', TypeScript: '#3178c6', 'VS Code': '#007acc' }

export type Tech = { name: string; icon?: SimpleIcon; img?: string; lucide?: 'db' | 'api' | 'design'; hot?: boolean }

export const stack: { group: string; items: Tech[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'Go', icon: siGo, hot: true },
      { name: 'C', icon: siC },
      { name: 'C++', icon: siCplusplus },
      { name: 'Python', icon: siPython },
      { name: 'JavaScript', img: '/logos/javascript.svg' },
      { name: 'TypeScript', img: '/logos/typescript.svg' },
      { name: 'SQL', lucide: 'db' },
    ],
  },
  {
    group: 'Backend & Data',
    items: [
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'Redis', icon: siRedis },
      { name: 'Elasticsearch', icon: siElasticsearch },
      { name: 'Kafka', icon: siApachekafka },
    ],
  },
  {
    group: 'Frontend & Web3',
    items: [
      { name: 'React', icon: siReact },
      { name: 'Tailwind', icon: siTailwindcss },
      { name: 'Ethers.js', icon: siEthers },
      { name: 'Solana', icon: siSolana },
    ],
  },
  {
    group: 'DevOps & Tools',
    items: [
      { name: 'Docker', icon: siDocker },
      { name: 'Linux', icon: siLinux },
      { name: 'Nginx', icon: siNginx },
      { name: 'Git', icon: siGit },
      { name: 'GitHub', icon: siGithub },
      { name: 'Caddy', icon: siCaddy },
    ],
  },
  {
    group: 'Others',
    items: [
      { name: 'REST APIs', lucide: 'api' },
      { name: 'WebSockets', icon: siSocketdotio },
      { name: 'System Design', lucide: 'design' },
      { name: 'VS Code', img: '/logos/vscode.svg' },
      { name: 'Postman', icon: siPostman },
    ],
  },
]

export const marquee = [
  'Go', 'Distributed Systems', 'Web3', 'PostgreSQL', 'Redis', 'Kafka', 'Elasticsearch', 'WebSockets', 'Docker',
  'C', 'C++', 'React', 'TypeScript', 'Python', 'Ethers.js', 'Solana', 'Nginx', 'Linux',
]

export const timeline = [
  {
    title: 'B.Tech in Computer Science',
    place: 'SRM Institute of Science and Technology, Delhi NCR Campus',
    when: '2024 – 2028',
    text: 'Studying computer science with a focus on distributed systems, Web3 and scalable software.',
  },
  {
    title: 'Building Projects',
    place: 'Personal & open source',
    when: '2nd year – Present',
    text: 'Shipping real-world products since my second year, from AuctionEngine and a log aggregator to Web3 apps and full-stack platforms.',
  },
  {
    title: 'Open Source & Learning',
    place: 'Self-directed',
    when: 'Ongoing',
    text: 'Exploring distributed systems, Web3, system design and new technologies.',
  },
]
