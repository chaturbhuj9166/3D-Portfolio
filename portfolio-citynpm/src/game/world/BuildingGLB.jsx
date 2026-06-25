import { useMemo, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

// Loads a GLB and places it with a pre-computed scale + offset (so the base
// sits on the ground and the mesh is centred on its plot). Deterministic — no
// runtime bounding-box maths that could mis-scale. Plays the clip if `play`.
export default function BuildingGLB({ url, scale = 1, offset = [0, 0, 0], play = false }) {
  const { scene, animations } = useGLTF(url)
  const model = useMemo(() => {
    const m = cloneSkeleton(scene)
    m.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        o.frustumCulled = false
      }
    })
    return m
  }, [scene])

  const { actions } = useAnimations(animations, model)
  useEffect(() => {
    if (!play) return
    Object.values(actions).forEach((a) => a && a.reset().play())
  }, [actions, play])

  return <primitive object={model} scale={scale} position={offset} />
}
