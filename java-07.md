# RideShare - Java 7

## Rasti im

GitHub: gracianmarku

Kodi: P7-479

Skenari i zgjedhur: Rasti 2 - Pa vende

ID i udhetimit ne projektin tim: 3

Te dhenat fiktive te rastit: Mitrovice -> AAB, 09:25, 3 vende.

Ora per proven e re: 09:30.

## Parashikimi

Pres qe ne liste te shfaqet udhetimi me ID 3 dhe numri i vendeve te lira. Kur e hap udhetimin, pres te shoh detajet e tij. Nese ka 0 vende, duhet te shfaqet mesazhi qe nuk ka vende te lira dhe te mos lejohet kerkesa per vend.

## Dy probleme

1. Butoni "Kerko vend" nuk tregonte se kerkesa ishte vetem simulim. Perdoruesi mund te mendonte se po bente rezervim real.
2. Ne faqen e simulimit shfaqet vetem qyteti i nisjes, jo destinacioni. Kjo mund te krijoje paqartesi kur ka disa udhetime nga i njejti qytet.

## Korrigjimi

Skedari: `aplikacioni/src/app/udhetimi/[id]/page.tsx`

Ndryshova tekstin e butonit nga "Kerko vend" ne "Provo kerkesen (simulim)".

Nuk ndryshova logjiken e aplikacionit ose databazen. Butoni vazhdon te jete aktiv vetem kur ka vende te lira.

## Versionet

Para: https://github.com/GracianMarku/rideshare-mobile/commit/f5456fc387e7edad2452defaa98639e792f16433

Pas: https://github.com/GracianMarku/rideshare-mobile/commit/e7e426fa689953f0c53824caa4f9c54960df9434

## Provat qe bera

### Prova 1

Hapat: Hapa listen e udhetimeve, zgjodha udhetimin me ID 1 (Prishtine - AAB) dhe klikova "Provo kerkesen (simulim)".

Pritshmeria: Te hapej faqja e simulimit dhe te mos krijohej rezervim real.

Vezhgimi: U shfaq mesazhi "Simulim: Ne pritje" dhe informacioni qe kerkesa nuk eshte derguar te shoferi. Prova kaloi.

### Prova 2

Hapat: Hapa detajet e udhetimit me ID 1.

Pritshmeria: Butoni te shfaqej me tekstin e ri "Provo kerkesen (simulim)".

Vezhgimi: Teksti i ri u shfaq sakte dhe teksti i vjeter "Kerko vend" nuk shfaqej me. Prova kaloi.

### Prova 3

Hapat: Hapa udhetimin me ID 3 (Lipjan - AAB), i cili ka 0 vende te lira.

Pritshmeria: Te shfaqej mesazhi "Nuk ka vende te lira" dhe butoni te ishte i caktivizuar.

Vezhgimi: U shfaqen 0 vende te lira dhe butoni nuk mund te klikohej. Prova kaloi.
## Ndryshimi i ri

Nuk eshte dokumentuar ende nje prove e re me hyrje te ndryshuar nga nje koleg.

## Ndihma nga AI

Perdora ChatGPT per te analizuar kodin, per te identifikuar paqartesite ne nderfaqe, per te udhezuar korrigjimin dhe per te organizuar raportin. Ndryshimin ne kod dhe provat ne aplikacion i bera vete.