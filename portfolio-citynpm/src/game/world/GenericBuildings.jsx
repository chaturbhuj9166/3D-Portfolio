import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GENERIC_BUILDINGS } from '../../data/world'

const _obj = new THREE.Object3D()
const _color = new THREE.Color()

// Low-poly skyline buildings filling non-section blocks, with warm/cool lit
// window bands for the night look. Geometry comes from the shared world data
// so these exact boxes are also used as solid colliders.
//
// All bodies / rooftops / window bands are drawn with three InstancedMesh
// draw calls total (instead of one mesh per building + one per floor band),
// which keeps the generic skyline cheap regardless of how many blocks it fills.
export default function GenericBuildings() {
  const bodyRef = useRef()
  const roofRef = useRef()
  const bandRef = useRef()

  const bands = useMemo(() => {
    const out = []
    GENERIC_BUILDINGS.forEach((b) => {
      if (!b.lit) return
      for (let f = 0; f < b.floors; f++) {
        out.push({
          x: b.x,
          z: b.z,
          y: 2 + f * (b.h / b.floors),
          w: b.w + 0.04,
          d: b.d + 0.04,
          color: b.win,
          bright: f % 2 === 0,
        })
      }
    })
    return out
  }, [])

  useLayoutEffect(() => {
    const body = bodyRef.current
    const roof = roofRef.current
    GENERIC_BUILDINGS.forEach((b, i) => {
      _obj.position.set(b.x, b.h / 2 + 0.25, b.z)
      _obj.scale.set(b.w, b.h, b.d)
      _obj.updateMatrix()
      body.setMatrixAt(i, _obj.matrix)
      body.setColorAt(i, _color.set(b.color))

      _obj.position.set(b.x, b.h + 0.6, b.z)
      _obj.scale.set(b.w * 0.4, 0.7, b.d * 0.4)
      _obj.updateMatrix()
      roof.setMatrixAt(i, _obj.matrix)
    })
    body.instanceMatrix.needsUpdate = true
    if (body.instanceColor) body.instanceColor.needsUpdate = true
    roof.instanceMatrix.needsUpdate = true
  }, [])

  useLayoutEffect(() => {
    const band = bandRef.current
    if (!band) return
    bands.forEach((b, i) => {
      _obj.position.set(b.x, b.y, b.z)
      _obj.scale.set(b.w, 0.4, b.d)
      _obj.updateMatrix()
      band.setMatrixAt(i, _obj.matrix)
      // bake the emissive glow straight into the instance colour (unlit material)
      band.setColorAt(i, _color.set(b.color).multiplyScalar(b.bright ? 0.9 : 0.45))
    })
    band.instanceMatrix.needsUpdate = true
    if (band.instanceColor) band.instanceColor.needsUpdate = true
  }, [bands])

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, GENERIC_BUILDINGS.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.7} metalness={0.2} />
      </instancedMesh>

      <instancedMesh ref={roofRef} args={[undefined, undefined, GENERIC_BUILDINGS.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#23272f" />
      </instancedMesh>

      {bands.length > 0 && (
        <instancedMesh ref={bandRef} args={[undefined, undefined, bands.length]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  )
}
