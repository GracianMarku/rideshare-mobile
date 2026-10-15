# RideShare — Java 5 · Hyrja dhe lejet

## Cfare ndertova

Ne javen 5 shtova hyrjen me GitHub duke perdorur NextAuth. Krijova edhe tabelen `profilet` ne Neon, ku ruhen perdoruesit dhe rolet e tyre.

Identiteti tregon kush eshte perdoruesi qe ka hyre me GitHub. Roli tregon nese eshte `udhetar` apo `shofer`. Pronesia tregon cilit shofer i perket nje udhetim.

Vetem shoferi qe eshte pronar i udhetimit mund ta ndryshoje oren e tij.

## Provat qe bera

### Prova 1: Hyrja, rifreskimi dhe dalja

Hapa faqen `/panel` dhe me doli butoni **Hyr me GitHub**. Pas hyrjes u shfaq emri im, ID e GitHub dhe roli `udhetar`.

Me pas ndryshova rolin ne `shofer` permes Neon dhe ne panel u shfaq formulari per ndryshimin e ores.

### Prova 2: Shoferi ndryshon udhetimin e vet

Si shofer i udhetimit me ID 2, ndryshova oren nga `08:15` ne `08:25`.

Ne panel u shfaq mesazhi **Ora u ruajt me sukses**. Ne faqen kryesore, udhetimi Fushe Kosove - AAB u shfaq me oren `08:25`.

Edhe ne Neon SQL Editor kontrollova qe ID 2 kishte oren `08:25`, ndersa udhetimet e tjera nuk kishin ndryshuar.

### Prova 3: Veprimi pa leje refuzohet

Hapa Inspect ne browser dhe ndryshova ID e formularit nga `2` ne `1`. Pastaj provova te ndryshoj oren e udhetimit.

Ne panel u shfaq mesazhi **Nuk ke leje per kete udhetim. Ora nuk ndryshoi.**

Kjo tregon se serveri kontrollon nese udhetimi i perket shoferit dhe nuk lejon ndryshimin e udhetimeve te tjere.

## Ku gjendet puna

GitHub Repository:

https://github.com/GracianMarku/rideshare-mobile

Skedaret kryesore qe shtova:

- `src/lib/auth.ts`
- `src/lib/lejet.ts`
- `src/components/Hyrja.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/panel/page.tsx`
- `src/app/panel/actions.ts`
- `schema-java05.sql`

Gjithashtu ndryshova `src/app/page.tsx` per te shtuar lidhjen me panelin.

## Cfare mbetet per permiresim

Kerkesa per vend eshte ende simulim. Ne vazhdim do te shtoja mundesine qe perdoruesi te dergoje nje kerkese reale per vend dhe shoferi ta pranoje ose refuzoje.

## Ndihma nga AI (Artificial Intelligence – inteligjence artificiale)

Perdora AI per shpjegimin e disa pjeseve te kodit dhe per udhezimet gjate krijimit te autentikimit me GitHub.

Vete krijova skedaret, ekzekutova SQL ne Neon dhe testova hyrjen, ndryshimin e ores dhe kontrollin e lejeve.