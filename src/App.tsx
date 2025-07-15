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
  originalImages[originalImages.length - 2],
  originalImages[originalImages.length - 1],
  ...originalImages,
  originalImages[0],
  originalImages[1],
]

const threshold = 30

function App() {
  const [index, setIndex] = useState(2)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)

  const computedOffsetPercent = (dragOffset / window.innerWidth) * 100
  const translateX = `translateX(calc(-${index * 85}% + 7.5% + ${computedOffsetPercent}%))`

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragStartX(e.pageX)
    setDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return
    const delta = e.pageX - dragStartX
    if (Math.abs(delta) > 5) setDragging(true)
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

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setDragStartX(e.touches[0].clientX)
    setDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return
    const delta = e.touches[0].clientX - dragStartX
    if (Math.abs(delta) > 5) setDragging(true)
    setDragOffset(delta)
  }

  const handleTouchEnd = () => {
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

    if (index === 1) {
      track.style.transition = 'none'
      setIndex(originalImages.length + 1)

      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(calc(-${(originalImages.length + 1) * 85}% + 7.5%))`
        }
      })
    } else if (index === extendedImages.length - 2) {
      track.style.transition = 'none'
      setIndex(2)

      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(calc(-170% + 7.5%))`
        }
      })
    }
  }

  const onImageClick = (i: number) => {
    if (!dragging) {
      if (expandedIndex === i) {
        setExpandedIndex(null)
      } else {
        setExpandedIndex(i)
      }
    }
  }

  const closeExpanded = () => {
    setExpandedIndex(null)
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
                <img
                  src={img}
                  alt={`slide-${i}`}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={() => onImageClick(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {expandedIndex !== null && (
        <div className="modal" onClick={closeExpanded}>
          <img src={extendedImages[expandedIndex]} alt={`expanded-${expandedIndex}`} />
          <button
            className="close-button"
            onClick={(e) => {
              e.stopPropagation()
              closeExpanded()
            }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  )
}

export default App
