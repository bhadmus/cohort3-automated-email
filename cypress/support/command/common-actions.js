import {faker} from '@faker-js/faker'
let home
let basic
let social
let otpPage
let inboxId
before('load all element locators', ()=>{
    cy.fixture('element-mapper').then((ele)=>{
        home = ele.homePage
        basic = ele.baseDetails
        social = ele.socialDetails
        otpPage = ele.otpPage
    })
})

Cypress.Commands.add('clickSignUpButtonOnHomePage', ()=>{
    cy.clickAnyElement(home.homeSignUpButton)
})

Cypress.Commands.add('insertBasicDetails', ()=>{
    cy.typeAnyText(basic.fullNameField, faker.person.fullName())
    cy.typeAnyText(basic.bizNameField, faker.company.buzzVerb())
    cy.insertEmail()
    cy.typeAnyText(basic.bizPhoneField, faker.phone.number('+23481########'))
    cy.typeAnyText(basic.bizRegNumField, 'RC-7834')
    cy.clickAnyElement(basic.nextButton)
})

Cypress.Commands.add('insertSocialDetailsAndSignUp', ()=>{
        cy.typeAnyText(social.websiteField, faker.internet.domainName());
        cy.typeAnyText(social.instagramField, faker.internet.displayName());
        cy.typeAnyText(social.twitterField, faker.internet.displayName());
        cy.clickAnyElement(social.infoSourceField)
        cy.clickAnyElement(social.infoOptionDropdown)
        cy.typeAnyText(social.passwordField, 'Pa$$w0rd!');
        cy.clickAnyElement(social.signUpButton)
})

Cypress.Commands.add('verifyOTPPage', ()=>{
    cy.get(otpPage.thankYouHeader).should('be.visible').and('have.text', 'Thank you for Signing up with Mima.')
})

Cypress.Commands.add('insertEmail', ()=>{
    cy.mailslurp().then(emailCreator => emailCreator.createInbox().then(inbox =>{
        inboxId = inbox.id
        const emailAddress = inbox.emailAddress
        cy.typeAnyText(basic.bizEmailField, emailAddress)

        const loginDetails = `
                {
                    "email": "${emailAddress}",
                    "password": "Pa$$w0rd!"
                }
        `
        cy.writeFile('cypress/fixtures/login-details.json', loginDetails)
    }))
})

Cypress.Commands.add('insertOTP', ()=>{
    cy.mailslurp().then(emailExtractor => emailExtractor.waitForLatestEmail(inboxId, 30000, true)).then(email =>{
        const emailBody = email.body
        const docParser = new DOMParser()
        const document = docParser.parseFromString(emailBody, "text/html")
        const otpCode = document.querySelector('tr:nth-child(2) p:nth-child(3)').textContent
        const otpValue = otpCode.trim()

        cy.get('input').each(($el, index)=>{
            cy.wrap($el).should('exist').fill(otpValue[index])
        })
        cy.log(otpValue)
    })
})