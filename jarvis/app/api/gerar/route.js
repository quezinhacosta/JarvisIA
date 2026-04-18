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
            content: `Voce e um professor experiente. Gere ${quantidade} exercicios de multipla escolha sobre "${assunto}" (nivel ${nivel}).

Responda APENAS com um array JSON valido, sem texto adicional.

Formato exato:
[
  {
    "pergunta": "texto da pergunta aqui",
    "opcoes": ["(A) texto da opcao A", "(B) texto da opcao B", "(C) texto da opcao C", "(D) texto da opcao D"],
    "correta": "(A) texto da opcao correta"
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
            content: `Voce e um mentor educacional paciente e direto. Analise as respostas do aluno.

Respostas do aluno: ${promptOriginal}

Escreva o feedback EXATAMENTE neste formato. A nota NAO deve ser incluida, pois ela sera mostrada separadamente pelo sistema.

QUESTAO 1: [texto resumido da pergunta]
Sua resposta: [resposta do aluno]
Resposta correta: [resposta correta]
Situacao: [Acertou ou Errou]
Explicacao: [uma frase direta explicando o erro ou confirmando o acerto]

QUESTAO 2: [texto resumido da pergunta]
Sua resposta: [resposta do aluno]
Resposta correta: [resposta correta]
Situacao: [Acertou ou Errou]
Explicacao: [uma frase direta explicando o erro ou confirmando o acerto]

(repita para todas as questoes)

ANALISE PERSONALIZADA:
[2 paragrafos analisando os erros e acertos do aluno. Aponte padroes, pontos fracos e pontos fortes. Use "voce" para se referir ao aluno. Seja encorajador mas direto. Nao mencione a nota.]

O QUE ESTUDAR A SEGUIR:
[Liste 2 ou 3 topicos especificos que o aluno precisa revisar com base nos erros]

Regras:
- Nao use asteriscos, tracos ou hifens
- Nao mencione a nota em nenhum lugar
- Use apenas texto plano com quebras de linha`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      const feedback = completion.choices[0]?.message?.content || "";
      return NextResponse.json({ feedback });
    }
    
  } catch (error) {
    console.error("Erro no Groq:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao processar requisicao" },
        { status: 500 }
    );
  }
}