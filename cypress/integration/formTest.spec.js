/// <reference types="Cypress" />   
    // dodanie POWYŻSZEGO pozwala na koloryzowanie składni (nie ma też wyszarzenia)

    // a tego PONIŻEJ zezwala na użycie wyszukwiania przez XPATH (użycie dalej w treści)
require('cypress-xpath');   // ALE NAJPIERW TZREBA ZAŁĄCZYĆ (EWENTUALENIE "import from ''")

Cypress.config().waitForAnimations = true;  // zapewnia wsparcie dla animacji, albo jakichś opóźnień w wyświetlaniu animacji
    // likiwduje to ostzreżenia w konsoli Cypressa

    // PARAMETRYZACJA:
// import z pliku 
import { parametersForAccountManagerUser } from '../fixtures/parameters';   // UOGULENIENIE DANYCH STATYCZNYCH, pobranych z Zewnątrznego pliku

const siteURL = 'https://frontendpodyplomowe.github.io/logging/';   // to jest adres główny dla tej witryny (jak widać zawiera "/" na końcu!)
    // też trzeba było PROTOKÓŁ dopisać n apoczątku
        // ale też są podstrony, więc adresy się zmieniają
const registerURL = parametersForAccountManagerUser.formURL + 'register.html',
    loginURL = parametersForAccountManagerUser.formURL + 'index.html',
    loggedURL = parametersForAccountManagerUser.formURL + 'login.html';

const testUserLogin = "tester",
    testUserPassword = "123",
    submitButtonText = "Załóż konto",
    role = "Account Manager",
    siteSubtitle = "Zaloguj się do naszego super bezpiecznego systemu!",
    loginButtonText = "Zaloguj się!",
    linkText = "Zarejestruj się!";   // tu nie wpisano NAJPIERW "!" na końcu, aby test się wywalił po uruchomieniu

// metoda na weryfikację URL, pomocnicze, by nie powielać tego kodu wewnątzr kilku testów/asercji
const confirmURL = ( url ) => {
    // LOCATION pobiera adres URL z paska adresu okna
    cy.location().should( (loc) => {
        expect( loc.href).to.be.eq( url );
    })
}


        // aplikacja posiada system uprawnień dla poszczególnych użytkwowników - ról

describe("Operowanie na formularzu logowania/rejestracji prostej witryny", () => {

    it('Otwarcie witryny z formularzem: ', () => {
        cy.visit( parametersForAccountManagerUser.formURL );  // polecenie przejścia pod wskazany URL 
    })

    it('Weryfikacja zawartości elementów formularza', () => {
            // ta długa lista parametrów jest właśnie po to, aby wiedzieć CO DKOŁADNIE PRZEKAZANO do funkcji 
        cy.verifyMyLoginForm( parametersForAccountManagerUser.role, parametersForAccountManagerUser.siteSubtitle, 
                    parametersForAccountManagerUser.loginButtonText, parametersForAccountManagerUser.linkText );

        // cy.verifyMyLoginFormByObject( parametersForAccountManagerUser ); // tu na modłę obiektową, NIBY JEST NA ODWRÓT Z CZYTELNOŚCIĄ?!

        /* // PONMIŻSZE przenesiono do pliku "support/commands.js"
        cy.get('.container').should('contain', parametersForAccountManagerUser.role );   // CONTAIN() != CONTAINS()
        cy.get('.container').should('contain', parametersForAccountManagerUser.siteSubtitle );
        cy.get('#login').should('exist');
        cy.get('#password').should('exist');
        cy.get('button').should('exist').and('have.text', parametersForAccountManagerUser.loginButtonText );
        cy.get('a[href="register.html"]').should('exist').and('have.text', parametersForAccountManagerUser.linkText ); 
         */


    })

 
    it('Formularz - rejestarcja użytkownika', () => {
        cy.get('a').should('exist').click();   // GET  tu bierze jedyny dostępny element n aTEJ , a nie listę 
            // EXIST albo cokolwiek na istnienie tego jednego odnośnika (np. "be.visible")
                // CLICK od razu pokazuje czerwoną notyfikację
        confirmURL( registerURL );

        cy.get('#login').type( testUserLogin ); // namiary na elementy odczytane ze źródła
        cy.get('#password').type( testUserPassword );   // dopsanie ustaloinych wartości na pola frmuaklzra
        cy.get('button').should('have.text', submitButtonText ).click();

        confirmURL( loginURL ); // weryfikacja czy wiyna jest już na docelowej witryni, czy "błąd 404"
    })

        // użycie z XPATH - ścieżką do elementu w DOMie; przydaje się do precyzyjnego określania elementów na www
        // np. "//tag[@attribute='value']" -- tak są dwa "//"!, TAG to wybór 
                // WYMAGANE DOINSTALWOANIE PACZKI z npm jako plugin: "cypress-xpath": 'npm install cypres-xpath --save-dev
    it('Formularz - logowanie użytkownika', () => {
            // NIE KORZYSTA Z PACZKI XPATH, mimo zainstalowania
                // WŁASNA funkcja z  "commands.js"
        cy.registrationToMyApp( parametersForAccountManagerUser.testUserLogin, parametersForAccountManagerUser.testUserPassword );  // lekki nadkłąd pracy przy wywołaniu ...o
/*         cy.xpath('//input[@name="login"]').type( parametersForAccountManagerUser.testUserLogin );   // wypełnienie obu pól
        cy.xpath('//input[@name="password"]').type( parametersForAccountManagerUser.testUserPassword ); */
        //cy.xpath('//buton[contains(text(), "Zaloguj się!")]').click();  // porównanie tekstu z treścią przycisku
        cy.xpath('//button[contains(text(), "Zaloguj się!")]').click();   // skopiowane albo to to samo, a błąd dalej jest
        cy.wait(3000);  // czekanie na efekt pracy, aby ekran nie mignął

        //cy.window() pozwala na dostęp do wszystkich obiektów witryny, też localStorage, Promise, ...
        cy.window().then( $win => {
            expect( $win.localStorage.getItem('logged')).to.equal('1');
        });
        
        confirmURL( loggedURL );
    });

                // coś miałem zrobić ale XPATH nie działał po reinstalacjach, a nie był podpięty do pliku testów :/
                // ZADANIE: chyba chodziło o wyszukanie tekstu komunkatu dla zalogowanego usera  i wykonanie akcji wylogowania
    it("Formularz - wylogowanie użytkownika", () => {
        cy.get("#welcomemsg").should("have.text", "Witaj " + testUserLogin + "!");
        cy.xpath('//button[contains(text(),"Wyloguj się")]').click();
        confirmURL( loginURL ); // vs loggedURL
    });

/* 

[12:15] Piotr R.

it("Form - logout user", () => {
cy.get("#welcomemsg").should("have.text", "Witaj " + testedLogin + "!");
cy.xpath('//button[contains(text(),"Wyloguj się")]').click();
confirmURL(loginURL);
  });


  ​[12:15] Bartosz K.

cy.xpath('//h3').should('have.text','Witaj tester!')
cy.xpath('//button[contains(text(),"Wyloguj się")]').click()
confirmURL(loginURL)


​[12:16] Yevheniia N.

cy.get("#logout").click();
confirmURL(loginURL);


​[12:16] Andrzej M.

it('Form - logout', ()=>{
cy.xpath('//button[contains(text(),"Wyloguj się")]').click();
confirmURL(loginURL )
    })


[12:17] Iryna P.

cy.window().then($win => {
            expect($win.localStorage.getItem('users')).to.eq('[{"user":"tester","pass":"123"}]');
        });
        cy.xpath('//button[contains(text(),"Wyloguj się")]').click();


[12:27] Iryna P.
    albo z wyniesieniem do konstanty: 
​
const usersFromStorage = '[{"user":"'+ testedLogin + '","pass":' + '"'+ testedPassword +'"}]';

// i dalej:

cy.window().then($win => {
            expect($win.localStorage.getItem('users')).to.eq(usersFromStorage);
        });

<https://teams.microsoft.com/l/message/19:7f61f5757a0e4580921639491111e995@thread.tacv2/1590920862875?tenantId=dc392050-d918-4752-8471-0c1bda4ebb5f&amp;groupId=b518f2bd-18e5-482f-8952-da200adb64f2&amp;parentMessageId=1590857652563&amp;teamName=ProgramistaFrontend_GR1_Grzegorz_Mazur_Zjazd9W_niedziela&amp;channelName=Ogólny&amp;createdTime=1590920862875>
*/

})
