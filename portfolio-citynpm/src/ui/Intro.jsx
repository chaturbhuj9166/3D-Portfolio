import { useState } from 'react'
import { useGame } from '../store/useGame'
import { PROFILE } from '../data/portfolio'

export default function Intro() {
  const started = useGame((s) => s.started)
  const start = useGame((s) => s.start)
  const [hide, setHide] = useState(false)

  if (started && hide) return null

  return (
    <div className={`intro ${started ? 'intro-out' : ''}`} onTransitionEnd={() => started && setHide(true)}>
      <div className="intro-card">
        <div className="intro-badge">PORTFOLIO</div>
        <h1>{PROFILE.name}</h1>
        <p className="intro-role">{PROFILE.role}</p>
        <p className="intro-desc">
          Walk through my interactive 3D city. Visit each building to explore my
          profile, skills, experience, projects and contact details.
        </p>
        <div className="intro-keys">
          <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / Arrows — Move</div>
          <div><kbd>Shift</kbd> — Run &nbsp; <kbd>Space</kbd> — Jump</div>
          <div><kbd>Drag Mouse</kbd> — Look up / down / around &nbsp; <kbd>E</kbd> — Interact</div>
        </div>
        <button className="intro-btn" onClick={start}>
          ▶ Enter the City
        </button>
        <p className="intro-tip">Hold the left mouse button and drag to rotate the camera</p>
      </div>
    </div>
  )
}
