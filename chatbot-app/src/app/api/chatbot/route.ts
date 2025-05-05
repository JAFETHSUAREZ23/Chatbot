// src/app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'Sin respuesta';
    console.log("reply", reply);
    
    return NextResponse.json({ reply });

  } catch (error) {
    const err = error as AxiosError;
    console.error('Error con OpenAI:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Error al comunicarse con OpenAI' }, { status: 500 });
  }
}
