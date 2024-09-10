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

      // Preencher os elementos HTML com os dados da notícia
      document.getElementById('news-title').innerText = news.title
      document.getElementById('news-summary').innerText = news.summary
      document.getElementById('news-image').src = news.image
      document.getElementById('news-date').innerText = news.date
      document.getElementById('news-content').innerText = news.content
    })
    .catch(error => console.error('Erro ao carregar notícias:', error))
}

// Obter o parâmetro da URL (newsId)
const urlParams = new URLSearchParams(window.location.search)
const newsId = urlParams.get('newsId')

// Carregar a notícia correspondente
loadNews(newsId)

const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 5000, // Tempo entre os slides (em milissegundos)
    disableOnInteraction: true // Continua mesmo após a interação do usuário
  },
  slidesPerView: 1 // Exibir um slide por vez
})
