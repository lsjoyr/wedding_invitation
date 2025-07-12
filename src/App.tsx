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

function App() {
  const [index, setIndex] = useState(1)
  const trackRef = useRef<HTMLDivElement>(null)

  const goTo = (newIndex: number) => {
    if (!trackRef.current) return
    const track = trackRef.current

    track.style.transition = 'transform 0.4s ease'
    setIndex(newIndex)
  }

  const handleTransitionEnd = () => {
    const track = trackRef.current
    if (!track) return

    if (index === 0) {
      track.style.transition = 'none'
      setIndex(originalImages.length)
    } else if (index === extendedImages.length - 1) {
      track.style.transition = 'none'
      setIndex(1)
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
        <button className="nav prev" onClick={() => goTo(index - 1)}>‹</button>
        <div className="slider-track-container">
          <div
            className="slider-track"
            ref={trackRef}
            style={{ transform: `translateX(calc(-${index * 85}% + 7.5%))` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt={`slide-${i}`} />
              </div>
            ))}
          </div>
        </div>
        <button className="nav next" onClick={() => goTo(index + 1)}>›</button>
      </div>
    </>
  )
}

export default App
