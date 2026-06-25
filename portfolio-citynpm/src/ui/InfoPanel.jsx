import { useEffect, useState } from 'react'
import { useGame } from '../store/useGame'
import {
  BUILDINGS,
  PROFILE,
  ABOUT,
  SKILLS,
  EXPERIENCE,
  PROJECTS,
} from '../data/portfolio'

export default function InfoPanel() {
  const openId = useGame((s) => s.openBuilding)
  const close = useGame((s) => s.close)
  const [copied, setCopied] = useState(null)

  // copy any text to the clipboard + show a short "Copied!" confirmation
  const copy = (text) => {
    const done = () => {
      setCopied(text)
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1600)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done)
    } else {
      // fallback for non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta)
      done()
    }
  }

  // close on Escape
  useEffect(() => {
    if (!openId) return
    const onKey = (e) => {
      if (e.code === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, close])

  if (!openId) return null
  const building = BUILDINGS.find((b) => b.id === openId)

  return (
    <div className="panel-backdrop" onClick={close}>
      <div
        className="panel"
        style={{ '--accent': building.accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-head">
          <span className="panel-icon">{building.icon}</span>
          <h2>{building.label}</h2>
          <button className="panel-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="panel-body">{renderContent(openId, { copy, copied })}</div>
      </div>
    </div>
  )
}

function CopyBtn({ value, copied, copy }) {
  const active = copied === value
  return (
    <button
      className={`copy-btn ${active ? 'copied' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        copy(value)
      }}
    >
      {active ? '✓ Copied!' : '⧉ Copy'}
    </button>
  )
}

function renderContent(id, api) {
  switch (id) {
    case 'about':
      return (
        <>
          <h3 className="lead">{ABOUT.headline}</h3>
          <p className="bio">{ABOUT.bio}</p>
          <ul className="highlights">
            {ABOUT.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="muted">📍 {PROFILE.location}</p>
        </>
      )
    case 'skills':
      return (
        <div className="skills-grid">
          {SKILLS.map((g) => (
            <div key={g.group} className="skill-group">
              <h4>{g.group}</h4>
              <div className="chips">
                {g.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'experience':
      return (
        <div className="timeline">
          {EXPERIENCE.map((e) => (
            <div key={e.company} className="tl-item">
              <div className="tl-dot" />
              <div className="tl-content">
                <div className="tl-row">
                  <strong>{e.role}</strong>
                  <span className="tl-period">{e.period}</span>
                </div>
                <div className="tl-company">{e.company}</div>
                <ul>
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )
    case 'projects':
      return (
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div key={p.title} className="project-card">
              <div className="project-tag">{p.tag}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <div className="chips">
                {p.tech.map((t) => (
                  <span key={t} className="chip sm">
                    {t}
                  </span>
                ))}
              </div>
              {p.link && (
                <div className="project-foot">
                  <a className="project-url" href={p.link} target="_blank" rel="noreferrer" title={p.link}>
                    {p.link.replace(/^https?:\/\//, '')}
                  </a>
                  <div className="project-actions">
                    <a className="open-btn" href={p.link} target="_blank" rel="noreferrer">
                      Open ↗
                    </a>
                    <CopyBtn value={p.link} copied={api.copied} copy={api.copy} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    case 'contact':
      return (
        <div className="contact">
          {[
            { icon: '✉️', label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
            { icon: '📞', label: 'Phone', value: PROFILE.phone, href: `tel:${PROFILE.phone}` },
            { icon: '🐙', label: 'GitHub', value: PROFILE.github.replace(/^https?:\/\//, ''), href: PROFILE.github },
            { icon: '💼', label: 'LinkedIn', value: PROFILE.linkedin.replace(/^https?:\/\//, ''), href: PROFILE.linkedin },
          ].map((row) => (
            <div className="contact-row" key={row.label}>
              <span className="contact-ic">{row.icon}</span>
              <div className="contact-info">
                <small>{row.label}</small>
                <strong>{row.value}</strong>
              </div>
              <div className="contact-actions">
                <a className="open-btn" href={row.href} target="_blank" rel="noreferrer">
                  Open ↗
                </a>
                <CopyBtn value={row.value} copied={api.copied} copy={api.copy} />
              </div>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}
