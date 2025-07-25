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
import downIconImg from './assets/down_icon.png'
import './App.css'

const originalImages = [gallery_img1, gallery_img2, gallery_img3, gallery_img4]
const extendedImages = [
  originalImages[originalImages.length - 2],
  originalImages[originalImages.length - 1],
  ...originalImages,
  originalImages[0],
  originalImages[1],
]

const slide_threshold = 30
const scroll_threshold = 10

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
  const isTouchingSliderRef = useRef(false)
  const touchStartYRef = useRef<number | null>(null)
  const verticalScrollAllowedRef = useRef(false)

  const [modalDragStartX, setModalDragStartX] = useState<number | null>(null)
  const [modalDragOffset, setModalDragOffset] = useState(0)
  const [modalDragging, setModalDragging] = useState(false)

  const translateX = `translateX(calc(-${index * 85}% + 7.5% + ${(dragOffset / window.innerWidth) * 100}%))`
  const modalTranslateX = `translateX(calc(-${expandedIndex! * 100}% + ${(modalDragOffset / window.innerWidth) * 100}%))`

  const [isGroomAccountVisible, setIsGroomAccountVisible] = useState(false)
  const [isBrideAccountVisible, setIsBrideAccountVisible] = useState(false)
  const groomAccountRef = useRef<HTMLDivElement>(null)
  const brideAccountRef = useRef<HTMLDivElement>(null)
  const toggleGroomAccountVisibility = () => {
    setIsGroomAccountVisible(prev => !prev)
  }
  const toggleBrideAccountVisibility = () => {
    setIsBrideAccountVisible(prev => !prev)
  }

  useEffect(() => {
    // 이미지 드래그 방지
    const imgDivs = document.querySelectorAll('.bg-image-div, .slide-image-div')
    imgDivs.forEach((div) => {
      div.setAttribute('draggable', 'false')
    })
    // 이미지 우클릭 방지
    const disableRightClick = (e: MouseEvent) => {
      if (
        (e.target instanceof HTMLElement) &&
        (e.target.classList.contains('bg-image-div') || e.target.classList.contains('slide-image-div'))
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', disableRightClick)

    // 페이지 확대/축소 방지
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })

    // 슬라이드 터치 중 세로 스크롤 둔화 & pinch zoom 방지
    const handleTouchStart = (e: TouchEvent) => {
      if (!(e.target instanceof HTMLElement)) return

      if (e.target.closest('.slider-track-container')) {
        isTouchingSliderRef.current = true
        touchStartYRef.current = e.touches[0].clientY
        verticalScrollAllowedRef.current = false
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        const mapElement = document.getElementById('map')
        if (!mapElement) return
        if (!mapElement.contains(e.target as Node)) {
          e.preventDefault()
        }
      }

      if (!isTouchingSliderRef.current) return

      const currentY = e.touches[0].clientY
      const startY = touchStartYRef.current
      if (startY == null) return

      const deltaY = Math.abs(currentY - startY)

      if (deltaY > scroll_threshold) {
        verticalScrollAllowedRef.current = true
      }

      if (!verticalScrollAllowedRef.current) {
        e.preventDefault()
      }
    }
    const handleTouchEnd = () => {
      isTouchingSliderRef.current = false
      touchStartYRef.current = null
      verticalScrollAllowedRef.current = false
    }
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    // 확대 슬라이드 중 배경 스크롤 방지
    if (expandedIndex !== null) {
      document.body.classList.add('no-overscroll')
    } else {
      document.body.classList.remove('no-overscroll')
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

    // 드롭다운 열릴 때 부드러운 스크롤 이동
    let timeout: ReturnType<typeof setTimeout> | null = null
    if (isGroomAccountVisible) {
      timeout = setTimeout(() => {
        groomAccountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
    }
    if (isBrideAccountVisible) {
      timeout = setTimeout(() => {
        brideAccountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
    }

    return () => {
      document.head.removeChild(script)
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('wheel', handleWheel)
      if (timeout) clearTimeout(timeout)
    }
  }, [expandedIndex, isGroomAccountVisible, isBrideAccountVisible])

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
    if (dragOffset > slide_threshold) goTo(index - 1)
    else if (dragOffset < -slide_threshold) goTo(index + 1)
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
    if (dragOffset > slide_threshold) goTo(index - 1)
    else if (dragOffset < -slide_threshold) goTo(index + 1)
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
    if (modalDragOffset > slide_threshold) {
      const next = expandedIndex! - 1
      goModalTo(next)
    } else if (modalDragOffset < -slide_threshold) {
      const next = expandedIndex! + 1
      goModalTo(next)
    }
    setModalDragStartX(null)
    setModalDragOffset(0)
  }

  const handleModalTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setModalDragStartX(e.touches[0].clientX)
    setModalDragging(false)
  }

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (modalDragStartX === null) return
    const delta = e.touches[0].clientX - modalDragStartX
    if (Math.abs(delta) > 5) setModalDragging(true)
    setModalDragOffset(delta)
  }

  const handleModalTouchEnd = () => {
    if (modalDragOffset > slide_threshold) {
      const next = expandedIndex! - 1
      goModalTo(next)
    } else if (modalDragOffset < -slide_threshold) {
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

  const copyAccountNumber = (accountNumber: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber)
        .then(() => {
          alert('계좌번호가 복사되었습니다.')
        })
        .catch(() => {
          alert('복사에 실패했습니다.')
        })
    } else {
      alert('클립보드 기능을 지원하지 않는 브라우저입니다.')
    }
  }

  return (
    <>
      <div id="intro">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: 800 / 1423,
            backgroundImage: `url(${introImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
      </div>
      <div id="welcome">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: '800 / 1122',
            backgroundImage: `url(${welcomeImg})`,
          }}
          role="img"
          aria-label="welcome image"
        />
      </div>
      <div id="gallery">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: '800 / 361',
            backgroundImage: `url(${galleryTitleImg})`,
          }}
          role="img"
          aria-label="gallery title image"
        />
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
                  <div
                    className="slide-image-div"
                    style={{
                      backgroundImage: `url(${img})`,
                      aspectRatio: '780 / 1024',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => onImageClick(i)}
                    role="img"
                    aria-label={`slide image ${i}`}
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
            onClick={() => onModalImageClick()}
          >
            <div
              className="modal-track"
              ref={modalTrackRef}
              style={{ transform: modalTranslateX }}
              onTransitionEnd={handleModalTransitionEnd}
            >
              {extendedImages.map((img, i) => (
                <div className="modal-slide" key={i}>
                  <div
                    className="slide-image-div"
                    style={{
                      height: '100%',
                      maxWidth: '90%',
                      backgroundImage: `url(${img})`,
                      aspectRatio: '780 / 1024',

                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    role="img"
                    aria-label={`modal image ${i}`}
                  />
                </div>
              ))}
            </div>
            <div className="modal-fixed-caption">
              옆으로 넘기시면 더 많은 사진을 볼 수 있습니다.
            </div>
            <button className="close-button" onClick={(e) => { e.stopPropagation(); closeExpanded(); }}>×</button>
          </div>
        )}
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: 800 / 176,
            backgroundImage: `url(${galleryBottomMarginImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
      </div>
      <div id="location">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: 800 / 503,
            backgroundImage: `url(${locationTitleImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
        <div id="map" style={{ width: '100%', height: '300px', maxWidth: 800, margin: '0 auto' }}></div>
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 800,
            aspectRatio: 800 / 176,
            backgroundImage: `url(${locationBottomMarginImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
      </div>
      <div id="gift" className="gift-container">
        <div
          className="account-toggle-button"
          onClick={toggleGroomAccountVisibility}
          aria-expanded={isGroomAccountVisible}
          aria-controls="groom-account-info"
        >
          <p className="account-toggle-text">신랑측 계좌번호 보기</p>
          <div
            className={`account-toggle-icon ${isGroomAccountVisible ? 'rotated' : ''}`}
            style={{
              backgroundImage: `url(${downIconImg})`,
              width: 16,
              height: 9,
            }}
          />
        </div>
        <div className={`account-info ${isGroomAccountVisible ? 'visible' : ''}`} aria-hidden={!isGroomAccountVisible} ref={groomAccountRef}>
          <div className="account-item">
            <div className="account-text">
              <span className="account-name">이승준</span>
              <span className="account-number">신한은행 110-159-100961</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('110159100961')}
              aria-label="계좌번호 복사"
            >
              계좌번호 복사
            </button>
          </div>
          <hr style={{margin:'0 1.5em', borderWidth: 0.1}}></hr>
          <div className="account-item">
            <div className="account-text">
              <span className="account-name">이승준</span>
              <span className="account-number">신한은행 110-159-100961</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('110159100961')}
              aria-label="계좌번호 복사"
            >
              계좌번호 복사
            </button>
          </div>
        </div>
        <div
          className="account-toggle-button"
          onClick={toggleBrideAccountVisibility}
          aria-expanded={isBrideAccountVisible}
          aria-controls="bride-account-info"
          style={{ marginTop: '1em' }} // 신랑측과 간격을 위해 margin-top 추가
        >
          <p className="account-toggle-text">신부측 계좌번호 보기</p>
          <div
            className={`account-toggle-icon ${isBrideAccountVisible ? 'rotated' : ''}`}
            style={{
              backgroundImage: `url(${downIconImg})`,
              width: 16,
              height: 9,
            }}
          />
        </div>
        <div className={`account-info ${isBrideAccountVisible ? 'visible' : ''}`} aria-hidden={!isBrideAccountVisible} ref={brideAccountRef} id="bride-account-info">
          <div className="account-item">
            <div className="account-text">
              <span className="account-name">오유림</span>
              <span className="account-number">국민은행 97707211070</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('97707211070')}
              aria-label="계좌번호 복사"
            >
              계좌번호 복사
            </button>
          </div>
          <hr style={{margin:'0 1.5em', borderWidth: 0.1}}></hr>
          <div className="account-item">
            <div className="account-text">
              <span className="account-name">오유림</span>
              <span className="account-number">국민은행 97707211070</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('110159100961')}
              aria-label="계좌번호 복사"
            >
              계좌번호 복사
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
