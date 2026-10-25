// Everything you'd want to edit lives here.
export const profile = {
  name: 'Ayush Pandey',
  initials: 'AP',
  role: 'Software engineering student',
  github: 'https://github.com/Ayush1388',
  githubLabel: 'github.com/Ayush1388',
  linkedin: 'https://linkedin.com/in/ayush-pandey',
  linkedinLabel: 'linkedin.com/in/ayush-pandey',
  email: 'ayushpandey.dev@gmail.com',
  resume: '/resume.pdf',
}

export const nav = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact']

export const projects = [
  {
    title: 'AuctionEngine',
    featured: true,
    blurb:
      'A distributed live auction and bidding engine built in Go with real-time bidding, a wallet system, and a scalable architecture.',
    tags: ['Go', 'PostgreSQL', 'Redis', 'WebSockets', 'Kafka', 'Elasticsearch', 'Docker'],
    github: 'https://github.com/Ayush1388',
    demo: '',
  },
  {
    title: 'Search & Discovery',
    blurb: 'Full-text search with Elasticsearch, caching, and optimized queries.',
    tags: ['Go', 'Elasticsearch', 'Redis'],
    github: 'https://github.com/Ayush1388',
  },
  {
    title: 'Auth & User Service',
    blurb: 'JWT based authentication, rate limiting, and user management.',
    tags: ['Go', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/Ayush1388',
  },
]

export const stack: { group: string; items: { name: string; color: string; hot?: boolean }[] }[] = [
  {
    group: 'Languages',
    items: [
      { name: 'Go', color: '#00ADD8', hot: true },
      { name: 'SQL', color: '#64748b' },
      { name: 'JavaScript', color: '#f0c808' },
      { name: 'TypeScript', color: '#3178c6' },
    ],
  },
  {
    group: 'Backend & Data',
    items: [
      { name: 'PostgreSQL', color: '#336791' },
      { name: 'Redis', color: '#dc382d' },
      { name: 'Elasticsearch', color: '#f0a30a' },
      { name: 'Kafka', color: '#555555' },
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

export const timeline = [
  {
    title: 'B.Tech in Computer Science',
    when: '2022 – 2026',
    text: 'Final year student, focusing on backend systems, distributed architecture and scalable software.',
  },
  {
    title: 'Personal Projects',
    when: '2023 – Present',
    text: 'Building and deploying real-world products, including AuctionEngine and other tools.',
  },
  {
    title: 'Open Source & Learning',
    when: 'Ongoing',
    text: 'Exploring distributed systems, system design and new technologies.',
  },
]

export const developerPoints = [
  'Backend development (Go)',
  'Distributed systems',
  'APIs & microservices',
  'Databases & caching',
  'System design & scalability',
]

export const explorerPoints = [
  'Open source & side projects',
  'Exploring new technologies',
  'Product-focused mindset',
  'Clean and maintainable code',
  'Continuous learning',
]
