import { useGame } from '../store/useGame'
import { BUILDINGS } from '../data/portfolio'

export default function Hud() {
  const near = useGame((s) => s.nearBuilding)
  const openId = useGame((s) => s.openBuilding)
  const started = useGame((s) => s.started)
  const open = useGame((s) => s.open)
  const mode = useGame((s) => s.mode)
  const toggleMode = useGame((s) => s.toggleMode)

  const building = BUILDINGS.find((b) => b.id === near)
  const showPrompt = started && building && !openId

  return (
    <>
      {/* day / night toggle */}
      {started && (
        <button className="mode-toggle" onClick={toggleMode} title="Toggle day / night">
          {mode === 'night' ? '☀️ Day' : '🌙 Night'}
        </button>
      )}

      {/* persistent controls hint */}
      {started && !openId && (
        <div className="hud-controls">
          <span><b>WASD</b> / <b>Arrows</b> Move</span>
          <span><b>Shift</b> Run</span>
          <span><b>Space</b> Jump</span>
          <span><b>Drag Mouse</b> Look</span>
          <span><b>E</b> Interact</span>
        </div>
      )}

      {/* interaction prompt */}
      {showPrompt && (
        <div className="hud-prompt">
          <div className="hud-prompt-icon">{building.icon}</div>
          <div className="hud-prompt-text">
            <strong>{building.label}</strong>
            <span>Press <kbd>E</kbd> or click to open</span>
          </div>
          <button
            className="hud-open-btn"
            style={{ background: building.accent }}
            onClick={() => {
              document.exitPointerLock?.()
              open(building.id)
            }}
          >
            Open
          </button>
        </div>
      )}
    </>
  )
}
