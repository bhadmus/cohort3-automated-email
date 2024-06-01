
describe('Sign Up Journeys', () => {
  it('Test Sign up', () => {
    cy.clickSignUpButtonOnHomePage()
    cy.insertBasicDetails()
    cy.insertSocialDetailsAndSignUp()
    cy.verifyOTPPage()
    cy.insertOTP()
  })
})