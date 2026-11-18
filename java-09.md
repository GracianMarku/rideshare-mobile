# RideShare — Java 9

## Çfarë ndërtova

Këtë javë në projektin RideShare shtova mundësinë që përdoruesi i kyçur të ruajë një udhëtim te të preferuarat.

Përdora Next.js, React, NextAuth dhe Neon PostgreSQL. Krijova tabelën `preferimet` në databazë dhe API për leximin dhe ruajtjen e preferimeve.

Në frontend përdora Optimistic UI, ku ylli dhe numri i preferimeve ndryshojnë menjëherë pas klikimit, pa pritur përgjigjen e serverit. Nëse serveri e konfirmon ruajtjen, preferimi mbetet i ruajtur. Nëse ndodh një gabim, gjendja kthehet siç ishte më parë.

## Provat që bëra

### Prova 1: Ruajtja e suksesshme mbetet pas rifreskimit.

U kyça me GitHub dhe hapa udhëtimin me ID `1`. Klikova butonin "Ruaj udhëtimin".

Prisja që ylli të mbushej, numri i preferimeve të rritej dhe serveri ta ruante preferimin në databazë.

Pas klikimit u shfaq "I ruajtur" dhe numri i preferimeve u bë 1. E rifreskova faqen me F5 dhe preferimi vazhdoi të ishte i ruajtur. Kontrollova edhe tabelën `preferimet` në Neon dhe pashë që ishte krijuar rreshti përkatës.

### Prova 2: Gabimi i serverit nuk lë një sukses të rremë në ekran.

Për këtë provë shtova përkohësisht `TEST_PREFERIM_ERROR=true` në `.env.local` dhe rinisa serverin.

Hapa udhëtimin me ID `2`, i cili nuk ishte ruajtur ende, dhe klikova butonin e preferimit.

Prisja që ylli të ndryshonte menjëherë, por pas refuzimit të serverit të kthehej në gjendjen e mëparshme.

Rezultati ishte siç pritej. U shfaq mesazhi "Nuk u ruajt. Provo përsëri.", ylli u kthye bosh dhe numri i preferimeve mbeti 1, sepse udhëtimi i parë ishte ruajtur më herët.

Pas provës e largova konfigurimin e gabimit.

### Prova 3: Klikimet e përsëritura nuk krijojnë kopje.

Provova ruajtjen e udhëtimit të dytë dhe kontrollova sjelljen e butonit gjatë ruajtjes. Gjatë pritjes butoni çaktivizohet, ndërsa pas suksesit shfaqet "I ruajtur".

Në databazë përdora një SQL query me `GROUP BY` dhe `COUNT(*)` për të kontrolluar sa preferime ekzistojnë për secilin çift përdorues-udhëtim.

Gjithashtu ekzekutova një query me `HAVING COUNT(*) > 1`, i cili ktheu 0 rreshta. Kjo tregoi që në databazë nuk kishte preferime të dyfishta.

Në tabelë kemi edhe kufizimin `UNIQUE (user_id, udhetim_id)`, që nuk lejon krijimin e kopjeve për të njëjtin përdorues dhe udhëtim.

## Ku gjendet puna

Projekti në GitHub:

https://github.com/GracianMarku/rideshare-mobile

Skedarët kryesorë të kësaj jave:

- `aplikacioni/src/app/api/preferimet/route.ts` — API për leximin dhe ruajtjen e preferimeve.
- `aplikacioni/src/components/Preferimi.tsx` — komponenti me Optimistic UI dhe trajtimin e gabimeve.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` — faqja ku u shtua komponenti i preferimeve.
- `preferimet.sql` — struktura e tabelës në Neon PostgreSQL.

## Çfarë mbetet për përmirësim

Aktualisht përdoruesi mund ta shtojë një udhëtim te të preferuarat, por nuk mund ta heqë. Në të ardhmen mund të shtoj edhe mundësinë për largimin e preferimit dhe një faqe ku përdoruesi i sheh të gjitha udhëtimet që ka ruajtur.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora ChatGPT për të kuptuar më mirë Optimistic UI, për strukturën e tabelës SQL dhe për implementimin e API-së dhe komponentit React.

Vetë e testova aplikacionin në browser, provova ruajtjen dhe rifreskimin, simulova gabimin e serverit dhe kontrollova të dhënat në Neon për të verifikuar që nuk kishte preferime të dyfishta.