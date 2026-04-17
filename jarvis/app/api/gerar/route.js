import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { assunto, nivel, quantidade, tipo, promptOriginal } = await request.json();

    if (tipo === "exercicios") {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Você é um professor experiente. Gere ${quantidade} exercícios de múltipla escolha sobre "${assunto}" (nível ${nivel}).

IMPORTANTE: Responda APENAS com um array JSON válido, sem texto adicional.

Formato exato:
[
  {
    "pergunta": "texto da pergunta aqui",
    "opcoes": ["(A) texto da opção A", "(B) texto da opção B", "(C) texto da opção C", "(D) texto da opção D"],
    "correta": "(A) texto da opção correta"
  }
]`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content || "";
      const cleanText = text.replace(/```json|```/g, '').trim();
      const exercicios = JSON.parse(cleanText);
      
      return NextResponse.json(exercicios);
      
    } else {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Você é um tutor educacional. Analise estas respostas de exercícios e forneça um feedback detalhado sobre cada questão, e no final gere uma nota geral de 0 a 10.

Respostas do aluno: ${promptOriginal}

Seja construtivo, aponte acertos e erros, e dê dicas de melhoria.`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const feedback = completion.choices[0]?.message?.content || "";
      return NextResponse.json({ feedback });
    }
    
  } catch (error) {
    console.error("Erro no Groq:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}