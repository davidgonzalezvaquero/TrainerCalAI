import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY');
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: 'Eres un entrenador personal experto y amigable. Responde en español. Ayuda al usuario con sus preguntas sobre rutinas de ejercicio, nutrición, y fitness en general. Sé conciso y práctico.',
      messages: [
        { role: 'user', content: message },
      ],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
}
