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

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type SwiperType from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const originalImages = [gallery_img1, gallery_img2, gallery_img3, gallery_img4]
const extendedImages = [
  originalImages[originalImages.length - 2],
  originalImages[originalImages.length - 1],
  ...originalImages,
  originalImages[0],
  originalImages[1],
]

declare global {
  interface Window {
    naver: any
  }
}


function App() {
  const [index, setIndex] = useState(2)
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const [modalSwiper, setModalSwiper] = useState<SwiperType | null>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const [isGroomAccountVisible, setIsGroomAccountVisible] = useState(false)
  const [isBrideAccountVisible, setIsBrideAccountVisible] = useState(false)
  const groomAccountRef = useRef<HTMLDivElement>(null)
  const brideAccountRef = useRef<HTMLDivElement>(null)

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

    // pinch zoom 방지
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        const mapElement = document.getElementById('map')
        if (!mapElement) return
        if (!mapElement.contains(e.target as Node)) {
          e.preventDefault()
        }
      }
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

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

    // 확대 슬라이드 터치 인터벌 강제
    const handleSwiperTouch = (e: TouchEvent) => {
      e.preventDefault();
    };
    const swiperEl = document.querySelector('.swiper-touch-lock-overlay') as HTMLElement | null;
    if (swiperEl) {
      swiperEl.addEventListener('touchstart', handleSwiperTouch, { passive: false });
    }

    return () => {
      document.head.removeChild(script)
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('touchmove', handleTouchMove)
      if (swiperEl) {
        swiperEl.removeEventListener('touchstart', handleSwiperTouch);
      }
      window.removeEventListener('wheel', handleWheel)
    }
  }, [expandedIndex])

  const onImageClick = (i: number) => {
    setExpandedIndex(i)
  }

  const closeExpanded = () => {
    if (thumbSwiper) {
      thumbSwiper.slideToLoop(index, 0)
    }
    setExpandedIndex(null)
  }

  const onModalImageClick = () => {
    closeExpanded()
  }

  const slideQueue = useRef<string[]>([]);
  const isTransitioning = useRef(false);
  const processThumbSlide = () => {
    if (!thumbSwiper || isTransitioning.current || slideQueue.current.length === 0) return;

    const direction = slideQueue.current.shift();
    if (!direction) return;

    isTransitioning.current = true;

    if (direction === 'next') {
      thumbSwiper.slideNext();
    } else {
      thumbSwiper.slidePrev();
    }

    thumbSwiper.once('transitionEnd', () => {
      isTransitioning.current = false;
      processThumbSlide();
    });
  };

  const [isTouchLocked, setIsTouchLocked] = useState(false);
  const onModalSlideChangeTransitionStart = () => {
    if (!modalSwiper || !thumbSwiper) return;

    const total = extendedImages.length;
    const curr = modalSwiper.realIndex;
    if (curr !== undefined) {
      const slideNext = curr === index + 1 || (index === total - 1 && curr === 0);
      const slidePrev = curr === index - 1 || (index === 0 && curr === total - 1);

      if (slideNext) slideQueue.current.push('next');
      else if (slidePrev) slideQueue.current.push('prev');

      setIndex(curr);
      processThumbSlide();

      setIsTouchLocked(true);
      setTimeout(() => {
        setIsTouchLocked(false);
      }, 200)
    }
  };

  const toggleGroomAccountVisibility = () => {
    const next = !isGroomAccountVisible
    setIsGroomAccountVisible(next)
    if (!next) return // 닫을 땐 스크롤 안함

    setTimeout(() => {
      groomAccountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400)
  }
  const toggleBrideAccountVisibility = () => {
    const next = !isBrideAccountVisible
    setIsBrideAccountVisible(next)
    if (!next) return // 닫을 땐 스크롤 안함

    setTimeout(() => {
      brideAccountRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400)
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
            maxWidth: 430,
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
            maxWidth: 430,
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
            maxWidth: 430,
            aspectRatio: '800 / 361',
            backgroundImage: `url(${galleryTitleImg})`,
          }}
          role="img"
          aria-label="gallery title image"
        />
        <Swiper
          initialSlide={index}
          spaceBetween={10}
          slidesPerView={1.3}
          centeredSlides={true}
          onSwiper={setThumbSwiper}
          onSlideChange={(swiper) => setIndex(swiper.realIndex)}
          loop={true}
        >
          {extendedImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="slide-image-div"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'contain',
                  aspectRatio: '780 / 1024',
                }}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => onImageClick(i)}
                role="img"
                aria-label={`slide image ${i}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {expandedIndex !== null && (
          <div
            className="modal"
            onClick={() => onModalImageClick()}
          >
            {isTouchLocked && (
              <div
                className="swiper-touch-lock-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1000,
                  touchAction: 'none',
                }}
              />
            )}
            <Swiper
              initialSlide={expandedIndex}
              spaceBetween={0}
              slidesPerView={1}
              centeredSlides={true}
              onSlideChangeTransitionStart={onModalSlideChangeTransitionStart}
              onSwiper={setModalSwiper}
              loop={true}
              style={{ width: '100%', height: '60%' }}
            >
              {extendedImages.map((img, i) => (
                <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div
                    className="slide-image-div"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'contain',
                      aspectRatio: '780 / 1024',
                      height: '100%',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    role="img"
                    aria-label={`modal image ${i}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
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
            maxWidth: 430,
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
            maxWidth: 430,
            aspectRatio: 800 / 503,
            backgroundImage: `url(${locationTitleImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
        <div id="map" style={{ width: '100%', height: '300px', maxWidth: 430, margin: '0 auto' }}></div>
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 430,
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
          <hr style={{ margin: '0 1.5em', borderWidth: 0.1 }}></hr>
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
          <hr style={{ margin: '0 1.5em', borderWidth: 0.1 }}></hr>
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
