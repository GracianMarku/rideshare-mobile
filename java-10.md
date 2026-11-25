
# RideShare — Java 10

## Çfarë ndërtova

Në këtë javë implementova sinkronizimin e gjendjes së udhëtimit ndërmjet shoferit dhe udhëtarit duke përdorur polling çdo 5 sekonda.

Udhëtari mund të dërgojë një kërkesë për një vend, ndërsa shoferi mund ta shohë dhe ta pranojë kërkesën. Pas pranimit, statusi i kërkesës dhe numri i vendeve të lira përditësohen në të dy ekranet.

Në javën 9 kemi punuar me preferimet personale të përdoruesit, ndërsa në javën 10 kemi implementuar një gjendje të përbashkët që ruhet në databazën PostgreSQL dhe lexohet nga të dy përdoruesit.

## Përgatitja e provës

Për testimin fillestar përdora udhëtimin me ID 1, i cili kishte 2 vende të lira.

Për autentikim përdora dy llogari të ndryshme GitHub:

- Udhëtari në Chrome normal.
- Shoferi në Chrome Incognito.

Në këtë mënyrë, të dy përdoruesit kishin sesione të ndara dhe mund ta përdornin aplikacionin në të njëjtën kohë.

## Provat që bëra

### Prova 1: Rasti 1 · Kërkesa mbërrin te shoferi

- Hapat: U kyça si udhëtar dhe dërgova një kërkesë për një vend. Në dritaren tjetër isha i kyçur si shofer.
- Çfarë prisja: Kërkesa të ruhej në databazë me statusin ne_pritje dhe të shfaqej automatikisht te shoferi.
- Çfarë pa realisht shoferi dhe udhëtari, pa Refresh: Kërkesa u shfaq në të dy ekranet me statusin Në pritje. Shoferi kishte mundësinë për ta pranuar atë. Nuk e dokumentova veçmas nëse shfaqja fillestare ndodhi pa Refresh.
- Ku e verifikova ruajtjen: Në tabelën kerkesat në databazën PostgreSQL në Neon dhe përmes endpoint-it GET.

### Prova 2: Rasti 2 · Pranimi përditëson të dy ekranet

- Hapat dhe vendet para/pas: Shoferi pranoi kërkesën nga ndërfaqja. Para pranimit kishte 2 vende të lira, ndërsa pas pranimit mbeti 1 vend i lirë.

- Përsëritja e pranimit dhe prova me 0 vende: Përmes Console në Chrome DevTools dërgova përsëri kërkesën PATCH për të njëjtën kërkesë. Serveri ktheu statusin 200 OK, por numri i vendeve mbeti 1.

  Gjithashtu krijova një udhëtim testues me ID test-0, me 0 vende të lira dhe një kërkesë në pritje. Butoni i pranimit ishte i çaktivizuar.

  Kur provova pranimin direkt përmes API-së, serveri ktheu statusin 409 Conflict me mesazhin "Nuk ka vende te lira."

  Në databazë verifikova se numri i vendeve mbeti 0 dhe statusi i kërkesës mbeti ne_pritje.

- Çfarë pashë realisht te të dy përdoruesit: Statusi ndryshoi në U pranua dhe të dy ekranet shfaqën 1 vend të lirë.

Gjithashtu testova autorizimin duke provuar ta pranoj kërkesën nga llogaria e udhëtarit përmes API-së. Serveri ktheu statusin 403 Forbidden me mesazhin "Nuk keni leje ta pranoni kete kerkese."

### Prova 3: Rasti 3 · Ndërprerja dhe rilidhja

- ID-ja e udhëtimit të ri të provës, cila dritare ishte offline dhe si e provova: Krijova udhëtimin test-offline me 2 vende të lira. Dërgova një kërkesë si udhëtar dhe më pas vendosa dritaren e udhëtarit në gjendjen Offline përmes Chrome DevTools, në seksionin Network. Dritarja e shoferit mbeti online.

- Pamja e fundit gjatë ndërprerjes: Kur shoferi pranoi kërkesën, në ekranin e udhëtarit nuk ndryshoi asgjë. Udhëtari vazhdoi të shihte gjendjen e mëparshme me 2 vende të lira.

- Çfarë ndryshoi pas rilidhjes: E riktheva dritaren e udhëtarit online dhe pas rreth 5 sekondash numri i vendeve të lira ndryshoi nga 2 në 1, pa bërë Refresh manual. Kjo tregoi se polling vazhdoi të lexonte gjendjen pas rikthimit të lidhjes.

## Ku gjendet puna

Skedarët kryesorë të implementimit janë:

- aplikacioni/src/app/api/kerkesat/route.ts
- aplikacioni/src/components/GjendjaUdhetimit.tsx
- aplikacioni/src/components/KerkesaForm.tsx
- aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx
- aplikacioni/src/app/udhetimi/[id]/page.tsx
- kerkesat.sql

Endpoint-et e implementuara:

- GET /api/kerkesat?udhetimId=1 — Leximi i gjendjes së udhëtimit dhe kërkesave.
- POST /api/kerkesat — Dërgimi i një kërkese nga udhëtari.
- PATCH /api/kerkesat — Pranimi i kërkesës nga shoferi.

Në PostgreSQL implementova funksionin prano_kerkesen, i cili kontrollon nëse përdoruesi është shoferi i udhëtimit, statusin e kërkesës dhe numrin e vendeve të lira.

Ndryshimi i statusit dhe zvogëlimi i numrit të vendeve bëhen në mënyrë atomike. Kjo parandalon zvogëlimin e përsëritur të vendeve për të njëjtën kërkesë dhe pranimin e kërkesave kur nuk ka vende të lira.

Struktura e tabelës, constraints dhe funksioni SQL janë ruajtur në skedarin kerkesat.sql.

Repository:
https://github.com/GracianMarku/rideshare-mobile

## Prova me kolegun

Prova me kolegun ende nuk është realizuar. Testimin e aplikacionit e bëra individualisht duke përdorur dy llogari GitHub dhe dy sesione të ndara në Chrome.

## Çfarë mbetet për përmirësim

Gjatë testimit vërejta një problem me skadimin e sesionit të përdoruesit. Kur sesioni skadoi, API-ja kthente statusin 401 Unauthorized dhe aplikacioni vazhdonte të provonte leximin e gjendjes.

Si përmirësim, aplikacioni mund ta dallojë skadimin e sesionit nga ndërprerja e internetit dhe t'i kërkojë përdoruesit të kyçet përsëri.

Gjithashtu, në të ardhmen mund të përdoret SSE ose WebSocket si alternativë ndaj polling, për të zvogëluar numrin e kërkesave periodike drejt serverit.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Përdora AI për të kuptuar konceptin e polling, implementimin e endpoint-eve, sinkronizimin ndërmjet përdoruesve dhe veprimet atomike në PostgreSQL.

Kodet i implementova në projekt dhe i testova duke përdorur dy llogari GitHub, Chrome DevTools dhe databazën Neon.

Verifikova pranimin e kërkesës, pranimin e përsëritur, rastin me 0 vende, autorizimin në backend dhe sinkronizimin pas rikthimit të lidhjes.

## Pas dorëzimit të parë — përditëso më vonë

Ky seksion mund të mbetet kështu në dorëzimin e parë. Pasi të marrësh përgjigjen, shto linkun e Issue-t, commit-in e kontrolluar dhe çfarë kaloi ose duhet korrigjuar. 2/2 teknikisht nuk provon funksionimin e aplikacionit.
