# RideShare - Java 4 · Neon dhe PostgreSQL

## Cfare ndertova

Ne javen e katert e lidha aplikacionin RideShare me databazen PostgreSQL ne Neon. Me heret udhetimet i kisha te shkruara direkt ne kod, ndersa tani ato merren nga databaza.

Krijova `db.ts` per lidhjen me databazen dhe ndryshova `udhetimet.ts` per te lexuar udhetimet me SQL. Gjithashtu ndryshova faqen kryesore dhe faqet e detajeve qe te marrin te dhenat nga Neon.

## Provat qe bera

### Prova 1: Ndryshimi ne databaze shfaqet ne aplikacion

Ne Neon SQL Editor ndryshova oren e udhetimit me ID 2 nga 08:15 ne 08:25.

Pas rifreskimit te aplikacionit, ora e re u shfaq ne listen e udhetimeve. Pastaj e ktheva oren ne 08:15 dhe ndryshimi u shfaq perseri.

### Prova 2: Lista bosh dhe rikthimi

Te funksioni `lexoUdhetimet` shtova perkohesisht `WHERE false` ne SQL.

Kur e rifreskova faqen, u shfaq mesazhi "Nuk ka udhetime per momentin."

Pastaj e hoqa `WHERE false` dhe tri udhetimet u shfaqen perseri normalisht.

### Prova 3: Lidhja mungon, rikthimi dhe siguria

Per kete prove ndryshova perkohesisht emrin DATABASE_URL ne DATABASE_URL_PA_TEST te skedari .env.local.

Pastaj e rinisa aplikacionin dhe kontrollova mesazhin "Nuk u lidhem me databazen. Provo perseri."

Me pas e ktheva emrin ne DATABASE_URL, e rinisa serverin dhe tri udhetimet u shfaqen perseri normalisht.

Gjithashtu kontrollova skedarin .gitignore, ku .env* eshte i perfshire, qe .env.local te mos ngarkohet ne GitHub.

## Ku gjendet puna

Repository ne GitHub:

https://github.com/GracianMarku/rideshare-mobile

Skedaret kryesore qe krijova ose ndryshova:

- `aplikacioni/schema.sql`
- `aplikacioni/src/lib/db.ts`
- `aplikacioni/src/lib/udhetimet.ts`
- `aplikacioni/src/app/page.tsx`
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`
- `aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`

## Cfare mbetet per permiresim

Per momentin aplikacioni vetem i lexon udhetimet nga databaza. Kur perdoruesi klikon "Kerko vend", shfaqet mesazhi "Ne pritje", por nuk krijohet nje rezervim i vertete.

Ne vazhdim dua te shtoj mundesine qe kerkesat per udhetim te ruhen ne databaze.

## Ndihma nga AI (Artificial Intelligence - inteligjence artificiale)

Perdora AI per ndihme gjate lidhjes se aplikacionit me Neon, per te kuptuar kodin dhe per te zgjidhur gabimin me databazen.
