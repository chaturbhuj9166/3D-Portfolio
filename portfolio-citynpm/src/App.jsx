import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import Experience from './game/Experience'
import Hud from './ui/Hud'
import InfoPanel from './ui/InfoPanel'
import Intro from './ui/Intro'
import { useGame } from './store/useGame'
import './App.css'

export default function App() {
  const started = useGame((s) => s.started)
  const [dpr, setDpr] = useState(1.5)

  return (
    <div className="app">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ fov: 60, near: 0.1, far: 400, position: [0, 9, 18] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onIncline={() => setDpr(1.8)} onDecline={() => setDpr(1)} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      {/* Behind-the-canvas hint, removed once the player enters (never blocks input) */}
      {!started && <div className="loading-hint">Loading the city…</div>}

      <Hud />
      <InfoPanel />
      <Intro />
    </div>
  )
}
