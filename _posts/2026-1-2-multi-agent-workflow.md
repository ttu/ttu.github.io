---
layout: post
title: Applikaation kehitys moniagenttiworkflowssa
excerpt: Applikaation kehitys moniagenttiympäristössä. Aloitettiin yksinkertaisesta single-agent workflowsta ja siirryttiin hiljalleen moniagentti- ja rinnakkaisagentti-workflowiin. Kokemuksia Claude Coden, CodeRabbitin ja muiden agenttien käytöstä git worktrees -työnkulussa.
---

**NOTE:** Postauksen sisältö on pääosin muistiinpanoja demon tueksi. Demossä käydään läpi flowta, ei perehdytä ruleihin/skilleihin etc.

Käytin tässä lomalla aikaa omien projektien koodaamiseen. **Cursorilla** olin jo tykittänyt lisälaskua vahingossa kiitettävän summan, joten päätin käyttää pitkästä aikaa **Claude Codea**, kun siitä on tullut maksettua.

Päätin vihdoin toteuttaa hätävara-applikaation, jonka toteuttamiseen ei ole aiemmin ollut aikaa.

Emergency Supply Tracker ([Repository](https://github.com/ttu/emergency-supply-tracker) - [Application](https://ttu.github.io/emergency-supply-tracker/))

Aikaa mennyt muutamia tunteja päivässä parin viikon ajan. Ilman agentteja oletettavasti täysiä työpäiviä olisi mennyt paljon enemmän.

Tällä kertaa aloitin speksaamalla alkuun hyvin ja agentti teki hyvän toteutussunnitelman. Perinteiseen tapaan hyvin verboosi, joten pitää muistaa jatkossa pyytää tiivistämään, jotta jaksaa itsekkin tuotoksen validoida.

[Emergency Supply Tracker - Initial Specifications](https://github.com/ttu/emergency-supply-tracker/tree/937108e9a876af7974cd675242775fb4251c7eaa/docs/specifications)

Toki tässä hyvässä suunnittelussa vähän vaikeuttaa se, että tarkalleen ei osaa speksatessa määritellä toiminnallisuutta, mitä tulee haluamaan. Noin 50 commitin jälkeen, kun oli perusteet kunnossa oli aika siirtyä iteroimaan.

_Muistutus_: Lue suunnitelma ajatuksella läpi. Arkkitehtuuriin liittyvät muutokset ovat hankalampia tehdä myöhemmin. Hyvät E2E testit heti alkuun. Nyt oli suunnitteilla vasta stepissa ~60.

Koska oli loma ja silloin viettää mielellään aikaa perheen kanssa, niin totesin, että helpompi laittaa Claude paukuttamaan mahdollisimman monta taskia samaa aikaa, jotta saa token quotan käytettyä mahdollisimman nopeasti. Oli siis hyvä tutustua miten saadaan samanaikaisesti laitettua monta agenttia töihin.

## Model

Modeleista Opus 4.5:sta oli kehittynyt maasta taivaisiin ja jengi sai sillä tehtyä jotain nanopartikkelikvanttilaskentatoteutuksia. Omassa käytössä importit meni vieläkin testien sisään jne. mutta hyvin se sai kyllä koodia aikaan. Perus CRUD:ssa ei nyt Sonnet 4.5:iin verrattuna mitään suurta edistystä.

Toki modelien kanssa vaikutta myös, että kuinka paljon palveluntarjoaja rajoittaa sen kykyä, eli joskus saattaa antaa huonompia vastauksia riippuen kuormasta.

## Komennot, Sub-agentit, Rulet ja MCP:t

Itse vedän pääosin "natiivina" ilman suurempia **agenttiruleja** tai skilleja tai **MCP**:itä. Vain perus _AGENTS.md_ käytössä. Luotan, että pääosin agenttien omat *system promptit* ja *roolit* ovat riittävästi määriteltyjä. 

Claudelle voi tehdä **komentoja** ja **sub-agentteja**. Komento yksinkertaistaa jonkin pienen flown toistoa (esim. PR:n luonti, katselmointikommenttien haku ja korjaus jne.). Subagentti on taustalla toimiva agentti, joka voi suorittaa jonkin pidemmän taskin (esim. E2E testaus), jättäen pääprosessin vapaaksi tekemään jotain muuta.

Tuntuu, että ruleissa ja commandeissa toimii samat lainalaisuudet kuin prompteissa, välillä noudatetaan, välillä ei. AGENTS:iakin noudatetaan vähän miten sattuu vaikka se olisikin agentin muistissa.

Näihin toki olisi hyvä käyttää enemmän aikaa, mutta oletan, että työkalut kehittyvät nopeammin kuin omat/hyvät käytännöt yleistyvät. Ja missä on yleiset jaetut parhaat agentit ja rulet? 

**MCP**:n sijaan käytin pääasiassa agenttien/editorien omia toiminnallisuuksia tai agentit käyttivät CLI työkaluja. Toki usein nämä toiminnallisuudet ovat MCP:itä.

Esim. GitHub MCP:n sijaan Claude voisi käyttää omaa GitHub-työkalua. Minulla agentti alkoi suoraan käyttämään GitHubin CLI:tä, joka oli jo omalla koneellä käyttövalmiina. Itse en antanut Claudelle täyttä vapautta käyttää GitHub CLI:tä, mutta sujuvuuden nimissä lukuoperaatiot sallin. Cursorin kanssa meni hermot GitHub CLI:n kanssa, koska oli yheysongelmia sandboxista, mutta se nyt vaikka ongelmatapauksissa kävi selaimella katsomassa PR:n kommentit...

CLI:llä agentti osasi luoda PR:iä ja myös käydä PR:n kommenteista lukemassa CodeRabbitin ehdottamia korjauksia, joten niitäkään ei pitänyt copy/pasteilla promptiin. Toki tokenit kuluivat vauhdilla.

Myöskin CodeRabbit ohjeisti käyttämään CLI:tä agenttien kanssa.

[CodeRabbit - CLI integraatio](https://docs.coderabbit.ai/cli/claude-code-integration)

CLI:llä on hyvä lähteä liikkeelle ja parantaa myöhemmin MCP:ien kanssa mikäli tarvetta.

Claude osaa myös käyttää selainta ilman MCP:tä, mutta tuntui välillä vielä tolkuttoman hitaalta.

[Claude Code - Chrome integraatio](https://code.claude.com/docs/en/chrome)

Toki onko siinä suurta eroa, että onko käytössä agentin oma toiminnallisuus vai MCP? Ehkä samaa siellä pellin alla lopulta on. Itse pääasiassa tykkään, että käyttämäni työkalu tarjoaa mahdollisimman kattavasti toiminnallisuudet ja ei pidä mitään konffata. Puolensa kyllä kummallakin.


## Workflow

### Single Agent

Aluksi tein yhtä toiminnallisuutta kerrallaan. Silloin pysyy paremmin kartalla, että mitä ollaan tekemässä. Taskien ollessa melko pieniä odotteluaikakin on lyhyt.

Tällä flowlla pysytyy myös helpommin validoimaan muutokset ja pysyy itse kontrollissa mitä on tehty.

````
1. Kirjoita promptiin mitä halutaan
2. Agentti koodaa
3. Mahdollisesti pyytää agentilta commit messagen tai muuta yhteenvetoa
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

Hyvin yleistäen voisi sanoa, että kaikki ovat yleisagentteja, mutta niillä on vain tarkemmin määritetty **rooli**, **rulet** ja **system promptit**. Valmiit (maksulliset) työkalut ovat yleensä täysin optimoitu niille suunniteltuun tehtävään. Toki tämän lisäksi työkaluissa saattaa olla vaikka mitä erikoiskäsittelyjä, joista käyttäjä ei ole tietoinen.

Esim.
````
A: Specification Agent - GitHub Copilot joka käsittelee issuet GitHubissa
B: Planning Agent - Claude Code suunnittelee toteutuksen (plan mode)
B: Implementation Agent - Claude Code toteuttaa
C: Review Agent - CodeRabbit katselmoi koodit
D: Sentry AI Agent - Sentry AI analysoi tuotannon virheet ja ehdottaa korjauksia
````

#### Multi-Agent & Parallel Workflow

Parallel workflow tarkoittaa, että agentti-instanssit toimivat samanaikaisesti. Yleensä tällä tarkoitetaan, että tekee esim. samanaikaisesti monen eri taskin kehitystä.

Clauden ohjeissa oli ihan hyvin erilaisia workflowja kuvattu, esim.

[Claude Code - create pull requests](https://code.claude.com/docs/en/common-workflows#create-pull-requests)
[Claude Code - worktrees](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees)

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

Hyvä muistaa, että agentti:
* Tuottaa koodia todennäköisyyksien ja opittujen mallien perusteella.
  * Optimoi kielillistä uskottavuutta, ei totuutta
* Ei ymmärrä tarkoitusta, liiketoimintaa tai miksi jotain tehdään.
* Ei ole samanlaista mallia järjestelmästä kuin ihmisellä.
* Muisti on lyhyt ja suoraa tietoa ei ole mitä siellä on.
  * Jokainen sessio lähtee tyhjästä muistista
* Tekee pienessä koossa järkeviä ratkaisuja, mutta kokonaisuuden kannalta huonoja.
* Riikoo epäsuoria oletuksia (suorituskyky, ylläpidettävyys, security).
* Ei huomaa, että jokin ratkaisu saattaa olla todella huono.

Nämä kyllä pätee myös ihmisiinkin, mutta agentin tapauksessa virheitä voidaan tehdä huomattavasti nopeammin.

Agenttien kanssa samat asiat ovat tärkeitä kuin normaalistikkin:
* Arkkitehtuuri, selkeä koodirakenne, modulaarisuus, tyypitys, dokumentaatio, konsistentti tyyli etc. (feature slices, component architecture, domain design etc.)
* Koodin formatointi ja lintterit
* Yksikkötestit ja testikattavuus
* E2E testit (oletettavasti tarpeeksi testattavia polkuja)
* Accessibilityn validointi (a11y)
* Pre-commit hook (ja pre-push hook)
* PR kohtainen testiympäristö
* Smoke testit uuteen ympäristöön
* Automaattinen katselmointi (CodeRabbit etc.)
* Automaattinen testikattavuuden validointi
* Staattinen koodianalyysi (SonarQube etc.)

Kaiken **automatisointi** ja **pakottaminen** tärkeää, sillä agentti ei muista millään seurata sääntöjä. Esim. Claude ei aina luo _AGENTS.md_ tiedostoa automaattisesti vaan sitä pitää siitä muistuttaa. Sekään ei vielä takaa, että siellä olevia sääntöjä noudatetaan. Tämän takia perushommat unohtuvat usein, mutta jos esim. validoinnit ovat määritetty pre-commitissa, niin agentti ei pääse commitoimaan, ellei koodia ole validoitu. Samaten PR:n automaattinen katselmointi estää PR:n mergeämisen jne.

Liiallinen rinnakkaisten featureiden kehitys toi myös ongelmia työkalujen kanssa. Esim. ilmaisen CodeRabbitin kanssa ongelma oli, että tuntikohtainen PR quota loppui aika nopeasti, joten kaikkea ei tullut katselmoitua.

Muita mitä voi lisätä:
* Mutaatiotestit
* Lighthouse performance testaus
* Visuaalinen regressiotestaus
* ...

AI:n kanssa testattavaa koodia tulee todella nopeasti, joten automaation on syytä olla hyvässä kunnossa ja testikoodia saa olla paljon. Mitä vähemmän haluaa manuaalisesti testata, sitä enemmän pitäisi olla automaatiotestejä.

### Tilanne ohjelmiston kasvaessa

Ohjelman kasvaessa sykli alkaa hidastua. CI löysi yhä enemmän virheitä, ja osa niistä meni CI:stä läpi. Kun agentti löysi virheitä, jotka eivät liittyneet sen tekemiin muutoksiin, se hämmentyi entistä enemmän. Oli pakko parantaa testejä ja kasvattaa kattavuutta sekä lisätä validointia. Lisättiin muun muassa smoke-testejä, otettiin testi-id:t käyttöön ja laajennettiin koodin type check kattamaan myös testikoodit. Validointisyklistä tuli huomattavasti hitaampi, mutta silti kaiken toimivuuden tarkistaminen omalla koneella oli edelleen nopeampaa kuin CI:n palautteen odottaminen.

```
Project Time Estimate

  Codebase Stats
  ┌─────────────────────────┬────────────────────────────────────────┐
  │         Metric          │                 Value                  │
  ├─────────────────────────┼────────────────────────────────────────┤
  │ Total commits           │ 226                                    │
  ├─────────────────────────┼────────────────────────────────────────┤
  │ Project duration        │ ~19 days (Dec 23, 2025 - Jan 11, 2026) │
  ├─────────────────────────┼────────────────────────────────────────┤
  │ Source code (src + e2e) │ ~43,400 lines                          │
  ├─────────────────────────┼────────────────────────────────────────┤
  │ Test code               │ ~20,700 lines                          │
  ├─────────────────────────┼────────────────────────────────────────┤
  │ Documentation           │ ~20,000 lines                          │
  └─────────────────────────┴────────────────────────────────────────┘
  Time Estimates (All AI-Generated)

  AI Time (Claude sessions):
  - ~226 commits × ~15-20 min avg per commit cycle = ~55-75 hours of AI compute time
  - This includes code generation, iteration, test fixes, and reviews

  Human Developer Time (supervision/prompting):
  - Review, prompting, and directing AI: ~3-5 min per commit = ~12-20 hours
  - Initial planning, architecture decisions, testing the app: ~10-15 hours
  - Total human time: ~25-35 hours (~1.5-2 hours/day over 19 days)

  Comparison

  If this were built manually by a developer:
  - 43K lines of production code + 21K test lines + 20K docs
  - Traditional estimate: 200-400 hours (5-10 weeks full-time)

  AI acceleration factor: ~6-10x faster with human oversight reduced to prompting and review.
```

25-35h on tässä vaiheessa projektia ihan realistinen arvio. Kadeksin vieläkin niitä, jotka vibettävät jonkun toimivan softan muutamassa tunnissa... Ja tämä nyt ei ole kummoinen softa loppupeleissä.

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

Tämän lisäksi on sitten vielä **Agentic Swarm** Frameworkit, joilla voi koordinoida monia agentteja yhdessä.

## Cursor vs Claude

Cursorissa worktrees on paremmin integroitu työkaluun. Toki taas tässä on itsellä vähemmän kontrollia, joten alkuun on vähän epäselvää, että miten Cursor worktree brancheja luo, missä tiedostot ovat, PR:n luonti, lokaali testaus worktree-hakemistossa jne.

[Cursor - worktrees dokumentaatio](https://cursor.com/docs/configuration/worktrees#worktrees-in-the-scm-pane)

Cursorissa ajatuksena on, että ei pidä ajatella, että missä koodit ovat, vaan että agentti tekee sen sen muistissa.

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
  * Pystyy arvioimaan agentin tuottaman koodin laadun
  * Osaa ohjata agentin parempaan suuntaan
* Validointi ja testaus
  * Tietää, miten testata ja validoida ratkaisuja
  * Osaa rakentaa pipelineja, jotka varmistavat toiminnallisuuden

Tämä kuvaus on kopioitu Moovyn [työpaikkailmoituksesta](https://moovysmart.fi/rekrytointi-ai-native-full-stack-developer/):

* **Delegate**, **Review**, **Own**
  * AI-native kehittäjä ei kirjoita kaikkea koodia itse. Hän delegoi sen AI-agenteille – Claude Code, Cursor, Antigravity – ja keskittyy siihen, missä ihminen on yhä ylivoimainen: arkkitehtuuriin, designiin ja laatuun.
    * **Delegate**: Anna AI:n kirjoittaa ensimmäinen versio. 
    * **Review**: Tarkista, paranna, refaktoroi. 
    * **Own**: Vastaa lopputuloksesta sataprosenttisesti.
* Työaika jakautuu:
  * 40% AI-generoidun koodin review ja refaktorointi
  * 20% Arkkitehtuuri ja design patterns
  * 20% AI-agenttien ohjaus ja delegointi
  * 10% Suunnittelu ja spesifiointi
  * 10% Kriittiset toteutukset (uudet, monimutkaiset ongelmat)
* Vastuu laadusta on 100%
* Rooli vaatii kokemusta – paljon kokemusta. Et voi arvioida AI:n tuottamaa koodia, jos et tiedä miltä hyvä koodi näyttää.

![to infinity & beyond kissakuva](/images/posts/multi-agent/multi-agent-cats.png){: width="500" }

Onnea ja menestystä tulevaisuuteen!








