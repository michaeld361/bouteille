'use client'

import { useEffect, useRef } from 'react'

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let f = 0
    let animId: number

    function resize() {
      if (!c) return
      c.width = window.innerWidth
      c.height = window.innerHeight
    }

    function render() {
      f++
      if (f % 3 !== 0) {
        animId = requestAnimationFrame(render)
        return
      }
      if (!c || !ctx) return
      const w = c.width
      const h = c.height
      const img = ctx.createImageData(w, h)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
      animId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} id="grain" aria-hidden="true" />
}
