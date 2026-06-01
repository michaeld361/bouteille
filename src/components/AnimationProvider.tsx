'use client'

import { useEffect, ReactNode } from 'react'

export default function AnimationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any

    async function initAnimations() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { default: Lenis } = await import('lenis')

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 2.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
      })

      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      // Marquee skew on velocity
      const marqueeTrack = document.querySelector('.marquee__track') as HTMLElement
      if (marqueeTrack) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lenis.on('scroll', (e: any) => {
          const vel = Math.abs(e.velocity)
          const skew = Math.min(vel * 0.5, 4)
          marqueeTrack.style.transform = `translateX(var(--marquee-x, 0)) skewX(${-skew}deg)`
        })
      }

      // Magnetic hover (desktop only)
      if (!window.matchMedia('(max-width: 768px)').matches) {
        document.querySelectorAll('[data-magnetic]').forEach((el) => {
          el.addEventListener('mousemove', (e: Event) => {
            const mouseEvent = e as MouseEvent
            const rect = (el as HTMLElement).getBoundingClientRect()
            const dx = mouseEvent.clientX - (rect.left + rect.width / 2)
            const dy = mouseEvent.clientY - (rect.top + rect.height / 2)
            gsap.to(el, { x: dx * 0.4, y: dy * 0.4, duration: 0.3, ease: 'power2.out' })
          })
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
          })
        })
      }

      // Nav scroll state
      const nav = document.querySelector('.nav')
      if (nav) {
        const sentinel = document.createElement('div')
        sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;'
        document.body.prepend(sentinel)
        new IntersectionObserver(([e]) => {
          nav.classList.toggle('scrolled', !e.isIntersecting)
        }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' }).observe(sentinel)
      }

      // Generic reveals
      gsap.utils.toArray('.reveal').forEach((el: unknown) => {
        const element = el as HTMLElement
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: 'top bottom', once: true },
          y: 24, opacity: 0, duration: 1,
          delay: (Number(element.dataset.delay) || 0) * 0.15,
          ease: 'power3.out',
          onComplete: () => element.classList.add('visible'),
        })
      })

      // Sub-page element reveals
      gsap.utils.toArray('.event-card, .menu-item, .team-member, .wine-item').forEach((el: unknown, i: number) => {
        const element = el as HTMLElement
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: 'top bottom', once: true },
          y: 20, opacity: 0, duration: 0.7,
          delay: (i % 4) * 0.08, ease: 'power3.out',
        })
      })

      ScrollTrigger.refresh()
    }

    initAnimations()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
