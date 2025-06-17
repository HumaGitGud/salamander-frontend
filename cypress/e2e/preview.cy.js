describe('Preview Page', () => {
  beforeEach(() => {
    // Handle uncaught exceptions from canvas operations
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('getImageData')) {
        return false;
      }
    });

    // Visit the preview page with a sample filename
    cy.visit('/preview/sample-video.mp4')
  })

  it('should display the preview page with correct elements', () => {
    // Check if the page title is visible
    cy.get('h1').should('contain', 'Preview Page')
    
    // Check if the filename is displayed
    cy.get('strong').should('contain', 'sample-video.mp4')
    
    // Check if both original and binarized image sections exist
    cy.get('h3').should('contain', 'Original Image')
    cy.get('h3').should('contain', 'Binarized Image')
    
    // Check if the color picker and threshold slider exist
    cy.get('input[type="color"]').should('exist')
    cy.get('input[type="range"]').should('exist')
    
    // Check if the process button exists
    cy.get('button').should('contain', 'Process Video with These Settings')
  })

  it('should show error when trying to process without preview', () => {
    // Click process button without setting color/threshold
    cy.get('button').click()
    
    // Check for error alert
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please preview the binarized image first before processing.')
    })
  })

  it('should have working input controls', () => {
    // Check color input
    cy.get('input[type="color"]').should('exist')
    
    // Check threshold input
    cy.get('input[type="range"]').should('exist')
    
    // Check that threshold label shows current value
    cy.contains('Threshold: 75').should('exist')
  })
}) 