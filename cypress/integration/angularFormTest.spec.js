/// <reference types="Cypress" />   
    // dodanie POWYŻSZEGO pozwala na koloryzowanie składni (nie ma też wyszarzenia)

require('cypress-xpath');   //!!! WYMAGANE DLA UŻYCIA zapytań DOM w stylu 'xpath'; REQUIRE nad IMPORT

Cypress.config().waitForAnimations = true;  // zapewnia wsparcie dla animacji, albo jakichś opóźnień w wyświetlaniu animacji
    // likwiduje to ostrzeżenie w konsoli Cypressa

    // ustalenie rozmiaru okna przeglądarki na sztywno - dla danego testu/projektu
    // cy.viewport(500, 700);
Cypress.config().viewportWidth = 600;    
Cypress.config().viewportHeight = 700;    
    // powyższe nie działa... czy da się ustawić wielkość okna pod dany test

/* 
    TESTY WYKORZYSTUJĄ PROJEKT Jasona Wathmore'a:
        info: https://jasonwatmore.com/post/2020/04/28/angular-9-user-registration-and-login-example-tutorial
        git: https://github.com/cornflourblue/angular-9-registration-login-example

    WYMAGANE TAKŻE LINKOWANIE DO TEGO PROJEKTU URUCHOMIONEGO LOKALNIE LUB WYSTAWIONEGO NA ZEWNĄTRZ
        - tu przyjęto uruchomioną lokalnie wersję, w razie różnicy wyedytuj zawartość zmiennej "siteURL"!!!
*/

const siteURL = "http://localhost:4200",    // UWAGA: wymagane uruchomienie (hostowanie) projektu w przed tesowaniem na tym adresie!
    registerSuffixURL = '/account/register',
    registerSubpageURL = siteURL + registerSuffixURL,
    loginSuffixURL = '/account/login',
    loginSubpageURL = siteURL + loginSuffixURL,
    testUserName = "Paul",
    testUserLastname = "Raul",
    testUserLoginProposal = "VivaLaMexico",
    testUserPassword = "$3cr3T",
    testUserShortPassword = "5h0Rt",
    successRegisterNotification = "Registration successful",
    failureRegisterNotification = "WHO KNOWS IT?!",    // jak trafić na takowe powiadomienie?
    shortPasswordWarning = "Password must be at least 6 characters";

const confirmURL = ( url ) => {
    // LOCATION() pobiera adres URL z paska adresu okna
    cy.location().should( (loc) => {
        expect( loc.href).to.be.eq( url );
    });
}

    // PARAMETRYZACJA:
describe('Testy dla formularzy zbudowanych na Angularze - NAWIGOWANIE', () => { // projekt na zewnątrz, nie w podległościach!

    it('Otwarcie witryny z formularzem', () => {
        cy.visit( siteURL );
    })

    it('Przejście z witryny początkowej (logowania) do podstrony rejestracji', () => {
        cy.visit( loginSubpageURL );    // dla unieknięci abłędów powtórzenie STARTU od zadanej lokalizacji, by nawigować
        cy.xpath(`//a[@href="${registerSuffixURL}"]`).click() // wyszukanie elementu i przejście do podstrony rejestracji; od teraz z użyciem zmiennych
    })

    it('Naprzemienne przejście z podstrony rejestracji do logowania i spowrotem (zawsze)', () => {
        cy.visit( loginSubpageURL );    // zaczynamy od logowania
        cy.xpath(`//a[@href="${registerSuffixURL}"]`).click(); // wyszukanie elementu i przejście do rejestracji
        cy.xpath(`//a[@href="${loginSuffixURL}"]`).click(); // ...powrót przez "anuluj"
        cy.xpath(`//a[@href="${registerSuffixURL}"]`).click(); // ...i kolejny powrót
    })

})  // describe('Testy dla formularzy zbudowanych na Angularze - NAWIGOWANIE'-END

describe('Ścieżka PRAWIDŁOWEJ rejestracji', () => {

    it('Uzupełnienie pól formularza rejestracyjnego...', () => {
        cy.visit( registerSubpageURL ); // otwarcie podstrony rejestarcji od razu
        cy.get(':nth-child(1) > .form-control').type( testUserName );   // dziecko PIERWSZEGO elementu (pierwszego dziecka) to "pierwownuczek"?!
        cy.get('.form-control').eq(1).type( testUserLastname ); // eq() numeruje elementy jak indeksy w tablicy (od zera!)
        cy.get('.form-control').eq(2).type( testUserLoginProposal );
        cy.get('.form-control').last().type( testUserPassword );
    })

        // ...BEZGLĘDNIE JAKO KONTYNUACJA POPRZEDNIEGO TESTU!!!
    it('... i wysyłka treści formularza z powiadomieniem o sukcesie...', () => {
        // cy.wait(2000);  // niewielkie opóźnienie przed zatwierdzeniem wysłania formularza 
        cy.get('.btn.btn-primary').click(); // akceptacja wpisanej zawartości
        cy.get('.alert').first().should('be.visible');  // pojawiło się powiadomienie / nowy element
        cy.get('.alert').first().should('to.have.class', 'alert-success');  // element alertu w "pozytywnym przybraniu"
        cy.get('.alert > span').should('have.text', successRegisterNotification );  // zgodna treść powidaomienia
    })

    it('... z przekierowaniem na formularz logowania', () => {
        confirmURL( loginSubpageURL );
    })

})  // describe('Ścieżka PRAWIDŁOWEJ rejestracji'-END

        // pobawić się testami, dokończyć działanie testami dla różnych przypadków

describe('Ścieżka NIEUDANEJ rejestracji', () => { 
    it('Brak uzupełnienia WSZYSTKICH wymaganych pól zablokuje wysłanie formularza', () => {
        cy.visit( registerSubpageURL ); // początek na zarejestruj się
      // niewielkie opóźnienie przed zatwierdzeniem wysłania formularza 
        cy.get('.btn.btn-primary').click(); // akceptacja wpisanej zawartości

        cy.get('.is-invalid').should('be.visible').and('to.have.lengthOf', 4);  // cztery dodane klasy dla czterech wymaganych pól   // RACZEJ: "to.have.lengthOf(4)"
        cy.get('.invalid-feedback').should('have.length', 4);  // cztery powiadomienia pod polami
        
        confirmURL( registerSubpageURL ); // nadal pownien pozostać na stronie rejestracji, bez przejscia na inny adres
    })    


    it('Ścieżka NIEPEŁNEJ rejestracji: opuszczenie zawartośći pola i krótsza zawartość', () => {
        cy.visit( siteURL );
        cy.xpath('//a[@href="/account/register"]').click(); // wyszukanie elementu i przejście do podstrony

        cy.get(':nth-child(1) > .form-control').type( testUserName );   // dziecko PIERWSZEGO elementu
        cy.get('.form-control').eq(1).type( testUserLastname ); // eq() numeruje elementy jak indeksy w tablicy (od zera!)
        // cy.get('.form-control').eq(2).type( BRAK__WARTOŚCI ); // SPECJALNIE PUSTE I ZAKOMENTOWANE; nieuzupełnione pole przed wysłaniem formularza

        cy.get('.form-control').last().type( testUserShortPassword );  
        cy.get('form').submit(); // akceptacja wpisanej zawartości JAKĄKOLWIEK DROGĄ wysłania formularza
            // podczas zdarzenia SUBMIT są weryfikowne stany pól formularzy

        cy.get('.form-control').eq(2).should('to.have.class', 'is-invalid').and('to.have.class', 'ng-invalid');// "is-invalid ng-invalid"; po doklejeniu aby zweryfkować dwie klasy niemal naraz
        cy.get('.invalid-feedback').last().should('be.visible').and('to.have.text', shortPasswordWarning); 
    })

})  // describe('Ścieżka NIEUDANEJ rejestracji'-END

/* dodać:
    * zachowanie "naprawcze" przy podaniu niepełnych treści
        - jak zachowa się element od wyświetlania powiadomień po wprowdzeniu treści lub ich wymaganej długości?
*/

// JAK SIĘ ZALOGOWAĆ NA TEJ WITYNIE? JAKIE SĄ POŚWIADCZENIA?

