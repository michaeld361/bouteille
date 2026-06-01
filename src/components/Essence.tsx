'use client'

import { useEffect, useRef } from 'react'

export default function Essence({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = text.split(/\s+/)
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ')
    const wordEls = el.querySelectorAll('.word')

    async function animate() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.set(wordEls, { opacity: 0.08 })
      ScrollTrigger.create({
        trigger: '.essence',
        start: 'top bottom',
        end: 'top 30%',
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress
          wordEls.forEach((word, i) => {
            const wordProgress = i / wordEls.length
            const dist = progress - wordProgress
            const opacity = dist > 0 ? Math.min(1, dist * wordEls.length * 0.8 + 0.08) : 0.08
            ;(word as HTMLElement).style.opacity = String(opacity)
          })
        },
      })
    }
    animate()
  }, [text])

  return (
    <section className="essence">
      <p ref={ref} className="essence__text">{text}</p>
    </section>
  )
}
