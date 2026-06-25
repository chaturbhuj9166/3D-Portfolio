import * as THREE from 'three'

// ---- Stylised low-poly tree -----------------------------------------------
export function Tree({ position = [0, 0, 0], scale = 1, tint = '#2f7d3b' }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 6]} />
        <meshStandardMaterial color="#6b4a2b" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 2.9, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color={tint} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.6, 3.9, 0.2]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={tint} roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.5, 3.7, -0.3]} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#347e42" roughness={0.85} flatShading />
      </mesh>
    </group>
  )
}

// ---- Rounded bush ----------------------------------------------------------
export function Bush({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#2e6b3a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.5, 0.4, 0.1]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#357a44" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.45, 0.35, -0.1]} castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#2e6b3a" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

// ---- Single flower ---------------------------------------------------------
export function Flower({ position = [0, 0, 0], color = '#ff5c8a' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 4]} />
        <meshStandardMaterial color="#2f7d3b" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <icosahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} flatShading />
      </mesh>
    </group>
  )
}

const _o = new THREE.Object3D()
// ---- Instanced grass tufts -------------------------------------------------
export function GrassField({ tufts }) {
  return (
    <instancedMesh args={[undefined, undefined, tufts.length]} castShadow={false}
      ref={(m) => {
        if (!m) return
        tufts.forEach((t, i) => {
          _o.position.set(t[0], 0.25, t[2])
          _o.rotation.set(0, t[3] || 0, 0)
          _o.scale.set(1, t[4] || 1, 1)
          _o.updateMatrix()
          m.setMatrixAt(i, _o.matrix)
        })
        m.instanceMatrix.needsUpdate = true
      }}
    >
      <coneGeometry args={[0.18, 0.6, 4]} />
      <meshStandardMaterial color="#3a8a48" roughness={1} flatShading />
    </instancedMesh>
  )
}
