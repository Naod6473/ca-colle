// Cas en italien (node tests/run.js it) : offres et CV fictifs, personnes et entreprises inventées.
CASES.push(
{
  name: "Magazzino (esempio dell'app)", lang: "it", offer: I18N.offer, cv: I18N.cv,
  ok: ["Preparazione ordini", "Controllo qualità", "Patente B", "Lavoro di squadra", "Puntualità", "Ricevimento merce", "2 anni di esperienza", "Turni e orari variabili"],
  mid: ["Gestione delle scorte", "Excel", "Precisione"], no: ["Patentino muletto (carrello elevatore)", "Inglese", "Inserimento dati"], minPoints: 12
},
{
  name: "Cassiera in un supermercato", lang: "it",
  offer: `Addetta/o cassa – tempo determinato 6 mesi – Napoli
Mansioni:
- Gestione della cassa e chiusura giornaliera
- Accoglienza della clientela e informazioni sui prodotti
- Gestione dei resi e dei reclami
- Apertura e chiusura del negozio
Requisiti:
- Almeno 1 anno di esperienza in un ruolo simile
- Diploma di scuola superiore gradito
- Predisposizione al contatto con il pubblico, persona sorridente
- Disponibilità a lavorare nei fine settimana
- Conoscenze informatiche di base`,
  cv: `Sara Esposito · Napoli · sara.esposito@posta.example · 340 111 2233
Esperienze
Cassiera, Mercato Esempio (2019 - 2024): accoglienza e incasso di 250 clienti al giorno, apertura del negozio il sabato, gestione dei resi.
Cameriera, Trattoria del Porto (2016-2019): servizio ai tavoli, 80 coperti.
Competenze
Word, sorridente, lavoro di squadra
Formazione
Qualifica professionale di Operatore ai servizi di vendita (2016)`,
  ok: ["Gestione della cassa", "Accoglienza clienti", "1 anno di esperienza", "Servizio clienti"], mid: ["Strumenti informatici", "Predisposizione al contatto"], no: ["Diploma di scuola superiore"],
  absent: ["Servizio in sala"]
},
{
  name: "Cameriere in un ristorante", lang: "it",
  offer: `Cameriere / Cameriera di sala
Mansioni
Accogliere i clienti e prendere le ordinazioni
Servizio ai tavoli in sala e in terrazza
Apparecchiare e sparecchiare i tavoli
Incassare i conti alla fine del pasto
Profilo
Esperienza nella ristorazione gradita
Lavoro nei fine settimana e nei giorni festivi
1.400 € netti al mese, 40 ore settimanali`,
  cv: `Luca Bianchi · Rimini · luca.bianchi@esempio.it · 347 000 1122
Esperienze
Cameriere, Osteria Esempio (2018-2022): servizio di 60 coperti, mise en place della sala, incasso dei conti.
Competenze
HACCP, inglese fluente`,
  ok: ["Servizio in sala", "Gestione della cassa"], no: ["Accoglienza clienti", "Turni e orari variabili"],
  ad: {facts: {salary: "1.400 € netti al mese", hours: "40 ore settimanali"}, missing: ["contract", "place"], noFlags: true}
},
{
  name: "Infermiera in una RSA", lang: "it",
  offer: `Infermiere/a – RSA Villa Esempio – Torino
Cerchiamo un infermiere per il nostro reparto di 60 ospiti anziani non autosufficienti.
Mansioni:
- Somministrazione della terapia e medicazioni
- Igiene della persona in collaborazione con gli operatori
- Compilazione della cartella clinica con riservatezza
- Lavoro su turni, anche notturni
Requisiti:
- Laurea in Infermieristica e iscrizione OPI obbligatorie
- Capacità di ascolto e pazienza
- Lavoro di squadra
- Esperienza di almeno 2 anni in struttura`,
  cv: `Elena Ferri · Torino · elena.ferri@esempio.it · 333 444 5566
Esperienze
Infermiera, Casa di cura Esempio (2020 - oggi): reparto di 40 pazienti anziani, terapie e medicazioni, turni di notte, lavoro in squadra con 8 OSS.
Tirocinio, Ospedale Esempio (2019): reparto di medicina.
Formazione
Laurea in Infermieristica, Università Esempio (2019), iscrizione OPI 2020
Competenze
Ascolto, riservatezza, primo soccorso`,
  ok: ["Infermieristica", "Titolo di studio: Laurea in Infermieristica", "Assistenza agli anziani", "Turni e orari variabili", "Lavoro di squadra", "2 anni di esperienza"], mid: ["Capacità di ascolto", "Riservatezza"], no: ["Igiene della persona"],
  absent: ["Qualifica OSS"]
},
{
  name: "Tecnico helpdesk (annuncio senza elenchi puntati)", lang: "it",
  offer: `Tecnico IT di primo livello

In collaborazione con il responsabile dei sistemi, ti occuperai di:

Supporto agli utenti di primo e secondo livello tramite il service desk
Gestione degli account utenti in Active Directory
Installazione di postazioni Windows 11 e dei software aziendali
Gestione del parco informatico e dell'inventario hardware
Redazione di procedure tecniche per il team

Requisiti: diploma tecnico, 2 anni di esperienza in un ruolo simile, buona conoscenza dell'inglese tecnico.
Si offre contratto a tempo indeterminato, RAL 28.000 € lordi annui.
Sede di lavoro: Padova`,
  cv: `Marco Galli · Padova · marco.galli@esempio.it · 349 000 7788
Esperienze
Tecnico di supporto, Esempio Informatica (2021 - 2024): help desk per 300 utenti, 30 ticket al giorno, installazione di 150 postazioni Windows 11, gestione degli account in Active Directory.
Formazione
Diploma tecnico in informatica, Istituto Esempio (2020)
Competenze
Windows, Office 365, reti LAN, inglese`,
  ok: ["Supporto agli utenti", "Active Directory", "Account e permessi", "Distribuzione del software", "2 anni di esperienza", "Diploma tecnico"], no: ["Gestione del parco IT", "Documentazione tecnica"], mid: ["Inglese"],
  ad: {facts: {contract: "tempo indeterminato", salary: "RAL 28.000 € lordi annui", place: "Padova"}, noFlags: true}
},
{
  name: "Controllo annuncio e rilettura del CV", lang: "it",
  offer: `Addetto vendite – part time – Firenze
Guadagna fino a 500 € al giorno! Quota di iscrizione di 30 € per iniziare.
Contattaci su Telegram o scrivi a lavoro.facile@libero.it, invia il tuo IBAN.`,
  cv: `Paolo Neri · Firenze · paolo@esempio.it · 333 999 0000
Esperienze
Commesso, Negozio Esempio (2019 - 2023): mi sono occupato di varie attività nel negozio, con un approccio efficente e una buona conoscienza dei prodotti di elettronica per la casa e il tempo libero.
Competenze
Vendita, cassa`,
  ad: {facts: {hours: "part time", place: "Firenze"}, missing: ["contract"], flags: ["pay", "tooGood", "chat", "mail"]},
  review: {typos: [["efficente", "efficiente"], ["conoscienza", "conoscenza"]], types: ["weak", "nonum"]}
},
{
  name: "Pulizia di un annuncio copiato da un sito", lang: "it", clean: {removed: ["Candidati ora", "Salva annuncio", "Pubblicato 3 giorni fa", "Offerte simili", "Accetta tutti i cookie"], kept: ["Addetto alle pulizie", "Pulizia degli uffici"]},
  offer: `Candidati ora
Salva annuncio
Pubblicato 3 giorni fa
Addetto alle pulizie – part time – Verona
Mansioni:
- Pulizia degli uffici e dei bagni
- Sanificazione delle superfici
- Svuotamento dei cestini
Requisiti: puntualità, riservatezza, patente B gradita.
Offerte simili
Accetta tutti i cookie`,
  cv: `Anna Conti · Verona · anna.conti@esempio.it · 333 222 1100
Esperienze
Addetta alle pulizie, Impresa Esempio (2018 - 2024): pulizia di 800 m² di uffici ogni sera, puntuale da 6 anni.
Altro
Patente B`,
  ok: ["Pulizie", "Puntualità", "Patente B"], no: ["Riservatezza"]
}
);
