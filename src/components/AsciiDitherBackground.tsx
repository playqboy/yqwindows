import { useEffect, useRef } from 'react'

export default function AsciiDitherBackground() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    host.style.position = 'absolute'
    host.style.inset = ''
    host.style.top = '0'
    host.style.left = '0'
    host.style.right = '0'
    host.style.bottom = 'auto'
    host.style.height = '100vh'
    host.style.zIndex = '0'
    host.style.pointerEvents = 'none'
    host.style.overflow = 'hidden'

    host.innerHTML = `<div data-ascii-dither-bg aria-hidden="true" style="position:absolute;top:0;left:0;right:0;bottom:auto;height:100vh;z-index:0;pointer-events:none;overflow:hidden"></div>`

    const script = document.createElement('script')
    script.src = "./ascii-dither-background.js"
    script.async = true
    host.appendChild(script)

    return () => {
      const mount = host.querySelector('[data-ascii-dither-bg]') as any
      if (mount && typeof mount.__asciiDitherDestroy === 'function') {
        mount.__asciiDitherDestroy()
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      host.innerHTML = ''
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" />
}
