import { useRef, useState, useEffect } from 'react'
import introImg from './assets/01.jpg'
import welcomeImg from './assets/02.jpg'
import galleryTitleImg from './assets/03.jpg'
import gallery_img1 from './assets/g1.jpg'
import gallery_img2 from './assets/g2.jpg'
import gallery_img3 from './assets/g3.jpg'
import gallery_img4 from './assets/g4.jpg'
import galleryBottomMarginImg from './assets/04.jpg'
import locationTitleImg from './assets/05.jpg'
import locationBottomMarginImg from './assets/06.jpg'
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

declare global {
  interface Window {
    naver: any
  }
}


function App() {
  const [index, setIndex] = useState(2)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isModalTransitioning, setIsModalTransitioning] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const modalTrackRef = useRef<HTMLDivElement>(null)

  const [modalDragStartX, setModalDragStartX] = useState<number | null>(null)
  const [modalDragOffset, setModalDragOffset] = useState(0)
  const [modalDragging, setModalDragging] = useState(false)

  const translateX = `translateX(calc(-${index * 85}% + 7.5% + ${(dragOffset / window.innerWidth) * 100}%))`
  const modalTranslateX = `translateX(calc(-${expandedIndex! * 100}% + ${(modalDragOffset / window.innerWidth) * 100}%))`

  useEffect(() => {
    const imgs = document.querySelectorAll('img')
    imgs.forEach((img) => {
      img.setAttribute('draggable', 'false')
    })

    const disableRightClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault()
      }
    }

    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.naver && document.getElementById('map')) {
        const lat = 37.560635
        const lng = 126.967385
        const map = new window.naver.maps.Map('map', {
          center: new window.naver.maps.LatLng(lat, lng),
          zoom: 17
        })
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map,
        });
      }
    }

    document.addEventListener('contextmenu', disableRightClick)
    return () => {
      document.head.removeChild(script)
      document.removeEventListener('contextmenu', disableRightClick)
    }
  }, [])

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
    if (dragOffset > threshold) goTo(index - 1)
    else if (dragOffset < -threshold) goTo(index + 1)
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
    if (dragOffset > threshold) goTo(index - 1)
    else if (dragOffset < -threshold) goTo(index + 1)
    setDragStartX(null)
    setDragOffset(0)
  }

  const goTo = (newIndex: number) => {
    if (!trackRef.current || isTransitioning) return
    trackRef.current.style.transition = 'transform 0.4s ease'
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
        trackRef.current!.style.transform = `translateX(calc(-${(originalImages.length + 1) * 85}% + 7.5%))`
      })
    } else if (index === extendedImages.length - 2) {
      track.style.transition = 'none'
      setIndex(2)

      requestAnimationFrame(() => {
        trackRef.current!.style.transform = `translateX(calc(-170% + 7.5%))`
      })
    }
  }

  const onImageClick = (i: number) => {
    if (!dragging) setExpandedIndex(i)
  }

  const closeExpanded = () => {
    setExpandedIndex(null)
  }

  const handleModalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setModalDragStartX(e.pageX)
    setModalDragging(false)
  }

  const handleModalMouseMove = (e: React.MouseEvent) => {
    if (modalDragStartX === null) return
    const delta = e.pageX - modalDragStartX
    if (Math.abs(delta) > 5) setModalDragging(true)
    setModalDragOffset(delta)
  }

  const handleModalMouseUp = () => {
    if (modalDragOffset > threshold) {
      const next = expandedIndex! - 1
      goModalTo(next)
    } else if (modalDragOffset < -threshold) {
      const next = expandedIndex! + 1
      goModalTo(next)
    }
    setModalDragStartX(null)
    setModalDragOffset(0)
  }

  const handleModalTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setDragStartX(e.touches[0].clientX)
    setModalDragging(false)
  }

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (modalDragStartX === null) return
    const delta = e.touches[0].clientX - modalDragStartX
    if (Math.abs(delta) > 5) setModalDragging(true)
    setModalDragOffset(delta)
  }

  const handleModalTouchEnd = () => {
    if (modalDragOffset > threshold) {
      const next = expandedIndex! - 1
      goModalTo(next)
    } else if (modalDragOffset < -threshold) {
      const next = expandedIndex! + 1
      goModalTo(next)
    }
    setModalDragStartX(null)
    setModalDragOffset(0)
  }

  const goModalTo = (newIndex: number) => {
    if (!modalTrackRef.current || expandedIndex === null || isModalTransitioning) return
    modalTrackRef.current.style.transition = 'transform 0.4s ease'
    setIsModalTransitioning(true)
    setExpandedIndex(newIndex)
    setIndex(newIndex)
  }

  const handleModalTransitionEnd = () => {
    const modalTrack = modalTrackRef.current
    if (!modalTrack || expandedIndex === null) return

    setIsModalTransitioning(false)

    if (expandedIndex === 1) {
      modalTrack.style.transition = 'none'
      setExpandedIndex(originalImages.length + 1)
      requestAnimationFrame(() => {
        modalTrackRef.current!.style.transform = `translateX(calc(-${(originalImages.length + 1) * 100}%))`
      })
    } else if (expandedIndex === extendedImages.length - 2) {
      modalTrack.style.transition = 'none'
      setExpandedIndex(2)
      requestAnimationFrame(() => {
        modalTrackRef.current!.style.transform = `translateX(-200%)`
      })
    }
  }

  const onModalImageClick = () => {
    if (!modalDragging) closeExpanded()
  }

  return (
    <>
      <div id="intro">
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={introImg} />
      </div>
      <div id="welcome">
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={welcomeImg} />
      </div>
      <div id="gallery">
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={galleryTitleImg} />
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
          <div
            className="modal"
            onMouseDown={handleModalMouseDown}
            onMouseMove={handleModalMouseMove}
            onMouseUp={handleModalMouseUp}
            onMouseLeave={handleModalMouseUp}
            onTouchStart={handleModalTouchStart}
            onTouchMove={handleModalTouchMove}
            onTouchEnd={handleModalTouchEnd}
          >
            <div
              className="modal-track"
              ref={modalTrackRef}
              style={{ transform: modalTranslateX }}
              onTransitionEnd={handleModalTransitionEnd}
            >
              {extendedImages.map((img, i) => (
                <div className="modal-slide" key={i}>
                  <img src={img}
                    alt={`modal-${i}`}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => onModalImageClick()} />
                </div>
              ))}
            </div>
            <button className="close-button" onClick={(e) => { e.stopPropagation(); closeExpanded(); }}>×</button>
          </div>
        )}
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={galleryBottomMarginImg} />
      </div>
      <div id="location">
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={locationTitleImg} />
        <div id="map" style={{ width: '100%', height: '300px', maxWidth: 800, margin: '0 auto' }}></div>
        <img width="100%" style={{ maxWidth: 800, display: 'block' }} height="auto" src={locationBottomMarginImg} />
      </div>


    </>
  )
}

export default App
