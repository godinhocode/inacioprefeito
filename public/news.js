// Função para inicializar o carrossel
function initCarousel(carouselElement) {
  const track = carouselElement.querySelector('.carousel-track')
  const prevButton = carouselElement.querySelector('.carousel-button.prev')
  const nextButton = carouselElement.querySelector('.carousel-button.next')
  const items = carouselElement.querySelectorAll('.carousel-item')
  let currentIndex = 0
  let intervalId
  let startX
  let isDragging = false

  function updateCarousel() {
    const offset = -currentIndex * 100
    track.style.transform = `translateX(${offset}%)`
  }

  function goToNextSlide() {
    if (currentIndex < items.length - 1) {
      currentIndex++
    } else {
      currentIndex = 0
    }
    updateCarousel()
  }

  function goToPreviousSlide() {
    if (currentIndex > 0) {
      currentIndex--
    } else {
      currentIndex = items.length - 1
    }
    updateCarousel()
  }

  function startAutoplay() {
    intervalId = setInterval(goToNextSlide, 5000)
  }

  function pauseAutoplay() {
    clearInterval(intervalId)
  }

  function resetAutoplay() {
    pauseAutoplay()
    startAutoplay()
  }

  function handleTouchStart(e) {
    startX = e.touches[0].clientX
    isDragging = true
    pauseAutoplay()
  }

  function handleTouchEnd(e) {
    if (!isDragging) return
    const endX = e.changedTouches[0].clientX
    const diffX = startX - endX

    if (diffX > 50) {
      goToNextSlide()
    } else if (diffX < -50) {
      goToPreviousSlide()
    }

    isDragging = false
    resetAutoplay()
  }

  startAutoplay()

  track.addEventListener('touchstart', handleTouchStart)
  track.addEventListener('touchend', handleTouchEnd)

  nextButton.addEventListener('click', () => {
    pauseAutoplay()
    goToNextSlide()
    resetAutoplay()
  })
  prevButton.addEventListener('click', () => {
    pauseAutoplay()
    goToPreviousSlide()
    resetAutoplay()
  })
}

// Função para carregar os dados das notícias
function loadNews(newsId) {
  fetch('noticias.json')
    .then(response => response.json())
    .then(data => {
      // Encontrar a notícia com base no ID
      const news = data.find(item => item.id == newsId)

      if (news) {
        // Preencher os elementos HTML com os dados da notícia
        document.getElementById('news-title').innerText = news.title
        document.getElementById('news-summary').innerText = news.summary
        document.getElementById('news-image').src = news.image
        document.getElementById('news-date').innerText = news.date
        document.getElementById('news-content').innerText = news.content

        // Adicionar galeria de fotos se existir
        if (news.gallery && news.gallery.length > 0) {
          const galleryWrapper = document.querySelector('.gallery-swiper .swiper-wrapper')
          galleryWrapper.innerHTML = '' // Limpar qualquer conteúdo existente
          news.gallery.forEach(image => {
            const slide = document.createElement('div')
            slide.className = 'swiper-slide'
            const img = document.createElement('img')
            img.src = image
            img.alt = 'Galeria de fotos'
            slide.appendChild(img)
            galleryWrapper.appendChild(slide)
          })

          // Exibir a seção da galeria
          document.getElementById('news-gallery').style.display = 'block'

          // Inicializar o swiper para a galeria
          new Swiper('.gallery-swiper', {
            loop: true,
            autoplay: {
              delay: 9000, // Tempo entre os slides (em milissegundos)
              disableOnInteraction: true // Continua mesmo após a interação do usuário
            },
            slidesPerView: 1// Exibir um slide por vez
          })
        } else {
          document.getElementById('news-gallery').style.display = 'none'
        }
      }
    })
    .catch(error => console.error('Erro ao carregar notícias:', error))
}

// Obter o parâmetro da URL (newsId)
const urlParams = new URLSearchParams(window.location.search)
const newsId = urlParams.get('newsId')

// Carregar a notícia correspondente
loadNews(newsId)

// Inicializar o Swiper para o carrossel principal (se necessário)
const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 9000, // Tempo entre os slides (em milissegundos)
    disableOnInteraction: true // Continua mesmo após a interação do usuário
  },
  slidesPerView: 1 // Exibir um slide por vez
})
