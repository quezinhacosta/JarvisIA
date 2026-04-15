import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { assunto, nivel, quantidade, tipo, promptOriginal } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let instrucao = "";

    if (tipo === "exercicios") {
      instrucao = `Aja como um professor rigoroso e didático. 
      Gere exatamente ${quantidade} exercícios sobre o assunto "${assunto}", com nível de dificuldade "${nivel}".
      Retorne APENAS um array JSON puro, sem textos explicativos antes ou depois, seguindo este formato:
      [{"pergunta": "Texto da pergunta aqui"}]`;
    } else {
      instrucao = `Analise as seguintes respostas do aluno para os exercícios propostos. 
      Dados: ${promptOriginal}. 
      Dê um feedback detalhado, corrija erros e dê uma nota de 0 a 100.
      Use uma linguagem moderna e encorajadora.`;
    }

    const result = await model.generateContent(instrucao);
    const response = await result.response;
    const text = response.text();

    if (tipo === "exercicios") {
    const cleanedText = text.replace(/```json|```/g, "").trim();
  
    try {
      const jsonResponse = JSON.parse(cleanedText);
      // Garante que o que estamos enviando é de fato um Array
      return NextResponse.json(Array.isArray(jsonResponse) ? jsonResponse : [jsonResponse]);
      } catch (parseError) {
      console.error("Erro ao parsear JSON da IA:", cleanedText);
      return NextResponse.json([{ pergunta: "Erro ao formatar exercícios. Tente novamente." }]);
      }
    }


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao processar IA" }, { status: 500 });
  }
}