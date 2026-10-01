# Informativa del sito

La pagina `/privacy` descrive il funzionamento del codice e i dati dello studio disponibili al 1 ottobre 2026. Non è una certificazione di conformità e non sostituisce la verifica delle prassi effettive da parte del titolare.

Prima della pubblicazione lo studio deve confermare:

- Identità giuridica del titolare: è disponibile il nome commerciale Studio Tecnico Garofalo e la partita IVA, non il nome completo dell’eventuale persona fisica titolare.
- Criteri di conservazione delle richieste, delle email e dei log, e persone autorizzate a leggerli. Il testo usa criteri senza inventare durate.
- Casella destinataria di produzione e relativo fornitore. La Gmail personale di Cristian e il mittente onboarding@resend.dev sono configurazioni di test, non il recapito definitivo dello studio.
- Servizi effettivamente usati, accordi sul trattamento e garanzie dei trasferimenti internazionali. Il testo descrive Cloudflare e Resend. Aggiornarlo prima di usare un webhook o altri fornitori.
- Eventuali analytics, cookie o strumenti attivati direttamente nella dashboard Cloudflare: non sono rilevabili dal repository. Il codice non integra analytics, mappe embed o cookie pubblicitari.
- Coerenza dell’informativa con le attività dello studio, inclusi eventuali ulteriori trattamenti professionali da documentare separatamente.

Il modulo richiede la presa visione dell’informativa e usa la base precontrattuale per gestire le richieste. Non raccoglie consenso al marketing. `privacy=accepted` è mantenuto come valore tecnico della conferma di lettura per compatibilità con il backend.

In Cloudflare impostare `NEXT_PUBLIC_PRIVACY_URL=/privacy` (o rimuovere l’override per usare il valore predefinito) e ricostruire. Non usare il precedente segnaposto `#contatti`.

Fonti di riferimento:
- https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/8981258
- https://www.garanteprivacy.it/home/i-miei-diritti/diritti
- https://www.cloudflare.com/policies/privacy/
- https://www.cloudflare.com/en-gb/cloudflare-customer-dpa/
- https://resend.com/legal/dpa
- https://resend.com/security/gdpr
