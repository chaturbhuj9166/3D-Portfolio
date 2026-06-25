import { useMemo, useRef, useLayoutEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { TREES } from '../../data/world'
import treeUrl from '../../assets/tree_gn.glb?url'

useGLTF.preload(treeUrl)

const TREE_FIT = 6.5 // target tree height in world units (before per-tree scale)

// The model's materials use the unsupported spec-gloss extension (textures
// don't load → white), so we assign solid colours per sub-mesh by name.
function colorFor(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('bark') || n.includes('cortex') || n.includes('prune')) return '#6b4a2b'
  if (n.includes('vine')) return '#2f6b2a'
  if (n.includes('cluster2') || n.includes('clusterb2')) return '#4f9a45'
  return '#3f8a3a' // foliage clusters
}

// Renders the GLB tree at every tree position using GPU instancing (one
// instanced draw per sub-mesh instead of ~70 separate trees), so a fairly
// detailed tree stays performant. Shadows are off on foliage to save fill-rate.
export default function TreesGLB() {
  const { scene } = useGLTF(treeUrl)

  const { parts, baseScale, baseY } = useMemo(() => {
    scene.updateWorldMatrix(true, true)
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const bScale = TREE_FIT / (size.y || 1)
    const bY = -box.min.y * bScale
    const list = []
    scene.traverse((o) => {
      if (o.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          color: colorFor(o.name),
          roughness: 0.9,
          metalness: 0,
          flatShading: true,
        })
        list.push({ geometry: o.geometry, material, matrix: o.matrixWorld.clone() })
      }
    })
    return { parts: list, baseScale: bScale, baseY: bY }
  }, [scene])

  return (
    <group>
      {parts.map((p, i) => (
        <TreePart key={i} geometry={p.geometry} material={p.material} local={p.matrix} baseScale={baseScale} baseY={baseY} />
      ))}
    </group>
  )
}

function TreePart({ geometry, material, local, baseScale, baseY }) {
  const ref = useRef()

  useLayoutEffect(() => {
    const mesh = ref.current
    const inst = new THREE.Matrix4()
    const treeM = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scl = new THREE.Vector3()
    TREES.forEach((t, i) => {
      const s = baseScale * t.scale
      // small deterministic yaw variation so the trees aren't all identical
      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i % 8) * 0.78)
      pos.set(t.x, 0.25 + baseY * t.scale, t.z)
      scl.set(s, s, s)
      treeM.compose(pos, quat, scl)
      inst.multiplyMatrices(treeM, local)
      mesh.setMatrixAt(i, inst)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [geometry, material, local, baseScale, baseY])

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, TREES.length]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={false}
    />
  )
}
