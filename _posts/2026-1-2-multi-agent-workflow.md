---
layout: post
title: Applikaation kehitys moniagenttiworkflowssa
excerpt: Applikaation kehitys moniagenttiympäristössä. Aloitettiin yksinkertaisesta single-agent workflowsta ja siirryttiin hiljalleen moniagentti- ja rinnakkaisagentti-workflowiin. Kokemuksia Claude Coden, CodeRabbitin ja muiden agenttien käytöstä git worktrees -työnkulussa.
---

**NOTE:** Postauksen sisältö on pääosin muistiinpanoja demon tueksi.

Käytin tässä lomalla aikaa omien projektien koodaamiseen. **Cursorilla** olin jo tykittänyt lisälaskua vahingossa kiitettävän summan, joten päätin käyttää pitkästä aikaa **Claude Codea**, kun siitä on tullut maksettua.

Päätin vihdoin toteuttaa hätävara-applikaation, jonka toteuttamiseen ei ole aiemmin ollut aikaa.

Emergency Supply Tracker ([Repository](https://github.com/ttu/emergency-supply-tracker) - [Application](https://ttu.github.io/emergency-supply-tracker/)

Aikaa mennyt muutamia tunteja päivässä parin viikon ajan. Ilman agentteja oletettavasti täysiä työpäiviä olisi mennyt paljon enemmän.

Tällä kertaa aloitin speksaamalla alkuun hyvin ja agentti teki hyvän toteutussunnitelman. Perinteiseen tapaan hyvin verboosi, joten pitää muistaa jatkossa pyytää tiivistämään, jotta jaksaa itsekkin tuotoksen validoida.

[Emergency Supply Tracker - Initial Specifications](https://github.com/ttu/emergency-supply-tracker/tree/937108e9a876af7974cd675242775fb4251c7eaa/docs/specifications)

Toki tässä hyvässä suunnittelussa vähän vaikeuttaa se, että tarkalleen ei osaa speksatessa määritellä toiminnallisuutta, mitä tulee haluamaan. Noin 50 commitin jälkeen, kun oli perusteet kunnossa oli aika siirtyä iteroimaan.

_Muistutus_: Hyvät E2E testit heti alkuun. Nyt oli suunnitteilla vasta stepissa ~60. Muutenkin on hyvä lukea suunnitelma ajatuksella läpi, sillä arkkitehtuuriin liittyvät muutokset ovat hankalampia tehdä myöhemmin.

Koska oli loma ja silloin viettää mielellään aikaa perheen kanssa, niin totesin, että helpompi laittaa Claude paukuttamaan mahdollisimman monta taskia samaa aikaa, jotta saa token quotan käytettyä mahdollisimman nopeasti. Oli siis hyvä tutustua miten saadaan samanaikaisesti laitettua monta agenttia töihin.

## Model

Modeleista Opus 4.5:sta oli kehittynyt maasta taivaisiin ja jengi sai sillä tehtyä jotain nanopartikkelikvanttilaskentatoteutuksia. Omassa käytössä importit meni vieläkin testien sisään jne. mutta hyvin se sai kyllä koodia aikaan. Perus CRUD:ssa ei nyt Sonnet 4.5:iin verrattuna mitään suurta edistystä.

## Workflow

### Single Agent

Aluksi tein yhtä toiminnallisuutta kerrallaan. Silloin pysyy paremmin kartalla, että mitä ollaan tekemässä. Taskein ollessa melko pieniä odotteluaikakin on lyhyt.

Tällä flowlla pysytyy myös helpommin validoimaan muutokset ja pysyy itse kontrollissa mitä on tehty.

````
1. Kirjoita promptiin mitä halutaan
2. Agentti koodaa
3. Mahdollisesti pyytää agentilta commit messagen
4. Itse käyttää versionhallintaa ja puskee commitin versionhallintaan
````

Joskus käytin **plan modea** ja joskus suoraan toteuttamaan. Plan mode esittää enemmän kysymyksiä ja niihin on helppo vastata interaktiivisen UI:n kautta. Lähinnä valitsin plan moden jos en itse osannut kuvata mitä haluan tarpeeksi tarkasti.

[Claude Code - Plan mode dokumentaatio](https://code.claude.com/docs/en/common-workflows#when-to-use-plan-mode)


### Multi-Agent

Moniagenttiympäristössä on monia eri tehtäviin erikoistuneita agentteja, jotka voivat toimia samanaikaisesti tai koordinoidusti. Käyttämällä monia agentteja saadaan hajautettua työtä ja työtä on myös helpompi tehdä rinnakkaisesti.

Erilaisia agentteja
````
A: Specification Agent
B: Planning Agent
C: Implementation Agent
D: Review Agent
E: Testing/refactorin/security/monitoring/... Agent
````

_Claude/Cursor_ voi hoitaa kaikkia näitä tehtäviä, mutta yleistä on, että eri työkalut/agentit hoitavat eri **agenttirooleja**. 

Hyvin yleistäen voisi sanoa, että kaikki ovat yleisagentteja, mutta niillä on vain tarkemmin määritetty **rooli**, **rulet** ja **system promptit**. Valmiit (maksulliset) työkalut ovat yleensä täysin optimoitu niille suunniteltuun tehtävään.

Esim.
````
A: Specification Agent: GitHub Copilot joka käsittelee issuet GitHubissa
B: Planning Agent - Claude Code suunnittelee toteutuksen (plan mode)
B: Implementation Agent - Claude Code toteuttaa
C: Review Agent - CodeRabbit katselmoi koodit
D: Sentry AI Agent - Sentry AI analysoi tuotannon virheet ja ehdottaa korjauksia
````

#### Multi-Agent & Parallel Workflow

Parallel workflow tarkoittaa, että agentti-instanssit toimivat samanaikaisesti. Yleensä tällä tarkoitetaan, että tekee esim. samanaikaisesti monen eri taskin kehitystä.

Clauden ohjeissa oli ihan hyvin erilaisia workflowja kuvattu.

[Claude Code - workflows](https://code.claude.com/docs/en/common-workflows#create-pull-requests)

Monia samanaikaisia asioita tehdessä, ei oma aivokapasiteetti riitä kaiken seuraamiseen ja silloin on annettava kontrolli agentteille. Vaikka kontrollin siirtää pois itseltä, niin vastuu pysyy. Toiminnallisuuden varmistamisen helppous nouseeavainasemaan.

**Git worktrees** ovat tässä tärkeässä osassa, jotta voi montaa branchia työstää samaa aikaa. Worktree ei ole mikään uusi konsepti, mutta ei ollut itselle tullut vastaan ennen agenttihommia.

Tässä oma:

````
1. Tee featurelle/fixille oma git worktree
2. Suunnittelu/implementaatio agentti työskentelee omassa hakemistossa/branchissa
````

Yleensä tässä vaiheessa oli taas quotet käytetty nopeasti, joten pystyi menemään jatkamaan lomaa perheen kanssa. Pari tunnin jäähyn jälkeen oli sitten hyvä käydä potkimassa projektia vähän eteenpäin.

````
2.x Agenttien kysymysksiin vastamista
2.x Agentti ilmoittaa kun implementaatiot ovat valmiit
3. Tee PR
4. CodeRabbit katselmoi (tai GitHub Copilot) ja testikattavuus varmistetaan
5. Syötä CodeRabbitiltä valmiit promptit Claudelle tai pyydä agenttia hakemaan promptit
6. Pyydä agenttia tekemään lisää testejä, jos kattavuus ei ole riittävä
7. Pyydä agenttia commitoimaan muutokset
8. Testaa PR environment (tähän usein skip koska ei ole aikaa testata)
9. Merge PR to main
````

VS Codea tuli oikeastaan vaan käytettyä muokkausten katselemiseen ja välillä gitin työkaluna. Pelkällä CLI:llä olisi selvinnyt.

[Claude Code - VS Code integraatio](https://code.claude.com/docs/en/vs-code)

Vielä enemmän saisi varmaan automatisoitua PR:n luonteja jne., mutta valmis maailma, mihinkä tässä kiire.

#### Toiminnallisuuden varmistaminen

Agenttien kanssa samat asiat ovat tärkeitä kuin normaalistikkin:
* Hyvä arkkitehtuuri (feature slices, domain driven design, etc.)
* Koodin formatointi ja lintterit
* Yksikkötestit ja testikattavuus
* E2E testit (oletettavasti tarpeeksi testattavia polkuja)
* Pre-commit hook (ja pre-push hook)
* PR kohtainen testiympäristö
* Automaattinen katselmointi (CodeRabbit)
* Automaattinen testikattavuuden validointi

Kaiken **automatisointi** ja **pakottaminen** tärkeää, sillä agentti ei muista millään seurata sääntöjä. Esim. Claude ei aina luo _AGENTS.md_ tiedostoa automaattisesti vaan sitä pitää siitä muistuttaa. Sekään ei vielä takaa, että siellä olevia sääntöjä noudatetaan. Tämän takia perushommat unohtuvat usein, mutta jos esim. validoinnit ovat määritetty pre-commitissa, niin agentti ei pääse commitoimaan, ellei koodia ole validoitu. Samaten PR:n automaattinen katselmointi estää PR:n mergeämisen jne.

Liiallinen rinnakkaisten featureiden kehitys toi myös ongelmia työkalujen kanssa. Esim. ilmaisen CodeRabbitin kanssa ongelma oli, että tuntikohtainen PR quota loppui aika nopeasti, joten kaikkea ei tullut katselmoitua.

Muita mitä voi lisätä:
* Mutaatiotestit
* Lighthouse performance testaus
* Accessibilityn validointi (a11y)
* Visuaalinen regressiotestaus
* ...

AI:n kanssa testattavaa koodia tulee todella nopeasti, joten automaation on syytä olla hyvässä kunnossa ja testikoodia saa olla paljon. Mitä vähemmän haluaa manuaalisesti testata, sitä enemmän pitäisi olla automaatiotestejä.

### Rulet ja MCP:t

Itse vedin natiivina ilman suurempia **agenttiruleja** tai skilleja tai **MCP**:itä. Vain perus _AGENTS.md_ käytössä. Luotan, että pääosin agenttien omat *system promptit* ja *roolit* ovat riittävästi määriteltyjä. Näihin toki olisi hyvä käyttää enemmän aikaa, mutta oletan, että työkalut kehittyvät nopeammin kuin hyvät käytännöt yleistyvät.

**MCP**:n sijaan käytin pääasiassa agenttien/editorien omia toiminnallisuuksia tai agentit käyttivät CLI työkaluja.

Esim. GitHub MCP:n sijaan Claude voisi käyttää omaa GitHub-työkalua. Minulla agentti alkoi suoraan käyttämään GitHubin CLI:tä, joka oli jo omalla koneellä käyttövalmiina. Itse en antanut Claudelle täyttä vapautta käyttää GitHub CLI:tä, mutta sujuvuuden nimissä lukuoperaatiot sallin.

Claudelle voi tehdä **komentoja** ja **subagentteja**. Komento yksinkertaistaa jonkin pienen flown toistoa (esim. PR:n luonti, katselmointikommenttien haku ja korjaus jne.). Subagentti on taustalla toimiva agentti, joka voi suorittaa jonkin pidemmän taskin (esim. E2E testaus), jättäen pääprosessin vapaaksi tekemään jotain muuta.

CLI:llä agentti osasi luoda PR:iä ja myös käydä PR:n kommenteista lukemassa CodeRabbitin ehdottamia korjauksia, joten niitäkään ei pitänyt copy/pasteilla promptiin. Toki tokenit kuluivat vauhdilla. Myöskin Cursorin agentilla on välillä vaikeuksia käyttää CLI:tä (esim. sandboxissa), joten MCP on varmasti usein toimintavarmempi.

Myöskin CodeRabbit ohjeisti käyttämään CLI:tä agenttien kanssa.

[CodeRabbit - CLI integraatio](https://docs.coderabbit.ai/cli/claude-code-integration)

CLI:llä on hyvä lähteä liikkeelle ja parantaa myöhemmin MCP:ien kanssa mikäli tarvetta.

Claude osaa myös käyttää selainta ilman MCP:tä, mutta tuntui kyllä vielä tolkuttoman hitaalta.

[Claude Code - Chrome integraatio](https://code.claude.com/docs/en/chrome)

Toki onko siinä suurta eroa, että onko käytössä agentin oma toiminnallisuus vai MCP? Ehkä samaa siellä pellin alla lopulta on. Itse pääasiassa tykkään, että käyttämäni työkalu tarjoaa mahdollisimman kattavasti toiminnallisuudet ja ei pidä mitään konffata. Puolensa kyllä kummallakin.

## Kehittyneempi flow

**Multi-agent** ei siis välttämättä tarkoita, että omalla koneella on monta agenttia, jotka tekevät samaa tai erilaisia tehtäviä. Parempi itseasiassa saatta olla, että mahdollisimman harva on omalla koneella (esim. Cursor Cloud Agent, GitHub Copilot Agent), jolloin työtä on helpompi tehdä rinnakkaisesti.

Esimerkkinä multi-agentti flow ja näitä voi luonnollisesti tehdä myös rinnakkaisesti:
````
1. Tee issue
2. Agentti A tekee suunnitelman issuen pohjalta ja muokkaa issueta
3. Agentti B alkaa tekemään teknisen suunnitelman speksin pohjalta
4. Agentti B tekee teknisen toteutuksen
4. Agentti B tekee PR:n
5. Agentti C katselmoi koodin
6. Agentti X tekee muita tarkastuksia 
6. Agentti B korjaa löydetyt issuet
7. Validoi toiminnallisuus (automatisoi lisätesteillä)
8. Hyväksy PR (hyväksy automaattisesti kun PR:ssä ei huomautettavaa)
````

**Demo:** Edellisen flown pohjalta. Agentilta voi myös pyytää etsimään korjattavaa tai puuttuvia ominaisuuksia omasta codebasesta, jos ei valmiita issuita ole projektissa.

Tällä samalla tavalla myös agentit voivat taustalla tehdä jatkuvasti koodikannan parannuksia, kunhan prosessi on tarpeeksi automatisoitu.

## Cursor vs Claude

Cursorissa worktrees on paremmin integroitu työkaluun. Toki taas tässä on itsellä vähemmän kontrollia, joten alkuun on vähän epäselvää, että miten Cursor worktree brancheja luo, missä tiedostot ovat, PR:n luonti on vähän epäselvää, lokaali testaus worktree-hakemistossa jne.

[Cursor - worktrees dokumentaatio](https://cursor.com/docs/configuration/worktrees#worktrees-in-the-scm-pane)

Cursorissa pitää ajatella, että worktree moodissa koodit eivät ole normaalisi näkyvissa vaan pelkästään agentin muistissa, kunnes ne ovat hyväksytty. Ajatuksena on, että ei pidä ajatella, että missä koodit ovat, vaan että agentti tekee sen sen muistissa.

Hakemistot:
```
main      ~/src/my-repo/
worktree  ~/.cursor/worktrees/my-repo/abc/
```

Flow:
```
main 
  -> feature branch 
    -> worktree 
      -> muutokset 
      -> apply to feature branch 
  -> commit 
  -> PR 
-> main
```

Molemmissa on omat applikaatiot/toiminnallisuudet, jotka korvaavat MCP:t. Esimerkiksi selainta Cursor käyttää hyvinkin sujuvasti.

## Tulevaisuus

Hyvä vinkki oman ajattelun kehittämiseen:
> Miten voin tehdä toiminnallisuuden ilman editorin/IDE:n käyttöä ja mahdollisimman vähällä omalla kontrollilla?

Muistutus: Vastuu säilyy vaikka kontrollista luopuu.

_**Product engineers mindset**_ tulee jatkossa entistäkin tärkeämmäksi. Koodaus vähenee, mutta on tärkeää olla ymmärrys teknisistä mahdollisuuksista ja ratkaisuista. Toki on hyvä muistaa, että usein nykyisessäkin työssä koodaus on hyvin pieni osa kokonaisuutta.

* Tuotteen ja toimialan ymmärrys
  * Ymmärtää asiakkaan/käyttäjän ongelmat ja tarpeet
  * Tuntee liiketoiminnan
* Määrittelykyky ja tekninen kokonaisymmärrys
  * Osaa määritellä, mitä halutaan ja miten sen pitäisi toimia
  * Osaa arvioida ratkaisujen toteutettavuuden ja kustannukset
  * Ymmärtää teknisiä mahdollisuuksia ja rajoitteita
* Validointi ja testaus
  * Tietää, miten testata ja validoida ratkaisuja
  * Osaa rakentaa pipelineja, jotka varmistavat toiminnallisuuden

![to infinity & beyond kissakuva](/images/posts/multi-agent/multi-agent-cats.png){: width="500" }

Onnea ja menestystä tulevaisuuteen!








