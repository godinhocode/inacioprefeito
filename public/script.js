document.addEventListener('DOMContentLoaded', () => {
  // Configuração do Firebase
  const firebaseConfig = {
    apiKey: 'AIzaSyBz4NptTA06tyCwxjeWItGKH2svdEHgQJ0',
    authDomain: 'inacioprefeito2024.firebaseapp.com',
    databaseURL: 'https://inacioprefeito2024-default-rtdb.firebaseio.com',
    projectId: 'inacioprefeito2024',
    storageBucket: 'inacioprefeito2024.appspot.com',
    messagingSenderId: '683410271147',
    appId: '1:683410271147:web:ba9a3d13dec97e601780ee',
    measurementId: 'G-08X4TLT9JS'
  }

  // Inicialize o Firebase
  firebase.initializeApp(firebaseConfig)
  const db = firebase.firestore()

  // Função para exibir perguntas e respostas
  function displayQuestions() {
    const questionsList = document.getElementById('questions-list')
    const questionsSection = document.getElementById('questions-carousel')

    db.collection('questions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        questionsList.innerHTML = ''

        if (snapshot.empty) {
          // Se não houver perguntas, oculte a seção de perguntas
          questionsSection.style.display = 'none'
        } else {
          // Exiba a seção de perguntas
          questionsSection.style.display = 'flex'

          snapshot.forEach(doc => {
            const questionData = doc.data()

            // URL da logo da campanha
            const campaignLogoUrl =
              'https://firebasestorage.googleapis.com/v0/b/inacioprefeito2024.appspot.com/o/supports%2Fquestion%20logo.png?alt=media&token=f0bd98a4-fe3e-4e20-a7bd-ae00c578704e'

            const questionElement = document.createElement('div')
            questionElement.classList.add('swiper-slide')

            questionElement.innerHTML = `
          <div class="question-item">
          <span class="questionfrase"><strong>Pergunta:</strong></span>
            <textarea class="questionarea">${questionData.question}</textarea>
            ${
              questionData.answered
                ? `<div class="answer-container">
                      <div class="answer-content">
                      
                      <textarea class="auto-resize-textarea" readonly>${questionData.answer}</textarea>
                      </div>
                      <img src="${campaignLogoUrl}" alt="Logo da Campanha" class="user-image">
                    </div>`
                : '<p>Obrigado pela pergunta responderemos em breve...</p>'
            }
            
          </div>
          `

            questionsList.appendChild(questionElement)
          })

          // Inicializa o carrossel Swiper após adicionar os itens
          initQuestionsSwiper()
        }
      })
  }

  // Inicializa a exibição
  displayQuestions()

  // Função para enviar uma pergunta
  document.getElementById('question-form').addEventListener('submit', e => {
    e.preventDefault()
    const questionInput = document.getElementById('question-input').value
    if (questionInput.trim()) {
      db.collection('questions')
        .add({
          question: questionInput,
          answer: '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          answered: false
        })
        .then(() => {
          document.getElementById('question-input').value = ''
          alert('Sua pergunta foi enviada!')
        })
        .catch(error => {
          console.error('Erro ao enviar a pergunta:', error)
        })
    }
  })

  // Função para inicializar o Swiper específico para perguntas
  function initQuestionsSwiper() {
    var swiper = new Swiper('.questions-swiper', {
      grabCursor: true,
      slidesPerView: 'auto',
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      loop: true,

      on: {
        init: function () {
          // Configura o timeout para reiniciar o autoplay após a interação
          let interactionTimeout

          // Função para reiniciar o autoplay após o período de inatividade
          function resetAutoplay() {
            clearTimeout(interactionTimeout)
            swiper.autoplay.start()
          }
        }
      }
    })
  }

  const hamburger = document.getElementById('menu-btn')
  const navLinks = document.getElementById('navLinks')

  // Abre ou fecha o menu ao clicar no botão hamburger
  hamburger.addEventListener('click', e => {
    navLinks.classList.toggle('show')
    e.stopPropagation() // Evita que o clique no botão também feche o menu
  })

  // Fecha o menu ao clicar em qualquer lugar fora dele
  document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('show')
    }
  })

    // Adição do Jingle e Aviso de Volume
    const jingle = document.createElement('audio')
    jingle.setAttribute('id', 'jingle')
    jingle.setAttribute('preload', 'auto')
    jingle.setAttribute('muted', 'muted') // Começa mutado
    jingle.innerHTML =
      '<source src="./sounds/jingle.mp3" type="audio/mpeg">Seu navegador não suporta esse elemento de áudio.'
    document.body.appendChild(jingle)
  
    const volumeNotice = document.getElementById('volume-notice')
  
    // Função para mostrar o aviso com atraso de 2 segundos
    function showVolumeNotice() {
      setTimeout(() => {
        volumeNotice.classList.remove('hidden')
        volumeNotice.classList.add('fade-in')
        startTimeout()
      }, 2000) // Avisa 2 segundos após carregar a página
    }
  
    // Função para esconder o aviso
    function hideVolumeNotice() {
      volumeNotice.classList.remove('fade-in')
      volumeNotice.classList.add('fade-out')
      setTimeout(() => {
        volumeNotice.classList.add('hidden')
        volumeNotice.classList.remove('fade-out')
      }, 500) // Tempo igual ao da transição suave
    }
  
    // Função para iniciar o timeout
    function startTimeout() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(hideVolumeNotice, 4000)
    }
  
    let timeoutId
  
    // Configura o botão "SIM"
    document.getElementById('play-jingle').addEventListener('click', () => {
      hideVolumeNotice()
      jingle.muted = false
      jingle.play()
    })
  
    // Configura o botão "NÃO"
    document.getElementById('no-jingle').addEventListener('click', () => {
      hideVolumeNotice()
    })
  
    // Exibe o aviso 2 segundos após a página carregar
    showVolumeNotice()
  
    // Função para verificar se o volume aumentou
    function checkVolume() {
      if (jingle.volume > 0) {
        jingle.muted = false
        jingle.play()
      }
    }

  // Unificando o comportamento de scroll para o header e o botão Back to Top
  window.onscroll = function () {
    const backToTopButton = document.getElementById('backToTopButton')
    const header = document.querySelector('header')

    // Mostra/esconde o botão "Back to Top"
    if (window.scrollY > 200) {
      backToTopButton.style.display = 'block'
    } else {
      backToTopButton.style.display = 'none'
    }

    // Adiciona/remove classe no header
    if (window.scrollY > 0) {
      header.classList.add('active')
    } else {
      header.classList.remove('active')
    }
  }

  document
    .getElementById('support-file')
    .addEventListener('change', function () {
      const fileName = this.files[0]
        ? this.files[0].name
        : 'Nenhum arquivo selecionado'
      document.getElementById('file-name').textContent = fileName
    })

  document
    .getElementById('support-form')
    .addEventListener('submit', function (e) {
      e.preventDefault()
      const fileInput = document.getElementById('support-file')
      if (fileInput.files.length === 0) {
        alert('Por favor, selecione um arquivo antes de enviar.')
        return
      }

      // Aqui você pode adicionar o código para o upload do arquivo para o Firebase ou qualquer outro backend
      alert('Arquivo enviado com sucesso: ' + fileInput.files[0].name)
    })

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
  // Cria e configura o modal
  const modal = document.createElement('div')
  modal.classList.add('modal')
  const modalContent = document.createElement('div')
  modalContent.classList.add('modal-content')
  const closeButton = document.createElement('button')
  closeButton.classList.add('modal-close')
  closeButton.innerHTML = '&times;'
  const closeButtonText = document.createElement('span')
  closeButtonText.classList.add('modal-close-text')
  closeButtonText.textContent = 'CLIQUE PARA SAIR'
  modalContent.appendChild(closeButton)
  modalContent.appendChild(closeButtonText)
  modal.appendChild(modalContent)
  document.body.appendChild(modal)

  modal.style.display = 'none'

  function openModal(content) {
    modalContent.innerHTML = ''
    modalContent.appendChild(closeButton)
    modalContent.appendChild(closeButtonText)
    modalContent.appendChild(content)
    modal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    const videoInModal = modalContent.querySelector('video')
    if (videoInModal) {
      videoInModal.pause()
      videoInModal.currentTime = 0
    }

    modal.style.display = 'none'
    document.body.style.overflow = ''
  }

  function setupModalForItems(items) {
    items.forEach(item => {
      const img = item.querySelector('img')
      const videoPlaceholder = item.querySelector('.video-placeholder')
      const fullVideo = item.querySelector('.full-video')

      if (img) {
        img.addEventListener('click', () => {
          const imgClone = img.cloneNode()
          imgClone.style.maxWidth = '90%'
          imgClone.style.maxHeight = '90%'
          imgClone.style.margin = 'auto'
          imgClone.style.display = 'block'
          openModal(imgClone)
        })
      }

      if (videoPlaceholder && fullVideo) {
        videoPlaceholder.addEventListener('click', () => {
          const videoClone = fullVideo.cloneNode(true)
          videoClone.style.maxWidth = '70%'
          videoClone.style.maxHeight = '90%'
          videoClone.controls = true
          videoClone.autoplay = true
          openModal(videoClone)
          videoClone.play()
        })
      }
    })
  }

  closeButton.addEventListener('click', closeModal)

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal()
    }
  })

  const carousels = document.querySelectorAll('.carousel')
  carousels.forEach(carousel => {
    initCarousel(carousel)
    const items = carousel.querySelectorAll('.carousel-item')
    setupModalForItems(items)
  })



  // Monitora mudanças de volume através das teclas de volume
  window.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'VolumeUp') {
      checkVolume()
    }
  })
})

var swiper = new Swiper('.swiper-container-testimonials', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true, // Garante que o slide ativo fique no centro
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50, // Ângulo de rotação
    stretch: 0, // Distância entre os slides
    depth: 300, // Profundidade do 3D
    modifier: 1,
    slideShadows: true // Adiciona sombras nos slides
  },

  loop: true, // Para fazer o loop dos slides
  on: {
    // Evento que ocorre quando o slide muda
    slideChange: function () {
      // Pausa todos os vídeos em todos os slides
      document.querySelectorAll('.swiper-slide video').forEach(video => {
        video.pause() // Pausa o vídeo
        video.currentTime = 0 // Reinicia o vídeo para o começo
      })

      // Obtém o vídeo do slide central (ativo)
      let activeSlideVideo = document.querySelector(
        '.swiper-slide-active video'
      )

      if (activeSlideVideo) {
        activeSlideVideo.setAttribute('playsinline', 'true') // Garante que não entre em tela cheia automaticamente
        activeSlideVideo.muted = true // Começa mudo
        activeSlideVideo.play() // Reproduz o vídeo do slide ativo
      }
    }
  }
})

// Função para verificar se é um dispositivo móvel
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent)
}

// Para dispositivos móveis, adicionar evento de toque para garantir a pausa dos vídeos
if (isMobileDevice()) {
  swiper.on('slideChangeTransitionEnd', function () {
    // Pausa todos os vídeos que não estão no slide central
    document.querySelectorAll('.swiper-slide video').forEach(video => {
      if (!video.closest('.swiper-slide-active')) {
        video.pause() // Pausa os vídeos nos slides que não estão ativos
        video.currentTime = 0 // Reinicia o vídeo para o começo
      }
    })

    // Reproduz o vídeo do slide central
    let activeSlideVideo = document.querySelector('.swiper-slide-active video')
    if (activeSlideVideo) {
      activeSlideVideo.play() // Reproduz o vídeo do slide ativo
    }
  })
}

// Prevenir tela cheia no iOS
document.querySelectorAll('video').forEach(video => {
  video.setAttribute('playsinline', 'true')

  // Monitorar eventos de fullscreen para ativar o som
  video.addEventListener('webkitbeginfullscreen', () => {
    video.muted = false // Desativa o mudo no modo fullscreen (iOS)
  })

  video.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      video.muted = false // Desativa o mudo no modo fullscreen (outros navegadores)
    }
  })

  // Previne entrada em fullscreen automático, se necessário
  video.addEventListener('webkitbeginfullscreen', event => {
    event.preventDefault() // Previne a entrada em tela cheia automática no iOS
  })
})

var swiper = new Swiper('.swiper-container-news', {
  grabCursor: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: true
  },
  loop: true
})
