import { Character } from "@/components/verhaal_speciaal/types";

export function generateFirstPrompt(
  setting: string,
  characterOne: Character,
  characterTwo: Character,
  numberOfActs: number
) {
  return `
    Schrijf de eerste acte van een verhaal dat verder kan groeien naar ${numberOfActs} actes, dat geschikt is voor kinderen. Gebruik de volgende elementen:
      - Setting: ${setting}
      - Karakter 1: Naam: ${characterOne.name}, Attributen: ${characterOne.attributes.join(
        ", "
      )}, Leesniveau: ${characterOne.readingLevel}
      - Karakter 2: Naam: ${characterTwo.name}, Attributen: ${characterTwo.attributes.join(
        ", "
      )}, Leesniveau: ${characterTwo.readingLevel}
  
      Structuur:
      - Laat het verhaal beginnen met de verteller die de setting beschrijft.
      - Gebruik dialogen tussen Karakter 1 en Karakter 2 om de gebeurtenissen te vertellen.
      - er moet een korte vraag over iets wat er is gebeurd zijn en een KORT antwoord op die vraag van maximaal 5 woorden
      - Een prompt voor een image generator die aansluit bij de locatie van het verhaal, in de 'papercraft' stijl, waarbij papier en vouwen centraal staan. De image mag geen mensen of characters bevatten.
      - De verteller is altijd user 3
      - Formatteer de output in JSON format als een array van objecten in de vorm: een array met daarin de act en als tweede item een imageprompt
        [
            {
              "title": "eerste act titel",
              "vraag": "vraag voor eerste act",
              "antwoord": "antwoord voor eerste act",
              "lines": [
                  {"user": 3, "actor": "Narrator", "line": "Beschrijving van de setting."},
                  {"user": 2, "actor": "KarakterNaam", "line": "Dialoog van het karakter."},
                  ...
                ]
          },
          {
            "image_prompt": image prompt
          }
        ]
    `;
}
export function generateMiddlePrompt(
  setting: string,
  characterOne: Character,
  characterTwo: Character,
  numberOfActs: number,
  currentAct: number,
  previousAct: string
) {
  return `
  Schrijf de ${currentAct}de acte van een verhaal dat verder kan groeien naar ${numberOfActs} actes, dat geschikt is voor kinderen. Gebruik de volgende elementen:
    - Setting: ${setting}
    - Karakter 1: Naam: ${characterOne.name}, Attributen: ${characterOne.attributes.join(
      ", "
    )}, Leesniveau: ${characterOne.readingLevel}
    - Karakter 2: Naam: ${characterTwo.name}, Attributen: ${characterTwo.attributes.join(
      ", "
    )}, Leesniveau: ${characterTwo.readingLevel}

    dit is de vorige acte, bouw hier op verder: ${previousAct}

    Structuur:
    - ga verder op een situatie uit het vorige verhaal
    - Gebruik dialogen tussen Karakter 1 en Karakter 2 om de gebeurtenissen te vertellen.
    - er moet een korte vraag over iets wat er is gebeurd zijn en een KORT antwoord op die vraag van maximaal 5 woorden
    - Een prompt voor een image generator die aansluit bij de locatie van het verhaal, in de 'papercraft' stijl, waarbij papier en vouwen centraal staan. De image mag geen mensen of characters bevatten.
    - De verteller is altijd user 3
    - Formatteer de output in JSON format als een array van objecten in de vorm: een array met daarin de act en als tweede item een imageprompt
      [
          {
            "title": "${currentAct}de act titel",
            "vraag": "vraag voor ${currentAct}de act",
            "antwoord": "antwoord voor ${currentAct}de act",
            "lines": [
                {"user": 3, "actor": "Narrator", "line": "Beschrijving van de setting."},
                {"user": 2, "actor": "KarakterNaam", "line": "Dialoog van het karakter."},
                ...
              ]
        },
        {
          "image_prompt": image prompt
        }
      ]
  `;
}
export function generateLastPrompt(
  setting: string,
  characterOne: Character,
  characterTwo: Character,
  numberOfActs: number,
  previousAct: string
) {
  return `
  Schrijf de laatste acte van een verhaal maken die ${numberOfActs} actes had, dat geschikt is voor kinderen. Gebruik de volgende elementen:
    - Setting: ${setting}
    - Karakter 1: Naam: ${characterOne.name}, Attributen: ${characterOne.attributes.join(
      ", "
    )}, Leesniveau: ${characterOne.readingLevel}
    - Karakter 2: Naam: ${characterTwo.name}, Attributen: ${characterTwo.attributes.join(
      ", "
    )}, Leesniveau: ${characterTwo.readingLevel}

    dit is de vorige acte, bouw hier op verder: ${previousAct}

    Structuur:
    - ga verder op een situatie uit het vorige verhaal en zorg voor een goed slot voor het verhaal
    - Zorg ervoor dat het verhaal een duidelijke moraal of leerzaam moment bevat.
    - Gebruik dialogen tussen Karakter 1 en Karakter 2 om de gebeurtenissen te vertellen.
    - er moet een korte vraag over iets wat er is gebeurd zijn en een KORT antwoord op die vraag van maximaal 5 woorden
    - Een prompt voor een image generator die aansluit bij de locatie van het verhaal, in de 'papercraft' stijl, waarbij papier en vouwen centraal staan. De image mag geen mensen of characters bevatten.
    - De verteller is altijd user 3
    - Formatteer de output in JSON format als een array van objecten in de vorm: een array met daarin de act en als tweede item een imageprompt
      [
          {
            "title": "laatste act titel",
            "vraag": "vraag voor de laatste act",
            "antwoord": "antwoord voor de laatste act",
            "lines": [
                {"user": 3, "actor": "Narrator", "line": "Beschrijving van de setting."},
                {"user": 2, "actor": "KarakterNaam", "line": "Dialoog van het karakter."},
                ...
              ]
        },
        {
          "image_prompt": image prompt
        }
      ]
  `;
}
export const numberOfActs: number = 3;

export const tips = [
  "Laat je stem veranderen om je personage echt tot leven te brengen. Hoe grootser je speelt, hoe leuker het wordt!",
  "Aan de kleur van het lezersicoon kun je zien wie er aan de beurt is. Mis je beurt niet!",
  "Benadruk de emoties in de tekst. Probeer boosheid, vreugde of verdriet zo intens mogelijk over te brengen.",
  "Bespreek na afloop wat jullie favoriete momenten waren en hoe jullie de personages nog levendiger kunnen maken bij de volgende keer!",
  "Lezen is niet alleen met je stem! Trek gezichten die passen bij de emoties van je personage en kijk wat er gebeurd...",
  "Dim de lichten voor een griezelverhaal of zet een lampje aan voor extra sfeer tijdens een mysterie.",
  "Lees op het juiste moment je tekst voor, zodat het verhaal soepel blijft verlopen en niet vertraagd.",
];
