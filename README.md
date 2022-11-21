# Bazar

## Introduzione
Bazar è una web application, single page, che permette di pubblicare un servizio che si è disposti ad offrire o che è richiesto da colui che l'ha pubblicato. I servizi possono essere di ogni tipo, dal web developer all'idraulico e due sono i tipi di utenti che possono registrarsi:

#### Privato
Durante la fase di registrazione è libero di scegliere fino a 3 piani:
- *free*: in questo caso può pubblicare un solo servizio da offrire
- *cheap*: può pubblicare fino a 3 servizi da offrire
- *premium*: può pubblicare tutti i servizi da offrire che vuole

Tutti e tre i piani non impongono limiti per l'aggiunta di servizi da richiedere.

#### Azienda
L'azienda può pubblicare solo i servizi da offrire e non ha limiti su di essi.
___

L'applicazione permette agli utenti di modificare o eliminare i propri servizi, lo stesso vale per il proprio profilo che, nel caso in cui venisse eliminato vengono automaticamente rimossi tutti i post proprietari dell'utente in questione.

Tra le altre features troviamo:
- la possibilità di ricercare un servizio offerto o richiesto digitando il nome del servizio o il luogo in cui viene svolto
- la possibilità di contattare tramite messaggio gli utenti iscritti a Bazar

## Tecnologie utilizzate
- [Express js](https://expressjs.com/): web framework usato per lo sviluppo del backend
- [MongoDB Atlas](https://www.mongodb.com/atlas): database non relazionale cloud-based per mantenere i dati persistenti
- [Socket.io](https://socket.io/): libreria per la comunicazione tra client e server
- [React](https://it.reactjs.org/): libreria javascript per lo sviluppo del frontend
- [Chakra](https://chakra-ui.com/): libreria React per semplificare la creazione di componenti React

## Prerequisiti
- [Nodejs](https://nodejs.org/en/)
- Un account su [Mongo Atlas](https://www.mongodb.com/it-it/atlas/database)
- Clonare la repository con http `git clone https://github.com/LorenzoSpina/Bazar.git` con ssh `git clone git@github.com:LorenzoSpina/Bazar.git`
## Installazione
### Server
1. Aprire la cartella backend `cd backend`
2. Installare tutti i pacchetti npm presenti `npm install`
3. Eseguire il server `npm start`
### Client
1. Aprire la cartella frontend `cd frontend`
2. Installare tutti i pacchetti npm presenti `npm install`
3. Eseguire il server `npm start`
## Sviluppo

### Autenticazione
L'autenticazione ha previsto la gestione della registrazione e del login. Nel caso della registrazione ci siamo occupati in particolar modo di garantire il giusto formato degli input da inserire tramite i *regex* e di criptare la password prima di caricarla nel database, questo tramite l'utilizzo del pacchetto npm [bcrypt.js](https://www.npmjs.com/package/bcryptjs).
Per il login abbiamo implementato la possibilità di mantenere l'accesso, anche dopo aver chiuso il browser, caricando i dati sia nel *session storage* che nel *local storage*, in caso contrario i dati vengono salvati solo nel *session storage*. Anche i dati inviati vengono criptati, questa volta grazie all'uso del pacchetto npm [crypto-js](https://www.npmjs.com/package/crypto-js).
Come ultima cosa non poteva mancare il rilascio del *Json Web Token* ([JWT](https://jwt.io/)), previo controllo della correttezza delle credenziali inserite, tramite il quale l'utente può accedere alle varie funzionalità fornite dal sito, come l'aggiunta dei servizi o la messaggistica.

<img src="/assets/images/FBj5z-2308515857.png" height="50%" alt="How JWT works">

### Operazioni CRUD
Per quanto riguarda la gestione dei servizi offerti e richiesti ci siamo basati sull'utilizzo dell'architettura REST-API. Quindi una volta definite le *routes*, è stato possibile accedere alla risorsa desiderata e poter effettuare le dovute operazioni utilizzando i metodi HTTP tra cui:

- GET
- DELETE
- POST
- PATCH

<img src="/assets/images/REST-API-Tutorials-AndroWep-2976666305.png" height="50%" alt="REST-API">

Ogni route prevede anche un middleware per il controllo del numero delle richieste da uno stesso IP che vengono effettuate per evitare un attacco Brute Force, questo grazie ai pacchetti npm [express-rate-limit](https://www.npmjs.com/package/express-rate-limit?activeTab=readme) e [express-brute](https://github.com/AdamPflug/express-brute).

Inoltre le routes utilizzate per le operazioni POST, PATCH, DELETE e per i GET relativi alle informazioni personali contengono anche un middleware per il controllo del JWT, in quanto, innanzitutto si verifica la presenza del token e se si dovesse trattare di un privato si controlla il piano scelto durante la fase di registrazione e si verifica il numero di servizi offerti inseriti.

Queste operazioni possono essere utilizzate anche per il proprio profilo in quanto è possibile modificarlo ed eliminarlo.

### Chat
La chat è stata sviluppata utilizzando la libreria [socket.io](socket.io), la quale permette una comunicazione bidirezionale, tra server e client usando il protocollo [websocket](https://en.wikipedia.org/wiki/WebSocket).

![socket communication!](/assets/images/bidirectional-communication-socket-dark.png "socket communication")

### Sicurezza
La web application è stata testata tramite analisi di vulnerabilità a diverse tipologie di attacco. Per un analisi più dettagliata consultare il Vulnerability Assessment.
- [x] Sql Injection (SQLi)
- [x] Cross Site Scripting (XSS)
- [x] Cross-site Request Forgery (CSRF)
- [x] Sanitize and render HTML 
- [x] Brute force prevention
