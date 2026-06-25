import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Stylised low-poly young developer. All limbs pivot from refs so the rig can
// be animated procedurally (idle / walk / run / jump) from `anim.current`.
//
//   anim.current = { mode: 'idle'|'walk'|'run'|'jump', speed: number, grounded: bool, air: number }
//
export default function Character({ anim }) {
  const lLeg = useRef()
  const rLeg = useRef()
  const lArm = useRef()
  const rArm = useRef()
  const torso = useRef()
  const head = useRef()
  const stride = useRef(0)

  useFrame((_, delta) => {
    const a = anim.current
    const dt = Math.min(delta, 0.05)
    const moving = a.mode === 'walk' || a.mode === 'run'
    const freq = a.mode === 'run' ? 11 : 7
    stride.current += dt * (moving ? freq : 2)
    const s = stride.current

    if (!lLeg.current) return

    if (!a.grounded) {
      // ---- jump / airborne tuck ----
      const tuck = THREE.MathUtils.clamp(a.air, 0, 1)
      lLeg.current.rotation.x = -0.6 * tuck - 0.2
      rLeg.current.rotation.x = -0.9 * tuck
      lArm.current.rotation.x = -1.6 * tuck
      rArm.current.rotation.x = -1.6 * tuck
      lArm.current.rotation.z = 0.25
      rArm.current.rotation.z = -0.25
      torso.current.rotation.x = 0.15
      head.current.rotation.x = -0.1
      torso.current.position.y = 0
    } else if (moving) {
      // ---- walk / run ----
      const amp = a.mode === 'run' ? 0.95 : 0.55
      const swing = Math.sin(s) * amp
      lLeg.current.rotation.x = swing
      rLeg.current.rotation.x = -swing
      lArm.current.rotation.x = -swing * 0.9
      rArm.current.rotation.x = swing * 0.9
      lArm.current.rotation.z = 0.12
      rArm.current.rotation.z = -0.12
      torso.current.rotation.x = a.mode === 'run' ? 0.28 : 0.12
      head.current.rotation.x = a.mode === 'run' ? -0.18 : -0.06
      torso.current.position.y = Math.abs(Math.sin(s)) * (a.mode === 'run' ? 0.09 : 0.05)
    } else {
      // ---- idle breathing ----
      const b = Math.sin(s) * 0.05
      lLeg.current.rotation.x = 0
      rLeg.current.rotation.x = 0
      lArm.current.rotation.x = b * 0.4
      rArm.current.rotation.x = -b * 0.4
      lArm.current.rotation.z = 0.1 + b * 0.1
      rArm.current.rotation.z = -0.1 - b * 0.1
      torso.current.rotation.x = 0
      head.current.rotation.x = Math.sin(s * 0.7) * 0.05
      torso.current.position.y = b * 0.3
    }
  })

  const skin = '#e8b48f'
  const hoodie = '#3b82f6'
  const hoodieDark = '#2563eb'
  const jeans = '#2f3b52'
  const shoe = '#1f2937'
  const hair = '#3a2a1d'

  return (
    <group>
      {/* ---- Legs (pivot at hips) ---- */}
      <group ref={lLeg} position={[0.16, 0.82, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.24, 0.8, 0.26]} />
          <meshStandardMaterial color={jeans} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.84, 0.05]} castShadow>
          <boxGeometry args={[0.26, 0.16, 0.42]} />
          <meshStandardMaterial color={shoe} roughness={0.6} />
        </mesh>
      </group>
      <group ref={rLeg} position={[-0.16, 0.82, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.24, 0.8, 0.26]} />
          <meshStandardMaterial color={jeans} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.84, 0.05]} castShadow>
          <boxGeometry args={[0.26, 0.16, 0.42]} />
          <meshStandardMaterial color={shoe} roughness={0.6} />
        </mesh>
      </group>

      {/* ---- Torso (everything above the hips) ---- */}
      <group ref={torso} position={[0, 0.82, 0]}>
        {/* hoodie body */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.66, 0.78, 0.4]} />
          <meshStandardMaterial color={hoodie} roughness={0.85} />
        </mesh>
        {/* hood */}
        <mesh position={[0, 0.72, -0.13]} castShadow>
          <boxGeometry args={[0.5, 0.22, 0.2]} />
          <meshStandardMaterial color={hoodieDark} roughness={0.85} />
        </mesh>
        {/* drawstring detail */}
        <mesh position={[0, 0.55, 0.21]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#dfe6f3" />
        </mesh>
        {/* backpack */}
        <mesh position={[0, 0.34, -0.28]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.18]} />
          <meshStandardMaterial color="#10b981" roughness={0.8} />
        </mesh>

        {/* ---- Arms (pivot at shoulders) ---- */}
        <group ref={lArm} position={[0.42, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.6, 0.2]} />
            <meshStandardMaterial color={hoodie} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.66, 0]} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.18]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
        </group>
        <group ref={rArm} position={[-0.42, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.6, 0.2]} />
            <meshStandardMaterial color={hoodie} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.66, 0]} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.18]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
        </group>

        {/* ---- Head ---- */}
        <group ref={head} position={[0, 0.86, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.4, 0.38]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          {/* hair */}
          <mesh position={[0, 0.16, -0.02]} castShadow>
            <boxGeometry args={[0.44, 0.16, 0.42]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, -0.21]}>
            <boxGeometry args={[0.42, 0.3, 0.06]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          {/* glasses */}
          <mesh position={[0.1, 0.02, 0.2]}>
            <boxGeometry args={[0.13, 0.1, 0.04]} />
            <meshStandardMaterial color="#0b0f17" metalness={0.4} />
          </mesh>
          <mesh position={[-0.1, 0.02, 0.2]}>
            <boxGeometry args={[0.13, 0.1, 0.04]} />
            <meshStandardMaterial color="#0b0f17" metalness={0.4} />
          </mesh>
          {/* eyes glow faintly so the face reads at night */}
          <mesh position={[0.1, 0.02, 0.215]}>
            <boxGeometry args={[0.06, 0.04, 0.02]} />
            <meshStandardMaterial color="#bfe9ff" emissive="#7cc4ff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.1, 0.02, 0.215]}>
            <boxGeometry args={[0.06, 0.04, 0.02]} />
            <meshStandardMaterial color="#bfe9ff" emissive="#7cc4ff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
