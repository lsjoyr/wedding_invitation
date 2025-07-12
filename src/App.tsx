import { useRef, useState } from 'react'
import introImg from './assets/0.jpeg'
import welcomeImg from './assets/1.png'
import gallery_img1 from './assets/g1.jpg'
import gallery_img2 from './assets/g2.jpg'
import gallery_img3 from './assets/g3.jpg'
import gallery_img4 from './assets/g4.jpg'
import './App.css'

const originalImages = [gallery_img1, gallery_img2, gallery_img3, gallery_img4]
const extendedImages = [
  originalImages[originalImages.length - 1],
  ...originalImages,
  originalImages[0],
]

const threshold = 50

function App() {
  const [index, setIndex] = useState(1)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const computedOffsetPercent = (dragOffset / window.innerWidth) * 100
  const translateX = `translateX(calc(-${index * 85}% + 7.5% + ${computedOffsetPercent}%))`

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragStartX(e.pageX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return
    const delta = e.pageX - dragStartX
    setDragOffset(delta)
  }

  const handleMouseUp = () => {
    if (dragOffset > threshold) {
      goTo(index - 1)
    } else if (dragOffset < -threshold) {
      goTo(index + 1)
    }
    setDragStartX(null)
    setDragOffset(0)
  }

  const goTo = (newIndex: number) => {
    if (!trackRef.current || isTransitioning) return
    const track = trackRef.current

    track.style.transition = 'transform 0.4s ease'
    setIsTransitioning(true)
    setIndex(newIndex)
  }

  const handleTransitionEnd = () => {
    const track = trackRef.current
    if (!track) return

    setIsTransitioning(false)

    if (index === 0) {
      track.style.transition = 'none'
      setIndex(originalImages.length)

      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(calc(-${originalImages.length * 85}% + 7.5%))`
        }
      })
    } else if (index === extendedImages.length - 1) {
      track.style.transition = 'none'
      setIndex(1)

      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(calc(-85% + 7.5%))`
        }
      })
    }
  }

  return (
    <>
      <div id="intro_img">
        <img width="100%" style={{ maxWidth: 800 }} height="auto" src={introImg} />
      </div>
      <div id="welcome_img">
        <img width="100%" style={{ maxWidth: 800 }} height="auto" src={welcomeImg} />
      </div>

      <div className="slider-wrapper">
        <div
          className="slider-track-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="slider-track"
            ref={trackRef}
            style={{
              transform: translateX,
              transition: dragStartX === null ? 'transform 0.4s ease' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt={`slide-${i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
