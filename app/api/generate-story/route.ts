// app/api/generate-story/route.ts
import { NextResponse } from 'next/server';
import type { Character, StoryResponse } from '@/components/verhaal_speciaal/types';

export async function POST(request: Request) {
  try {
    const { firstCharacter, secondCharacter, location, actNumber } = await request.json();

    const response = await fetch("https://verhaalspeciaalapi.responsible-it.nl/generateAct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characters: [
          {
            id: 1,
            name: firstCharacter.name,
            attributes: firstCharacter.attributes,
            readingLevel: firstCharacter.readingLevel,
          },
          {
            id: 2,
            name: secondCharacter.name,
            attributes: secondCharacter.attributes,
            readingLevel: secondCharacter.readingLevel,
          }
        ],
        location,
        actNumber,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error generating story: ${response.status}` }, { status: response.status });
    }

    const act: StoryResponse = await response.json();
    return NextResponse.json(act);
  } catch (error) {
    console.error('Error in generate-story API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
