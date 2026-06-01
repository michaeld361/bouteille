'use client'

import { useEffect } from 'react'

interface HeroProps {
  heroImage?: string
  heroTitle: string
  tagline: string
  lang: string
}

export default function Hero({ heroTitle, tagline }: HeroProps) {
  useEffect(() => {
    async function animate() {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const title = document.querySelector('.hero__title')
      if (!title) return

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to('.hero__bg-img', { scale: 1, filter: 'brightness(0.8) blur(0px)', duration: 2.8, ease: 'power2.out' }, 0)
      tl.to(title, { y: '0%', rotateX: 0, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.6, ease: 'expo.out' }, 0.4)
      tl.from('.hero__rule', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.out' }, 1.2)
      tl.from('.hero__sub', { opacity: 0, y: 15, duration: 1, ease: 'power2.out' }, 1.4)
      tl.to('.hero__scroll', { opacity: 1, duration: 0.8 }, 1.8)

      gsap.to('.hero__bg-img', { y: '15%', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero__content', { y: '-25%', opacity: 0, filter: 'blur(10px)', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top -5%', end: 'bottom top', scrub: true } })
    }
    animate()
  }, [])

  return (
    <section className="hero">
      <div className="hero__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.jpg" alt="" className="hero__bg-img" aria-hidden="true" />
        <div className="hero__gradient" />
      </div>
      <div className="hero__content">
        <div className="hero__title-mask">
          <h1 className="hero__title">{heroTitle || 'Bouteille'}</h1>
        </div>
        <div className="hero__meta">
          <div className="hero__rule" />
          <p className="hero__sub">{tagline}</p>
        </div>
      </div>
      <div className="hero__scroll">
        <span className="hero__scroll-text">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
