import { useEffect, useRef } from 'react'

// Tracks movement keys (WASD + arrows + shift + space) in a stable ref so the
// render loop can read them without re-rendering.
export function useKeyboard() {
  const keys = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
    run: false,
    jump: false,
  })

  useEffect(() => {
    const set = (code, val, e) => {
      const k = keys.current
      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          k.forward = val
          break
        case 'KeyS':
        case 'ArrowDown':
          k.back = val
          break
        case 'KeyA':
        case 'ArrowLeft':
          k.left = val
          break
        case 'KeyD':
        case 'ArrowRight':
          k.right = val
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          k.run = val
          break
        case 'Space':
          k.jump = val
          if (e) e.preventDefault()
          break
        default:
          return
      }
    }
    const down = (e) => set(e.code, true, e)
    const up = (e) => set(e.code, false, e)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keys
}
