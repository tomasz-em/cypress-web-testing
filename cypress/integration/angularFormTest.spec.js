/// <reference types="Cypress" />   
    // dodanie POWYŻSZEGO pozwala na koloryzowanie składni (nie ma też wyszarzenia)

require('cypress-xpath');

Cypress.config().waitForAnimations = true;  // zapewnia wsparcie dla animacji, albo jakichś opóźnień w wyświetlaniu animacji
    // likiwduje to ostzreżenia w konsoli Cypressa

/* 
    TESTY WYKORZYSTUJĄ PROJEKT Jasona Wathmore'a:
        info: https://jasonwatmore.com/post/2020/04/28/angular-9-user-registration-and-login-example-tutorial
        git: https://github.com/cornflourblue/angular-9-registration-login-example

    WYMAGANE TAKŻE LIKOWANIE DO TEGO PROJEKTU URUCHOMIONEGO LOKALNIE LUB WYSTAWIONEGO NA ZEWNĄTRZ
        - tu przyjęto uruchomioną lokalnie wersję, w razie różnicy wyedytuj zawartość zmiennej "siteURL"!!!
*/

const siteURL = "http://localhost:4200",    // UWAGA: wymagane uruchomienie (hostowanie) projektu w przed tesowaniem na tym adresie!
    registerSubpageURL = siteURL + '/account/register',
    loginSubpageURL = siteURL + '/account/login',
    testUserName = "Paul",
    testUserLastname = "Raul",
    testUserLoginProposal = "VivaLaMexico",
    testUserPassword = "$3cr3T",
    testUserShortPassword = "5h0Rt",
    successRegisterNotification = "Registration successful",
    failureRegisterNotification = "",
    shortPasswordWarning = "Password must be at least 6 characters";

const confirmURL = ( url ) => {
    // LOCATION pobiera adres URL z paska adresu okna
    cy.location().should( (loc) => {
        expect( loc.href).to.be.eq( url );
    });
}

    // PARAMETRYZACJA:
describe('Testy dla Formularzy zbudowanych na Angularze', () => { // projekt na zewnątrz, nie w podległościach

    it('Otwarcie witryny z formularzem', () => {
        cy.visit( siteURL );
    })

    it('Przejście z witryny początkowej (logowania) do podstrony rejestracji', () => {
        cy.xpath('//a[@href="/account/register"]').click(); // wyszukanie elementu i przejście do podstrony
    })

    it('Ścieżka PRAWIDŁOWEJ rejestracji - uzupełnienie pól formularza rejestracyjnego', () => {

        cy.visit( registerSubpageURL ); // otwarcie podstrony rejestarcji od razu
        cy.get(':nth-child(1) > .form-control').type( testUserName );   // dziecko PIERWSZEGO elementu (pierwszego dziecka) to "pierwownuczek"?!
        cy.get('.form-control').eq(1).type( testUserLastname ); // eq() numeruje elementy jak indeksy w tablicy (od zera!)
        cy.get('.form-control').eq(2).type( testUserLoginProposal );
        cy.get('.form-control').last().type( testUserPassword );

        // cy.wait(2000);  // niewielkie opóźnienie przed zatwierdzeniem wysłania formularza 
        cy.get('.btn.btn-primary').click(); // akceptacja wpisanej zawartości
        cy.get('.alert').first().should('be.visible');  // pojawiło się powiadomienie / nowy element
        cy.get('.alert').first().should('to.have.class', 'alert-success');  // element alertu w "pozytywnym przybraniu"
        cy.get('.alert > span').should('have.text', successRegisterNotification );  // zgodna treść powidaomienia

    })

        // pobawić się testami, dokończyć działanie testami dla przypadków różnych
   
    it('Ścieżka NIEUDANEJ rejestracji - brak uzupełnienia wszystkich wymaganych pól formularza', () => {

        cy.visit( registerSubpageURL ); // początek na zarejestruj się
      // niewielkie opóźnienie przed zatwierdzeniem wysłania formularza 
        cy.get('.btn.btn-primary').click(); // akceptacja wpisanej zawartości

        cy.get('.is-invalid').should('to.have.lengthOf', 4);  // cztery dodane klasy dla czterech wymaganych pól   // RACZEJ: "to.have.lengthOf(4)"
        cy.get('.invalid-feedback').should('have.length', 4);  // cztery powiadomienia pod polami
        
        confirmURL( registerSubpageURL ); // nadal pownien pozostać na stronie rejestracji, bez przejscia na inny adres
    })    


    it('Ścieżka NIEPEŁNEJ rejestracji - OD POCZĄTKU', () => {
        cy.visit( siteURL );
        cy.xpath('//a[@href="/account/register"]').click(); // wyszukanie elementu i przejście do podstrony

        cy.get(':nth-child(1) > .form-control').type( testUserName );   // dziecko PIERWSZEGO elementu
        cy.get('.form-control').eq(1).type( testUserLastname ); // eq() numeruje elementy jak indeksy w tablicy (od zera!)
        // cy.get('.form-control').eq(2).type( BRAK__WARTOŚCI ); // SPECJALNIE PUSTE I ZAKOMENTOWANE; nieuzupełnione pole przed wysłaniem formularza

        cy.get('.form-control').last().type( testUserShortPassword );  

        // cy.wait(1000);  // jeszcze mniejsze  opóźnienie przed zatwierdzeniem wysłania formularza
        cy.get('form').submit(); // akceptacja wpisanej zawartości JAKĄKOLWIEK DROGĄ wysłania formularza
            // podczas zdarzenia SUBMIT są weryfikowne stany pól formularzy

        cy.get('.form-control').eq(2).should('to.have.class', 'is-invalid').and('to.have.class', 'ng-invalid');// "is-invalid ng-invalid"; po doklejeniu aby zweryfkować dwie klasy niemal naraz
        
        cy.get('.invalid-feedback').last().should('to.have.text', shortPasswordWarning); 
        // 


    })

})