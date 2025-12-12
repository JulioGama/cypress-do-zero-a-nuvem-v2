beforeEach(() => {
  cy.visit('src/index.html')
});


describe('Central de Atendimento ao Cliente TAT', () => {
  it('verifica o título da aplicação', () => {
    cy.title().should('equal', 'Central de Atendimento ao Cliente TAT')
  });

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.visit('src/index.html')

    cy.get('#firstName').type('Julio Gama')
    cy.get('#lastName').type('Netto')
    cy.get('#email').type('teste@teste.com.br')
  });

  it('exibe mensagem de sucesso ao submeter o formulário completo', () => {
    cy.visit('src/index.html')

    cy.get('#firstName').type('Julio')
      .should('have.value', 'Julio')
    cy.get('#lastName').type('Netto')
      .should('have.value', 'Netto')
    cy.get('#email').type('teste@teste.com.br')
      .should('have.value', 'teste@teste.com.br')
    cy.get('#phone').type('1234567890')
      .should('have.value', '1234567890')
    cy.get('#open-text-area').type('Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem ', { delay: 0 })
      .should('not.have.value', '')
    cy.get('#product').select('YouTube')
      .should('have.value', 'youtube')
    cy.clock()
    cy.get('button[type="submit"]').click()
    cy.get('.success')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type(' ')
    cy.get('#lastName').type(' ')
    cy.get('#email').type('testetestecombr')
    cy.get('#phone').type(' ')
    cy.get('#open-text-area').type(' ', { delay: 0 })
    cy.get('#product').select('YouTube')

    cy.get('button[type="submit"]').click()

    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')

    const campos = ['#firstName', '#lastName', '#email', '#open-text-area']

    campos.forEach(campo => {
      cy.get(campo).then($el => {
        const valor = $el.val().trim()

        if (!valor) {
          cy.log(`Campo com erro: ${campo} - está vazio: "${valor}"`)
        } else if (campo === '#email' && !valor.includes('@')) {
          cy.log(`Campo com erro: ${campo} - formatação inválida: "${valor}"`)
        }
      })
    })
  });

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Julio')
    cy.get('#lastName').type('Gama')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#open-text-area').type(' ', { delay: 0 })
    cy.get('#product').select('YouTube')
    cy.get('#phone-checkbox').check()
    cy.get('#phone').should('have.attr', 'required')
    cy.get('button[type="submit"]').click()

    cy.clock()
    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
  });

  it('seleção de itens em campos suspensos', () => {
    cy.get('#product').select('Blog')
    cy.get('#product').should('have.value', 'blog')
    cy.get('#product').select('youtube')
    cy.get('#product').should('have.value', 'youtube')
    cy.get('#product').select(3)
    cy.get('#product').should('have.value', 'mentoria')
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check()
      .should('have.value', 'feedback')
  });

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each($radio => {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  });

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
  });

  it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    cy.contains('Talking About Testing').should('be.visible')
  });

});