"use client";

import { useState } from "react";
import "./exercicio.css";

export default function Exercicio() {
  const [etapa, setEtapa] = useState("input");
  const [loading, setLoading] = useState(false);
  const [assunto, setAssunto] = useState("");
  const [nivel, setNivel] = useState("Médio");
  const [quantidade, setQuantidade] = useState(3);
  const [exercicios, setExercicios] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [feedback, setFeedback] = useState("");

  const gerarExercicios = async () => {
    if (!assunto) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assunto, nivel, quantidade, tipo: "exercicios" }),
      });
      
      const data = await res.json();
      console.log("Resposta da API:", data);
      
      if (!res.ok) {
        throw new Error(data.error || "Erro na API");
      }
      
      setExercicios(data);
      setEtapa("resolucao");
    } catch (error) {
      console.error("Erro detalhado:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

        const salvarHistorico = (questoesComResultado, acertos, total, nota) => {
          const sessao = {
            id: Date.now(),
            data: new Date().toLocaleString(),
            assunto: assunto,
            nivel: nivel,
            total_questoes: total,
            acertos: acertos,
            nota: nota,
            questoes: questoesComResultado
          };
          
          const historico = JSON.parse(localStorage.getItem("historico") || "[]");
          historico.unshift(sessao);
          localStorage.setItem("historico", JSON.stringify(historico));
        };

  const enviarRespostas = async () => {
    if (!Array.isArray(exercicios)) return;
    setLoading(true);
    
    const questoesComResultado = exercicios.map((ex, i) => ({
      pergunta: ex.pergunta,
      resposta_usuario: respostas[i] || "Não respondida",
      resposta_correta: ex.correta,
      acertou: respostas[i] === ex.correta
    }));
    
    const total = questoesComResultado.length;
    const acertos = questoesComResultado.filter(q => q.acertou).length;
    const nota = (acertos / total * 10).toFixed(1);

    try {
      await fetch("/api/backend/salvar-sessao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assunto: assunto,
          nivel: nivel,
          total_questoes: total,
          acertos: acertos,
          nota: parseFloat(nota),
          questoes: questoesComResultado
        })
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
    
    const payload = exercicios.map((ex, i) => ({
      pergunta: ex.pergunta,
      resposta: respostas[i] || "Vazio"
    }));

    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          promptOriginal: JSON.stringify(payload), 
          tipo: "feedback" 
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setEtapa("feedback");
    } catch (error) {
      alert("Erro na correção");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="exercicioContainer">
      <div className="glassWrapper">
        {etapa === "input" && (
          <div className="view">
            <h1 className="mainTitle">Configurar Treino</h1>
            <div className="inputBox">
              <label className="inputLabel">Assunto</label>
              <input 
                className="simpleInput"
                placeholder="Ex: Estruturas de Dados, React, História..."
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
              />
              
              <div className="row">
                <div className="col">
                  <label className="inputLabel">Nível</label>
                  <select className="simpleSelect" value={nivel} onChange={(e) => setNivel(e.target.value)}>
                    <option>Iniciante</option>
                    <option>Médio</option>
                    <option>Avançado</option>
                  </select>
                </div>
                <div className="col">
                  <label className="inputLabel">Quantidade</label>
                  <input 
                    type="number" 
                    className="simpleSelect" 
                    min="1" max="10"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
              </div>

              <div className="buttonGroup">
                <button className="actionButton" onClick={gerarExercicios} disabled={loading || !assunto}>
                  {loading ? "Processando..." : "Gerar Atividade"}
                </button>
                
                <button className="button button-dashboard" onClick={() => window.location.href = "/dashboard"}>
                   Ver Histórico
                </button>
                
                <button className="button" onClick={() => window.location.href = "/"}>
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        )}

        {etapa === "resolucao" && (
          <div className="view">
            <h2 className="sectionTitle">Desafios: {assunto}</h2>
            {Array.isArray(exercicios) && exercicios.length > 0 ? (
              exercicios.map((ex, index) => (
                <div key={index} className="exCard">
                  <p className="exTexto">{index + 1}. {ex.pergunta}</p>
                  <div className="optionsGrid">
                    {ex.opcoes?.map((opcao, i) => {
                      const letra = String.fromCharCode(65 + i);
                      return (
                        <label 
                          key={i} 
                          className={`optionItem ${respostas[index] === opcao ? 'selected' : ''}`}
                          onClick={() => setRespostas({...respostas, [index]: opcao})}
                        >
                          <input 
                            type="radio" 
                            name={`q-${index}`} 
                            value={opcao}
                            checked={respostas[index] === opcao}
                            onChange={() => setRespostas({...respostas, [index]: opcao})}
                          />
                          <span className="optionLetter">{letra}</span>
                          <span className="optionText">{opcao}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p>Erro ao carregar questões. Tente gerar novamente.</p>
            )}
            <button className="actionButton" onClick={enviarRespostas} disabled={loading}>
              {loading ? "Processando..." : "Finalizar"}
            </button>
          </div>
        )}

        {etapa === "feedback" && (
          <div className="view">
            <h2 className="sectionTitle">Feedback do Jarvis</h2>
            <div className="feedbackContainer">
              <pre className="feedbackTexto">{feedback}</pre>
            </div>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="button"
              >
                Veja seu histórico
            </button>
            <button className="actionButton" onClick={() => setEtapa("input")}>Novo treino</button>
          </div>
        )}
      </div>
    </main>
  );
}