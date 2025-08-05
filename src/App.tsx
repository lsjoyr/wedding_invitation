import { useRef, useState, useEffect } from 'react'
import introImg from './assets/01.jpg'
import welcomeImg from './assets/02.jpg'
import galleryTitleImg from './assets/03.jpg'
import gallery_img1 from './assets/g1.jpg'
import gallery_img2 from './assets/g2.jpg'
import gallery_img3 from './assets/g3.jpg'
import gallery_img4 from './assets/g4.jpg'
import gallery_img5 from './assets/g5.jpg'
import gallery_img6 from './assets/g6.jpg'
import gallery_img7 from './assets/g7.jpg'
import gallery_img8 from './assets/g8.jpg'
import gallery_img9 from './assets/g9.jpg'
import gallery_img10 from './assets/g10.jpg'
import gallery_img11 from './assets/g11.jpg'
import gallery_img12 from './assets/g12.jpg'
import gallery_img13 from './assets/g13.jpg'
import gallery_img14 from './assets/g14.jpg'
import gallery_img15 from './assets/g15.jpg'
import gallery_img16 from './assets/g16.jpg'
import gallery_img17 from './assets/g17.jpg'
import gallery_img18 from './assets/g18.jpg'
import gallery_img19 from './assets/g19.jpg'
import gallery_img20 from './assets/g20.jpg'
import gallery_img21 from './assets/g21.jpg'
import gallery_img22 from './assets/g22.jpg'
import gallery_img23 from './assets/g23.jpg'
import gallery_img24 from './assets/g24.jpg'
import gallery_img25 from './assets/g25.jpg'
import locationTitleImg from './assets/05.jpg'
import navImgNaver from './assets/nav_naver.png'
import navImgTmap from './assets/nav_tmap.png'
import navImgKakao from './assets/nav_kakao.png'
import accountTitleImg from './assets/07.jpg'
import downIconImg from './assets/down_icon.png'
import kakaotalkIconImg from './assets/kakaotalk.png'
import './App.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type SwiperType from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const originalImages = [
  gallery_img1, gallery_img2, gallery_img3, gallery_img4, gallery_img5, gallery_img6, gallery_img7, gallery_img8, gallery_img9, gallery_img10, gallery_img11, gallery_img12, gallery_img13, gallery_img14, gallery_img15, gallery_img16, gallery_img17, gallery_img18, gallery_img19, gallery_img20, gallery_img21, gallery_img22, gallery_img23, gallery_img24, gallery_img25
]

declare global {
  interface Window {
    naver: any
  }
}

declare const Kakao: any

function App() {
  const [index, setIndex] = useState(0)
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

    const map_script = document.createElement('script')
    map_script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`
    map_script.async = true
    document.head.appendChild(map_script)
    map_script.onload = () => {
      if (window.naver && document.getElementById('map')) {
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

    const kakao_navi_script = document.createElement('script')
    kakao_navi_script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js'
    kakao_navi_script.integrity = 'sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6'
    kakao_navi_script.crossOrigin = 'anonymous'
    kakao_navi_script.async = true
    document.head.appendChild(kakao_navi_script)
    kakao_navi_script.onload = () => {
      Kakao.init(`${import.meta.env.VITE_KAKAO_APP_KEY}`)
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
      document.head.removeChild(map_script)
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('touchmove', handleTouchMove)
      if (swiperEl) {
        swiperEl.removeEventListener('touchstart', handleSwiperTouch);
      }
      window.removeEventListener('wheel', handleWheel)
    }
  }, [expandedIndex])

  const onThumbSlideChange = () => {
    if (thumbSwiper) {
      setIndex(thumbSwiper.realIndex)

      const marginTargetDiv = document.querySelector('div[data-swiper-slide-index="22"]') as HTMLElement;
      if (marginTargetDiv) {
        marginTargetDiv.style.marginTop = 'auto';
        marginTargetDiv.style.marginBottom = 'auto';
      }
      const ratioTargetDiv = document.querySelector('div[aria-label="slide image 22"]') as HTMLElement;
      if (ratioTargetDiv) {
        ratioTargetDiv.style.aspectRatio = '1000 / 667';
      }
    }
  }

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
    const ratioTargetDiv = document.querySelector('div[aria-label="modal image 22"]') as HTMLElement;
    if (ratioTargetDiv) {
      ratioTargetDiv.style.aspectRatio = '1000 / 667';
      ratioTargetDiv.style.height = '';
      ratioTargetDiv.style.width = '87%';
    }

    if (!modalSwiper || !thumbSwiper) return;

    const total = originalImages.length;
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

  const dname = '루이비스웨딩 중구점'
  const lat = 37.560635
  const lng = 126.967385

  function getMobileOS(): 'android' | 'ios' | 'unknown' {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) return 'android';
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    return 'unknown';
  }

  function openNavApp(appName: string) {
    const encodedName = encodeURIComponent(dname);
    if (appName === "naver") {
      const appUrl = `nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${encodedName}`
      const openedWindow = window.open(appUrl, '_blank');

      const os = getMobileOS()
      let fallbackUrl = ''
      if (os === 'ios') {
        fallbackUrl = 'https://apps.apple.com/kr/app/id311867728';
      } else if (os === 'android') {
        fallbackUrl = 'https://play.google.com/store/apps/details?id=com.nhn.android.nmap';
      } else {
        fallbackUrl = `https://map.naver.com/v5/search/${encodedName}`;
      }

      const fallback_timer = 3000
      setTimeout(() => {
        // 일부 브라우저에서는 앱이 열리면 openedWindow 가 null 이 아님에도 불구하고 닫히지 않음
        if (openedWindow) {
          try {
            openedWindow.location.href = fallbackUrl;
          } catch (e) {
            // Safari나 일부 브라우저는 cross-origin 때문에 에러날 수 있으니 직접 열기
            window.open(fallbackUrl, '_blank');
          }
        } else {
          // pop-up blocker 때문에 열리지 않은 경우 등
          window.open(fallbackUrl, '_blank');
        }
      }, fallback_timer);
    }
    else if (appName === "tmap") {
      const appUrl = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_APP_KEY}&name=${encodeURIComponent(dname)}&lon=${lng}&lat=${lat}`
      window.open(appUrl, '_blank');
    }
    else if (appName === "kakao") {
      Kakao.Navi.start({
        name: dname,
        x: lng,
        y: lat,
        coordType: 'wgs84',
      });
    }
  }

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

  const shareToKakaotalk = () => {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '승준 ❤️ 유림의 결혼식에 초대합니다',
        description: '청첩장을 확인해보세요',
        imageUrl: window.location.origin + '/preview.jpg',
        imageWidth: 800,
        imageHeight: 400,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    })
  }

  return (
    <>
      <div id="intro">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 430,
            aspectRatio: 800 / 1370,
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
          spaceBetween={25}
          slidesPerView={1.5}
          centeredSlides={true}
          onSwiper={setThumbSwiper}
          onSlideChange={onThumbSlideChange}
          loop={true}
        >
          {originalImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="slide-image-div"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'contain',
                  aspectRatio: '800 / 1200',
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
              style={{ width: '100%', height: '66%', maxHeight: '630px' }}
            >
              {originalImages.map((img, i) => (
                <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div
                    className="slide-image-div"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'contain',
                      aspectRatio: '800 / 1200',
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
        <div id="nav">
          <div className="nav_box nav_naver" onClick={() => openNavApp("naver")}>
            <img id='nav_img_naver' src={navImgNaver} />
            네이버 지도
          </div>
          <div className="nav_box nav_tmap" onClick={() => openNavApp("tmap")}>
            <img id='nav_img_tmap' src={navImgTmap} />
            티맵
          </div>
          <div className="nav_box nav_kakao" onClick={() => openNavApp("kakao")}>
            <img id='nav_img_kakao' src={navImgKakao} />
            카카오내비
          </div>
        </div>
      </div>
      <div id="gift" className="gift-container">
        <div
          className="bg-image-div"
          style={{
            width: '100%',
            maxWidth: 430,
            aspectRatio: 800 / 456,
            backgroundImage: `url(${accountTitleImg})`,
          }}
          role="img"
          aria-label="intro image"
        />
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
              <span className="account-name">김수진</span>
              <span className="account-number">우체국 013755-02-124659</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('01375502124659')}
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
          style={{ marginTop: '1em' }}
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
              <span className="account-name">한현순</span>
              <span className="account-number">농협 158-02-076007</span>
            </div>
            <button
              className="copy-button"
              onClick={() => copyAccountNumber('15802076007')}
              aria-label="계좌번호 복사"
            >
              계좌번호 복사
            </button>
          </div>
        </div>
      </div>
      <div className='bottom'>
        <div id='kakaotalk' onClick={shareToKakaotalk}>
          <img style={{ width: '13px', marginRight: '5px' }} src={kakaotalkIconImg} /> 카카오톡으로 공유하기
        </div>
        <div id='copyright'>
          Developed by Seungjoon
          <br />
          Designed by Yurim
        </div>
      </div>
    </>
  )
}

export default App
