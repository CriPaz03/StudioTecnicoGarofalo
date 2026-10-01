# Pubblicazione su Cloudflare Pages

Il sito viene esportato in `out/`. Le interazioni restano nel browser; `/api/contact` e i tre MP4 usano Pages Functions. Non occorre un server Next.js in produzione.

## Requisiti e sviluppo

Usare Node 22.13+ (consigliato Node 24 LTS) e npm. `npm ci` installa le dipendenze bloccate nel lockfile.

- `npm run dev`: sviluppo visuale Next.js; genera anche le immagini responsive. Non esegue la Pages Function.
- `npm run build`: genera le immagini responsive e il sito statico in `out/`.
- `npm start`: serve `out/` con Wrangler e la vera Pages Function su http://localhost:8788. Ricostruire dopo le modifiche al sito.
- `npm run test:contact:unit`: test isolati con provider simulato; nessuna email reale.
- `npm run test:contact`: smoke test sul server locale (default porta 8788; TEST_BASE_URL consente di cambiarla).

Per il test completo locale: copiare `.env.example` in `.env.local` (configurazione pubblica di build) e `.dev.vars.example` in `.dev.vars` (segreti della funzione). Non commettere questi file. L'invio locale con credenziali reali manda email reali.

## Creazione del progetto Pages

Collegare il repository Git a un progetto **Pages**, con directory radice del repository, comando di build `npm run build` e directory di output `out`. Usare Node 24 tramite la variabile di build `NODE_VERSION=24`.

La cartella `functions/` deve restare nella radice del repository. Non caricare solamente `out/` tramite drag-and-drop della dashboard: questa modalità non distribuisce le Functions. In alternativa alla connessione Git, dopo login Wrangler e build, usare `npm run pages:deploy`. Nessun deploy è stato eseguito durante l'adattamento.

`wrangler.jsonc` contiene il nome proposto del progetto; allinearlo al nome scelto su Cloudflare. `_routes.json` limita le funzioni alle API e ai tre MP4. Immagini, frame mobile e pagine sono asset statici.

## Variabili pubbliche di build

Configurare in Pages prima di costruire:

- `NEXT_PUBLIC_SITE_URL`: origine HTTPS definitiva, senza slash finale. Senza valore, noindex e sitemap vuota.
- `NEXT_PUBLIC_PRIVACY_URL=/privacy`: pagina integrata; è anche il valore predefinito. Lo studio deve verificare il testo e le prassi effettive descritte in `PRIVACY-REVIEW.md` prima della pubblicazione.
- `NEXT_PUBLIC_CONTACT_ENABLED=true`: abilita il pulsante solo quando è presente anche la privacy.
- Gli altri `NEXT_PUBLIC_*` in `.env.example` sono override opzionali dei recapiti già presenti.

Ogni modifica richiede una nuova build. Non inserire chiavi API in variabili NEXT_PUBLIC.

## Invio tramite Resend

Verificare su Resend un dominio di cui si gestiscono i DNS. Creare una API key con permessi di invio e configurare nelle variabili/segreti della Pages Function:

- `CONTACT_ENABLED=true`
- `RESEND_API_KEY`: **segreto**, chiave Resend.
- `CONTACT_FROM`: mittente sul dominio verificato, ad esempio `Studio Tecnico Garofalo <sito@DOMINIO-VERIFICATO>` (sostituire il segnaposto).
- `CONTACT_TO=garofalogeom@liberp.it`: destinatario fornito dal cliente; verificarlo prima della messa online.

Il mittente resta quello verificato; l'indirizzo del visitatore è impostato come Reply-To. Non serve modificare la casella attuale dello studio. Pubblicare nuovamente dopo la configurazione. La risposta positiva indica accettazione da Resend, non garantisce il recapito in inbox: verificarlo con un invio concordato e controllare i log Resend.

In alternativa, impostare `CONTACT_WEBHOOK_URL` e l'eventuale segreto `CONTACT_WEBHOOK_TOKEN`. Il webhook ha precedenza su Resend e deve accettare durevolmente il messaggio prima di rispondere 2xx. Riceve name, email, phone, service, message, privacy, source, submittedAt in JSON.

Tenere Preview e Production separate: per le preview lasciare NEXT_PUBLIC_SITE_URL vuoto e CONTACT_ENABLED=false, senza credenziali di produzione. Configurare una protezione antiabuso/limite richieste su `/api/contact` prima della pubblicazione; il codice mantiene honeypot, controllo origine e validazione ma non un rate limiter distribuito.

## Verifiche

Eseguire lint, typecheck, build, test del form e preview locale. Su produzione verificare dominio, HTTPS, canonical, sitemap, recapito email, video con richieste Range, gallery touch e Safari reale. Il preview locale non certifica prestazioni o compatibilità del dispositivo fisico.

Le immagini responsive vengono generate durante build/dev con Sharp e servite mediante un loader Next personalizzato. Non dipendono da un servizio immagini a pagamento; conservano srcset/sizes. Gli originali restano in public/images. La sequenza mobile già ottimizzata resta invariata.

### Seeking video su Pages

Eccezione alla distribuzione statica descritta sopra: anche i tre MP4 passano attraverso una Pages Function, perché Pages non supporta attualmente risposte parziali per gli asset statici. La funzione functions/video/[file].ts gestisce Range con il binding ASSETS e restituisce 206/416. Ogni richiesta MP4 conta nella quota Functions; frame WebP mobile, immagini e pagine restano statici. I file attuali sono inferiori a 8 MB: la funzione legge il file in memoria per estrarre il segmento. Rivalutare R2 se aumentano significativamente le dimensioni dei video.
Fonte: https://developers.cloudflare.com/pages/configuration/serving-pages/
