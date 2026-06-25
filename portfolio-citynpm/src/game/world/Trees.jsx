import { Tree } from '../props/Nature'
import { TREES } from '../../data/world'

// Renders every collidable tree from the shared world data (block-corner trees
// and park trees). Player collision uses the same TREES list.
export default function Trees() {
  return (
    <group>
      {TREES.map((t) => (
        <Tree key={t.key} position={[t.x, 0.25, t.z]} scale={t.scale} />
      ))}
    </group>
  )
}
