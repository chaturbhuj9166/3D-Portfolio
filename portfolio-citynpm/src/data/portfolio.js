// ===========================================================================
//  Portfolio content + city layout data
//  Edit the CONTENT below to make this portfolio your own.
// ===========================================================================

// ---- Personal / portfolio content ----------------------------------------
export const PROFILE = {
  name: 'Chaturbhuj Joshi',
  role: 'Full Stack & Flutter Developer',
  email: 'joshichaturbhuj2@gmail.com',
  phone: '+91 9166423954',
  github: 'https://github.com/chaturbhuj9166',
  linkedin: 'https://www.linkedin.com/in/chaturbhuj-joshi',
  location: 'Jaipur, Rajasthan, India',
}

export const ABOUT = {
  headline: "Hi, I'm Chaturbhuj 👋",
  bio: `I'm a Full Stack & Flutter Developer who builds web applications,
Shopify stores and cross-platform mobile apps. I work across the MERN stack
(MongoDB, Express.js, React.js, Node.js) and Flutter, focusing on responsive
UIs, clean APIs and client-focused features.`,
  highlights: [
    'Full Stack & Flutter Developer Intern @ Zepfy Studio',
    'MERN stack — MongoDB, Express, React, Node',
    'Builds web apps, Shopify stores & Flutter mobile apps',
    'B.Com — Maharaja Ganga Singh University, Bikaner',
  ],
}

export const SKILLS = [
  {
    group: 'Languages',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Dart',
      'Liquid',
    ],
  },
  {
    group: 'Frameworks & Libraries',
    items: [
      'React',
      'React Native',
      'Node.js',
      'Express.js',
      'Flutter',
      'Tailwind CSS',
      'Electron.js', ],
  },
  {
    group: 'Tools & Platforms',
    items: [
      'Git',
      'GitHub',
      'Vercel',
      'Render',
      'Figma',
      'Firebase',
      'Android Studio',
      'Shopify', ],
  },
  {
    group: 'Database',
    items: [
      'MongoDB',],
  },
];

export const EXPERIENCE = [
  {
    role: 'Full Stack & Flutter Developer Intern',
    company: 'Zepfy Studio',
    period: 'Present',
    points: [
      'Developing web applications, Shopify stores and Flutter mobile apps.',
      'Implementing responsive UIs, REST APIs and client-focused features.',
    ],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Full Stack Learning',
    period: '4-month Internship',
    points: [
      'Completed a 4-month internship gaining hands-on full-stack experience.',
      'Built features using the MERN stack (MongoDB, Express, React, Node).',
    ],
  },
]

export const PROJECTS = [
  {
    title: 'MERN Stack E-commerce',
    tag: 'MERN Stack',
    desc: 'A full e-commerce web app: browse products, manage cart, place orders and secure auth, with admin-level product & order management.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    link: 'https://new-ecommerce-nhr3tjt6c-chaturbhuj-joshis-projects.vercel.app/',
  },
  {
    title: 'Desktop AI Assistant',
    tag: 'Electron + AI',
    desc: 'An AI desktop assistant that processes natural-language commands to open apps, browse websites, search and automate system tasks.',
    tech: ['Electron.js', 'Ollama', 'Node.js'],
    link: 'https://github.com/chaturbhuj9166/Dasktop-AI-Electron.js.git',
  },
  {
    title: 'Employee Attendance System',
    tag: 'Flutter + MERN',
    desc: 'Full-stack attendance tracker with role-based auth, attendance management, push notifications, profiles and admin controls.',
    tech: ['Flutter', 'Node.js', 'MongoDB', 'Firebase'],
    link: 'https://github.com/chaturbhuj9166/New-App.git',
  },
  {
    title: 'Google Search API',
    tag: 'Python + NLP',
    desc: 'A search API using FLAN-T5 that fetches real-time results, refines answers with NLP and handles general-knowledge questions.',
    tech: ['Python', 'FLAN-T5', 'NLP'],
    link: 'https://github.com/chaturbhuj9166/Google-Search-Api-Py.git',
  },
]

// ---- City layout ----------------------------------------------------------
// Grid lines are road centre-lines on both X and Z axes.
export const CITY = {
  gridLines: [-60, -30, 0, 30, 60],
  roadWidth: 8,
  blockInner: 22, // size of the raised sidewalk slab per block
  bounds: 72, // walkable half-extent
  groundSize: 320,
}

// Block centres sit at the midpoints between grid lines.
export const BLOCK_CENTERS = [-45, -15, 15, 45]

// The five interactive section buildings. `position` is [x, z]; rotation in
// radians faces the building's entrance toward the nearest road.
export const BUILDINGS = [
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    color: '#3b82f6',
    accent: '#7cc4ff',
    position: [-15, -15],
    rotation: Math.PI * 0.25,
    height: 16,
    footprint: [11, 11],
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: '⚡',
    color: '#8b5cf6',
    accent: '#c4b5fd',
    position: [15, -15],
    rotation: -Math.PI * 0.25,
    height: 22,
    footprint: [11, 11],
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: '💼',
    color: '#0ea5a4',
    accent: '#5eead4',
    position: [-15, 15],
    rotation: Math.PI * 0.75,
    height: 19,
    footprint: [11, 11],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '🚀',
    color: '#f59e0b',
    accent: '#fcd34d',
    position: [15, 15],
    rotation: -Math.PI * 0.75,
    height: 25,
    footprint: [11, 11],
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '✉️',
    color: '#ef4444',
    accent: '#fca5a5',
    position: [45, 15],
    rotation: Math.PI,
    height: 14,
    footprint: [11, 11],
  },
]

// Blocks reserved as green parks (block centre [x, z]).
export const PARKS = [
  [-45, -45],
  [45, -45],
  [-45, 45],
]

// Remaining blocks get clusters of generic skyline buildings.
const RESERVED = new Set(
  [...BUILDINGS.map((b) => b.position), ...PARKS].map((p) => p.join(',')),
)
export const GENERIC_BLOCKS = []
for (const x of BLOCK_CENTERS) {
  for (const z of BLOCK_CENTERS) {
    if (!RESERVED.has([x, z].join(','))) GENERIC_BLOCKS.push([x, z])
  }
}

export const SPAWN = [0, 0, 6]

// ---- Deterministic RNG (mulberry32) ---------------------------------------
export function makeRng(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
