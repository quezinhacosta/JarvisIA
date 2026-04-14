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
        body: JSON.stringify({ assunto, nivel, quantidade, tipo: "exercicios" }),
      });
      const data = await res.json();
      setExercicios(data);
      setEtapa("resolucao");
    } catch (error) {
      alert("Erro ao conectar com Jarvis");
    } finally {
      setLoading(false);
    }
  };

  const enviarRespostas = async () => {
    setLoading(true);
    const payload = exercicios.map((ex, i) => ({
      pergunta: ex.pergunta,
      resposta: respostas[i] || "Vazio"
    }));

    try {
      const res = await fetch("/api/gerar", {
        method: "POST",
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

              <button className="actionButton" onClick={gerarExercicios} disabled={loading || !assunto}>
                {loading ? "Processando..." : "Gerar Atividade"}
              </button>
            </div>
          </div>
        )}

        {etapa === "resolucao" && (
          <div className="view">
            <h2 className="sectionTitle">Desafios: {assunto}</h2>
            {exercicios.map((ex, index) => (
              <div key={index} className="exCard">
                <p className="exTexto">{ex.pergunta}</p>
                <textarea 
                  className="answerInput"
                  onChange={(e) => setRespostas({...respostas, [index]: e.target.value})}
                />
              </div>
            ))}
            <button className="actionButton" onClick={enviarRespostas} disabled={loading}>
              Finalizar
            </button>
          </div>
        )}

        {etapa === "feedback" && (
          <div className="view">
            <h2 className="sectionTitle">Feedback do Mentor</h2>
            <div className="feedbackContainer">
              <pre className="feedbackTexto">{feedback}</pre>
            </div>
            <button className="actionButton" onClick={() => setEtapa("input")}>Novo Treino</button>
          </div>
        )}
      </div>
    </main>
  );
}