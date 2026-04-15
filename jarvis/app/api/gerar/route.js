import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { assunto, nivel, quantidade, tipo, promptOriginal } = await request.json();

    // Lista de modelos em ordem de preferência (menos congestionados primeiro)
    const modelos = [
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro-002",
      "gemini-2.5-flash"
    ];
    
    let model = null;
    let ultimoErro = null;
    
    // Tenta cada modelo até um funcionar
    for (const nomeModelo of modelos) {
      try {
        console.log(`Tentando modelo: ${nomeModelo}`);
        model = genAI.getGenerativeModel({ model: nomeModelo });
        
        if (tipo === "exercicios") {
          const prompt = `Crie ${quantidade} exercícios de múltipla escolha sobre "${assunto}" (nível ${nivel}).

Responda APENAS com JSON neste formato:
[
  {
    "pergunta": "texto da pergunta",
    "opcoes": ["(A) opcao 1", "(B) opcao 2", "(C) opcao 3", "(D) opcao 4"],
    "correta": "(A) opcao 1"
  }
]`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let text = response.text();
          
          text = text.replace(/```json|```/g, '').trim();
          const exercicios = JSON.parse(text);
          
          console.log(`✅ Modelo funcionou: ${nomeModelo}`);
          return NextResponse.json(exercicios);
          
        } else {
          const result = await model.generateContent(
            `Analise estas respostas de exercícios e forneça um feedback detalhado com uma nota de 0 a 10. Não coloque '*' na resposta.: ${promptOriginal}`
          );
          const response = await result.response;
          console.log(`✅ Modelo funcionou: ${nomeModelo}`);
          return NextResponse.json({ feedback: response.text() });
        }
        
      } catch (erro) {
        ultimoErro = erro;
        console.log(`❌ Modelo ${nomeModelo} falhou: ${erro.message}`);
        continue;
      }
    }
    throw ultimoErro || new Error("Nenhum modelo disponível no momento");
    
  } catch (error) {
    console.error("Erro no route.js:", error);
    return NextResponse.json(
      { error: "Os servidores do Google estão congestionados. Tente novamente em alguns segundos." },
      { status: 500 }
    );
  }
}