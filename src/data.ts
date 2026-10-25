// Everything you'd want to edit lives here.
export const profile = {
  name: 'Ayush Pandey',
  initials: 'AP',
  role: 'Software engineering student',
  university: 'SRM Institute of Science and Technology, Delhi NCR Campus',
  github: 'https://github.com/Ayush1388',
  githubLabel: 'github.com/Ayush1388',
  linkedin: 'https://linkedin.com/in/ayush-pandey',
  linkedinLabel: 'linkedin.com/in/ayush-pandey',
  email: 'ayushpandey.dev@gmail.com',
  resume: '/resume.pdf',
}

export const nav = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact']

export type Category = 'Backend' | 'Full-stack' | 'Web3' | 'ML'

export type Project = {
  title: string
  category: Category
  blurb: string
  tags: string[]
  repo: string
  demo?: string
  featured?: boolean
}

const gh = (repo: string) => `https://github.com/Ayush1388/${repo}`

export const projects: Project[] = [
  {
    title: 'AuctionEngine',
    category: 'Backend',
    featured: true,
    blurb:
      'A distributed live auction and bidding engine built in Go with real-time bidding, a wallet system, and a scalable architecture.',
    tags: ['Go', 'PostgreSQL', 'Redis', 'WebSockets', 'Kafka', 'Elasticsearch', 'Docker'],
    repo: gh('auctionEngine'),
    demo: 'https://auctionengine-frontend.vercel.app',
  },
  {
    title: 'Log Aggregator',
    category: 'Backend',
    blurb:
      'A high-throughput, self-hosted observability pipeline and log aggregator built with Go, PostgreSQL, and React.',
    tags: ['Go', 'PostgreSQL', 'React'],
    repo: gh('log-aggregator'),
  },
  {
    title: 'Snippetbox',
    category: 'Backend',
    blurb: 'A server-rendered Go web application for creating, storing and sharing code snippets.',
    tags: ['Go'],
    repo: gh('snippetbox'),
  },
  {
    title: 'InternHunt',
    category: 'Full-stack',
    blurb: 'A web platform to discover and track internship opportunities in one place.',
    tags: ['JavaScript'],
    repo: gh('InternHunt'),
    demo: 'https://internhunt-liart.vercel.app',
  },
  {
    title: 'CivicMap',
    category: 'Full-stack',
    blurb: 'An interactive, map-based web app for exploring and reporting civic issues.',
    tags: ['JavaScript'],
    repo: gh('CIVICMAP'),
    demo: 'https://civicmap.vercel.app',
  },
  {
    title: 'Food Delivery',
    category: 'Full-stack',
    blurb: 'A food delivery website with a browsable menu and a smooth ordering experience.',
    tags: ['JavaScript'],
    repo: gh('Food_Delivery'),
    demo: 'https://food-delivery-hazel-alpha.vercel.app',
  },
  {
    title: 'Spring',
    category: 'Backend',
    blurb: 'Exploring backend development with the Java Spring framework.',
    tags: ['Java', 'Spring'],
    repo: gh('spring'),
  },
  {
    title: 'HD Wallet',
    category: 'Web3',
    blurb:
      'A simple crypto wallet interface built with React, TailwindCSS, Ethers.js, Solana Web3.js, and Bip39.',
    tags: ['React', 'Tailwind', 'Ethers.js', 'Solana', 'Bip39'],
    repo: gh('HDWallet'),
  },
  {
    title: 'Decentralized Freelancing',
    category: 'Web3',
    blurb: 'A decentralized freelancing platform that connects clients and freelancers on-chain.',
    tags: ['JavaScript', 'Web3'],
    repo: gh('decentralizedFrellancingPlatform'),
  },
  {
    title: 'Web3 Cohort',
    category: 'Web3',
    blurb: 'Hands-on projects and notes from learning blockchain and Web3 development.',
    tags: ['JavaScript', 'Web3'],
    repo: gh('web3cohort'),
  },
  {
    title: 'Fake News Detection',
    category: 'ML',
    blurb: 'A machine learning model that classifies news articles as real or fake.',
    tags: ['Python', 'ML', 'NLP'],
    repo: gh('fakeNewsDetection'),
  },
  {
    title: 'This Portfolio',
    category: 'Full-stack',
    blurb: 'The site you are looking at, built with React, TypeScript and Vite.',
    tags: ['TypeScript', 'React', 'Vite'],
    repo: gh('portfolio'),
    demo: 'https://portfolio-six-bice-24.vercel.app',
  },
]

export const categories: ('All' | Category)[] = ['All', 'Backend', 'Full-stack', 'Web3', 'ML']

export const stats = [
  { value: projects.length, suffix: '+', label: 'Projects built' },
  { value: projects.filter((p) => p.demo).length, suffix: '', label: 'Live deployments' },
  { value: 2, suffix: '+', label: 'Years building' },
  { value: 2028, suffix: '', label: 'Graduating', plain: true },
]

export const stack: { group: string; items: { name: string; color: string; hot?: boolean }[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'Go', color: '#00ADD8', hot: true },
      { name: 'SQL', color: '#64748b' },
      { name: 'JavaScript', color: '#d4a800' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Python', color: '#3776ab' },
      { name: 'Java', color: '#e76f00' },
    ],
  },
  {
    group: 'Backend & Data',
    items: [
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Redis', color: '#dc382d' },
      { name: 'Elasticsearch', color: '#f0a30a' },
      { name: 'Kafka', color: '#555555' },
      { name: 'Spring', color: '#6db33f' },
    ],
  },
  {
    group: 'Frontend & Web3',
    items: [
      { name: 'React', color: '#149eca' },
      { name: 'Tailwind', color: '#0ea5b7' },
      { name: 'Ethers.js', color: '#5b5bd6' },
      { name: 'Solana', color: '#9945ff' },
    ],
  },
  {
    group: 'DevOps & Tools',
    items: [
      { name: 'Docker', color: '#2496ed' },
      { name: 'Linux', color: '#444444' },
      { name: 'Nginx', color: '#009639' },
      { name: 'Git', color: '#f05032' },
      { name: 'GitHub', color: '#24292f' },
      { name: 'Caddy', color: '#1f88c0' },
    ],
  },
  {
    group: 'Others',
    items: [
      { name: 'REST APIs', color: '#2f80ed' },
      { name: 'WebSockets', color: '#e8590c' },
      { name: 'System Design', color: '#555555' },
      { name: 'VS Code', color: '#007acc' },
      { name: 'Postman', color: '#ff6c37' },
    ],
  },
]

export const marquee = [
  'Go', 'PostgreSQL', 'Redis', 'Kafka', 'Elasticsearch', 'WebSockets', 'Docker',
  'React', 'TypeScript', 'Python', 'Java', 'Ethers.js', 'Solana', 'Nginx', 'Linux',
]

export const timeline = [
  {
    title: 'B.Tech in Computer Science',
    place: 'SRM Institute of Science and Technology, Delhi NCR Campus',
    when: '2024 – 2028',
    text: 'Studying computer science with a focus on backend systems, distributed architecture and scalable software.',
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
    text: 'Exploring distributed systems, system design and new technologies.',
  },
]
