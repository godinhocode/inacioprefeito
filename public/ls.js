function displayQuestions() {
  const questionsList = document.getElementById('questions-carousel')

  db.collection('questions')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        // Se não houver perguntas, oculte a seção
        questionsList.style.display = 'none'
      } else {
        questionsList.style.display = 'block' // Certifique-se de que seja visível quando houver perguntas
        questionsList.innerHTML = '' // Limpa a lista

        snapshot.forEach(doc => {
          const questionData = doc.data()

          const campaignLogoUrl =
            'https://lh3.googleusercontent.com/a/AEdFTp5Qglmr2lfLnCMmAlOqdVushdlJIG1TufcSft7DdX4=s96-c'

          const questionElement = document.createElement('div')
          questionElement.classList.add('swiper-slide')

          questionElement.innerHTML = `
            <div class="question-item">
              <p><strong>Pergunta:</strong> ${questionData.question}</p>
              ${
                questionData.answered
                  ? `<div class="answer-container">
                      <div class="answer-content">
                        <img src="${campaignLogoUrl}" alt="Logo da Campanha" class="user-image">
                        <p><strong>Resposta:</strong> ${questionData.answer}</p>
                      </div>
                    </div>`
                  : '<p>Aguardando resposta...</p>'
              }
              ${
                !questionData.answered
                  ? `<form class="answer-form" data-id="${doc.id}">
                    <input type="text" class="answer-input" placeholder="Digite a resposta" required>
                    <button type="submit">Enviar Resposta</button>
                  </form>`
                  : ''
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
