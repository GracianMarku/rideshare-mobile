# RideShare — Java 8

## Çfare ndertova

Kete jave shtova mundesine e zgjedhjes manuale te vendtakimit dhe marrjen e vendndodhjes permes Geolocation API.

Krijova komponentin `Vendtakimi.tsx`, ku perdoruesi mund te shkruaje dhe konfirmoje vendtakimin ose te perdore vendndodhjen e pajisjes.

Komponenti shfaq koordinatat dhe saktesine ne metra. Gjithashtu trajton rastet kur leja refuzohet, vendndodhja nuk gjendet ose perfundon koha e pritjes.

Komponentin e perdora ne detajet e udhetimit dhe ne faqen `/java-08-test`.

## Provat qe bera

### Prova 1: Leja nuk kerkohet sapo hapet faqja.

**Hapat:** Hapa faqen `/java-08-test` pa klikuar butonin per vendndodhjen.

**Rezultati i pritur:** Shfletuesi nuk duhet te kerkoje leje automatikisht. Kerkesa duhet te behet vetem kur perdoruesi klikon butonin.

**Rezultati:** Faqja u hap normalisht dhe vendndodhja nuk u kerkua automatikisht.

### Prova 2: Refuzimi i lejes nuk e bllokon perdoruesin.

**Hapat:** Klikova butonin "Perdor vendndodhjen time" dhe testova rastin kur leja refuzohet.

**Rezultati i pritur:** Duhet te shfaqet nje mesazh gabimi dhe perdoruesi duhet te mund te vazhdoje me vendtakimin manual.

**Rezultati:** U shfaq mesazhi "Leja per vendndodhjen u refuzua." dhe forma manuale mbeti e disponueshme.

### Prova 3: Deshmite ne GitHub nuk tregojne adresen time reale.

**Hapat:** Kontrollova permbajtjen e raportit dhe shmanga perfshirjen e koordinatave reale te marra nga shfletuesi.

**Rezultati i pritur:** Raporti dhe deshmite e publikuara nuk duhet te permbajne koordinata ose adresen time reale.

**Rezultati:** Ne raport perfshiva vetem pershkrimin e testimit dhe saktesine e vendndodhjes, pa koordinata reale.

## Ku gjendet puna

- `aplikacioni/src/components/Vendtakimi.tsx` — komponenti i vendtakimit dhe Geolocation.
- `aplikacioni/src/app/java-08-test/page.tsx` — faqja e testimit.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` — perdorimi i komponentit ne detajet e udhetimit.
- `mobile-week08.json` — konfigurimi per testimin automatik.

Faqja e testimit lokal: `http://localhost:3000/java-08-test`

## Çfare mbetet per permiresim

Aktualisht koordinatat shfaqen si numra dhe jo si vend i kuptueshem per perdoruesin.

Ne te ardhmen mund te shtoj nje harte ose nje pershkrim te vendndodhjes, pa ndryshuar funksionalitetin manual te vendtakimit.

## Ndihma nga AI (Artificial Intelligence – inteligjence artificiale)

Perdora AI per te kuptuar Geolocation API, menaxhimin e gjendjeve me React `useState`, validimin e inputit dhe pergatitjen e komponenteve per testimin automatik.

Vete testova konfirmimin manual, refuzimin e lejes, timeout dhe marrjen e koordinatave me saktesi. Gjithashtu ekzekutova `npm run build`, i cili perfundoi me sukses.

## Prova me nje hyrje te re

**Hyrja qe provova:** Vendtakim me vetem tri hapesira.

**Parashikimi im para klikimit:** Vendtakimi bosh nuk duhet te konfirmohet dhe duhet te shfaqet nje mesazh gabimi.

**Çfare pashe realisht:** U shfaq mesazhi "Shkruaj nje vendtakim." dhe nuk u konfirmua nje vendtakim bosh.

**Skedari dhe funksioni qe e shpjegojne:** `aplikacioni/src/components/Vendtakimi.tsx`, funksioni `konfirmoVendtakimin`.

**Çfare kuptova ose korrigjova:** Kuptova se `trim()` largon hapesirat ne fillim dhe ne fund te tekstit. Duke kontrolluar rezultatin, mund te parandaloj konfirmimin e nje vendtakimi bosh.

Kete pjese e shpjegoj ne klase. Kontrolli automatik nuk verifikon vertetesine e proves.