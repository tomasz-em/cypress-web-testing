/// <reference types="Cypress" />   
    // dodanie POWYŻSZEGO pozwala na koloryzowanie składni (nie ma też wyszarzenia)

Cypress.config().waitForAnimations = true;  // zapewnia wsparcie dla animacji, albo jakichś opóźnień w wyświetlaniu animacji
        // likiwduje to ostzreżenia w konsoli Cypressa

    describe("(nazwa tego scenariusza) PIERWSZY TEST", () => {
        it('(opis udanego działania/akcji) should open google.pl', () => {
            cy.visit('www.google.pl');  // polecenie przejścia pod wskazany URL 
        })
        
        it('(znajdowanie elementu i interakcja tekstowa) find searched phrase - "Programista Frontend WSB Wrocław"', () => {
            cy.get('.gLFyf').type('Programista Frontend WSB Wrocław{enter}');  // GET - odszukanie istniejącego elementu na stronie po jego atrybutach (id/klasa/element lub/i krotność jego lub korelacje)
                // jeśli NIE będzie to JEDNOZNACZNE WSKAZANIE ELEMENTU (pojedynczy!) , to błąd w konsoli cypressa
                // TYPE - wpisuje znak po znaku żądaną zawartość do pola tekstowego; można dać [Enter] z automatu na koniec, dopisując OD RAZU PO SZUKANYM CIĄGU {enter}
                //... zatwierdzenie wpisania dla elementu, czyli SUBMIT dla całego formularza
        })

        // lokalizacja listy wyników i oczekiwany element... najlepiej pobrać kontener rodzica lub przodka, który zawiera listę wyników wyszukiwania
            // '#center_col' jako bezpośredni kontener lub jego jakiś przoedek '#fullpage'
        it('find phrase', () => {
            cy.get('#center_col').contains("Program studiów podyplomowych na kierunku Programista Front-End z Angular w WSB we Wrocławiu")  // treść skopiowana z wyniku wyszukiwania...
                .click({force: true}); // opcja FORCE wymusza 
            // określenie elementu na stronie, uzględniając ewentualne reklamy wśród wyników wyszukiania (na górze)
        })

    })