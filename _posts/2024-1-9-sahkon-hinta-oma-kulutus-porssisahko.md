---
layout: post
title: Laske oman sähkön vuosikulutuksen hinta pörssisähköllä
excerpt: Avoimista datalähteistä saatavilla tiedoilla on mahdollista laskea paljonko oma sähkönkulutus tulisi maksamaan pörssisähköllä. Artikkelissa on ohjeet, miten laskenta tehdään.
---

Avoimista datalähteistä saatavilla tiedoilla on mahdollista laskea paljonko oma sähkönkulutus tulisi maksamaan pörssisähköllä. Tässä artikkelissa on ohjeet, miten laskenta tehdään. Esimerkissä käytetään taulukkolaskentaan Google Sheets-palvelua, mutta laskenta voidaan tehdä myös muilla taulukkolaskentaohjelmilla.

1. Ladataan kulutustiedot Fingridin Datahub-palvelusta
2. Ladataan pörssisähkön tuntikohtaiset hintatiedot porssisahko.net palvelusta
3. Tuodaan ladatut tiedot Google Sheets-taulukkolaskentaan
4. Lasketaan kulutukselle hinta pörssisähköllä

Mikäli et halua itse taulukkolaskennalla tehdä laskutoimitusta, esim. [liukuri.fi](https://liukuri.fi/laskuri)-palvelussa on hinnan laskenta toiminnallisuus. Toiminnallisuus vaatii Fingridin Datahub:sta ladattujen kulutustietojen lataamisen palveluun.

### 1. Lataa kulutustiedot Fingridin Datahub-pavelusta

Lataa omat kulutustiedot [datahubista](https://oma.datahub.fi/#/) esim. vuodelle 2023.

![datahub menu](/images/posts/electricity-spot-price/datahub-menu.png)

Valitse vuosi 2023 ja oikea käyttöpaikka.

![datahub download](/images/posts/electricity-spot-price/datahub-download.png)

Paina Lataa ja *consumption.csv* niminen tiedosto latautuu koneelle.

### 2. Lataa sähkön tuntikohtaiset pörssihinnat

Lataa pörssisähkön tuntikohtaiset hintatiedot [porssisahko.net](https://porssisahko.net/tilastot) palvelusta.

Valitse vuodeksi 2023

![porssisahko](/images/posts/electricity-spot-price/porssisahko.png)

Paina 2023 hinnat CSV tiedostona ja *sahkonhinnat-2023.csv* niminen tiedosto latautuu koneelle.

### 3. Tietojen tuonti taulukkolaskeentaan

Esimerkissä käytämme Google Sheets-palvelua, joka vaaatii Google-tilin. Esimerkissä ohjelman kielenä on englanti.

Mene [Google Sheets](https://docs.google.com/spreadsheets/u/0/) palveluun ja luo uusi spread sheet.

#### Tuo kulutustiedot

Tuo kulutustiedot lataamastasi *consumption.csv*-tiedostosta.

`File -> Import -> Upload -> Browse` ja valitse *consumption.csv*-tiedosto.

![google import 1](/images/posts/electricity-spot-price/google-import-1.png)

Tuo tiedot tiedostosta vakioasetuksilla, joten älä muuta asetuksia ja paina `Import data`.

#### Tuo pörssihinnat

Tuo hintatiedot lataamastasi *sahkonhinnat-2023.csv*-tiedostosta.

`File -> Import -> Upload -> Browse` ja valitse *sahkonhinnat-2023.csv*-tiedosto.

Valitse tuontinäkymästä `Insert new sheet(s)` ja paina `Import data`.

![google import 2](/images/posts/electricity-spot-price/google-import-2.png)

Mene uudelle välilehdelle (`sahkonhinnat-2023`).

Valitse Ctrl + A (tai Cmd + A macOS:lla) valitaksesi kaiken ja kopio leikepöydellä *Ctrl + C* (tai *Cmd + C*).

Mene `consumption`-välilehdelle ja valitse solu __I1__ ja paina *Ctrl + V* (*Cmd + V*) liittääksesi kopioidut tiedot samalle välilehdelle.

Tuotujen tietojen aikaleimat osuvat automaattisesti kohdalleen, joten tuntikohtaiset kulutus- ja hintatiedot ovat samalla rivillä.

### 4. Hintojan laskeminen

Kulutusdata on ei ole kilowatteina, joten laskelmat pitää jakaa 1000000:lla

Syötä kaava kenttään __K2__ joka laskee hinnan kyseiselle tunnille. Tuntihintaan __J2__ lisätään sähköyhtiön marginaali (senttiä).
```
=G2 / 1000000 * (J2 + 0.42)
```

Paina vihreää hyväksyntä merkkiä esille tulleesta "Suggested auto fill"-kehortuksesta, joka kopioi kaavan oikein jokaiselle riville.

![google autofill](/images/posts/electricity-spot-price/google-autofill.png)

Lisää sarakkeita sheetille, jotta voit lisätä kokonaishintakaavat
`Insert -> Columns -> Insert 1 column right`

![google add column](/images/posts/electricity-spot-price/google-add-column.png)

Allaolevalla kaavalla saat datasta pörssisähköllä maksamasi summan euroina
```
=SUM(K:K) / 100 
```

Kaavalla missä x on sopimuksesi senttihinta, saat summan jonka maksat kiinteällä sopimuksellasi
```
=SUM(G:G) / 1000000 * 0.0xx
```

Esimerkkitaulukko satunnaisella kulutusdatalla:
[Public sähkönhinta omalla kulutuksella ja pörssisähköllä 2023](
https://docs.google.com/spreadsheets/d/1YJACiYaCp4Z5KnnYBMam0EVveZMp_epKp1XOICpEUHg/edit?usp=sharing)


