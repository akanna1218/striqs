import { Box, Typography } from '@mui/material'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Keyboard, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function PosterCoverflowCarousel({ products = [], categories = [] }) {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]))
  const slides = (products || []).filter((product) => product?.image).slice(0, 8)

  if (!slides.length) return null

  return (
    <Box className="poster-coverflow-wrapper">
      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination, Keyboard]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        keyboard={{ enabled: true }}
        slidesPerView={1.2}
        spaceBetween={16}
        navigation={{
          prevEl: '.poster-coverflow-prev',
          nextEl: '.poster-coverflow-next',
        }}
        pagination={{
          el: '.poster-coverflow-pagination',
          clickable: true,
          dynamicBullets: true,
        }}
        coverflowEffect={{
          rotate: 18,
          stretch: -20,
          depth: 160,
          modifier: 2.4,
          slideShadows: true,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 20 },
          640: { slidesPerView: 1.8, spaceBetween: 22 },
          960: { slidesPerView: 2.4, spaceBetween: 24 },
          1200: { slidesPerView: 2.8, spaceBetween: 32 },
        }}
        className="poster-coverflow"
      >
        {slides.map((product) => {
          const href = product.categoryId ? `/collections/${product.categoryId}` : '/shop'
          const categoryName = categoryMap.get(product.categoryId) || 'Poster'

          return (
            <SwiperSlide key={product.id} className="poster-coverflow-slide">
              <Link to={href} className="poster-coverflow-card" aria-label={`Browse ${categoryName} posters`}>
                <Box className="poster-coverflow-media">
                  <img src={product.image} alt={product.title} loading="eager" />
                </Box>
                <Box className="poster-coverflow-caption">
                  <Typography variant="overline">{categoryName}</Typography>
                  <Typography variant="h6">{product.title}</Typography>
                </Box>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <Box className="poster-coverflow-controls" aria-label="Poster navigation controls">
        <button type="button" className="poster-coverflow-prev" aria-label="Previous posters">
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </button>
        <Box className="poster-coverflow-pagination" />
        <button type="button" className="poster-coverflow-next" aria-label="Next posters">
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </button>
      </Box>
    </Box>
  )
}
