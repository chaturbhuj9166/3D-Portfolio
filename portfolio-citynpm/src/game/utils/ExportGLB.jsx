import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

// Press "G" to export the entire live scene (city + props + character) to a
// binary .glb file. The result opens directly in Blender, Unity and any other
// glTF-compatible tool — satisfying the "Export as GLB" requirement straight
// from the running web app.
export default function ExportGLB() {
  const { scene } = useThree()

  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'KeyG' || e.repeat) return
      try {
        const exporter = new GLTFExporter()
        exporter.parse(
          scene,
          (result) => {
            const blob = new Blob([result], { type: 'model/gltf-binary' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'portfolio-city.glb'
            a.click()
            URL.revokeObjectURL(url)
            // eslint-disable-next-line no-console
            console.info('[ExportGLB] portfolio-city.glb exported.')
          },
          (err) => console.error('[ExportGLB] failed:', err),
          { binary: true, onlyVisible: true },
        )
      } catch (err) {
        console.error('[ExportGLB] failed:', err)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene])

  return null
}
