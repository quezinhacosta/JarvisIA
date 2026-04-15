"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./dashboard.css";

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalSessoes: 0,
    totalQuestoes: 0,
    totalAcertos: 0,
    mediaGeral: 0,
    melhorNota: 0,
    assuntoMaisEstudado: "",
  });
  const [sessaoSelecionada, setSessaoSelecionada] = useState(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setLoading(true);
        try {
            const [historicoRes, statsRes] = await Promise.all([
            fetch("http://localhost:8000/api/historico"),
            fetch("http://localhost:8000/api/estatisticas")
            ]);
            
            const historicoData = await historicoRes.json();
            const statsData = await statsRes.json();
            
            setHistorico(historicoData);
            setEstatisticas(statsData);
            setTemHistorico(historicoData.length > 0);
        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    };

  const calcularEstatisticas = (dados) => {
    if (dados.length === 0) return;

    let totalQuestoes = 0;
    let totalAcertos = 0;
    let melhorNota = 0;
    const assuntos = {};

    dados.forEach((sessao) => {
      totalQuestoes += sessao.total_questoes;
      totalAcertos += sessao.acertos;
      if (sessao.nota > melhorNota) melhorNota = sessao.nota;
      
      const assunto = sessao.assunto;
      assuntos[assunto] = (assuntos[assunto] || 0) + 1;
    });

    const assuntoMaisEstudado = Object.keys(assuntos).reduce((a, b) => 
      assuntos[a] > assuntos[b] ? a : b, ""
    );

    setEstatisticas({
      totalSessoes: dados.length,
      totalQuestoes: totalQuestoes,
      totalAcertos: totalAcertos,
      mediaGeral: (totalAcertos / totalQuestoes * 10).toFixed(1),
      melhorNota: melhorNota,
      assuntoMaisEstudado: assuntoMaisEstudado,
    });
  };

  const limparHistorico = () => {
    if (confirm("Tem certeza? Todo seu histórico será apagado.")) {
      localStorage.removeItem("historico");
      setHistorico([]);
      setEstatisticas({
        totalSessoes: 0,
        totalQuestoes: 0,
        totalAcertos: 0,
        mediaGeral: 0,
        melhorNota: 0,
        assuntoMaisEstudado: "",
      });
      setSessaoSelecionada(null);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(44, 203, 122);
    doc.text("Relatório de Estudos - Jarvis IA", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo Geral", 14, 45);
    
    const resumoData = [
      ["Total de sessões", estatisticas.totalSessoes.toString()],
      ["Total de questões respondidas", estatisticas.totalQuestoes.toString()],
      ["Total de acertos", estatisticas.totalAcertos.toString()],
      ["Média geral", `${estatisticas.mediaGeral}/10`],
      ["Melhor nota", `${estatisticas.melhorNota}/10`],
      ["Assunto mais estudado", estatisticas.assuntoMaisEstudado || "Nenhum"],
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [["Métrica", "Valor"]],
      body: resumoData,
      theme: "striped",
      headStyles: { fillColor: [44, 203, 122] },
    });
    
    let finalY = doc.lastAutoTable.finalY + 15;
    
    doc.text("Histórico de Sessões", 14, finalY);
    
    const historicoData = historico.map((s, i) => [
      i + 1,
      s.data,
      s.assunto,
      s.nivel,
      `${s.acertos}/${s.total_questoes}`,
      `${s.nota}/10`,
    ]);
    
    autoTable(doc, {
      startY: finalY + 5,
      head: [["#", "Data", "Assunto", "Nível", "Acertos", "Nota"]],
      body: historicoData,
      theme: "striped",
      headStyles: { fillColor: [44, 203, 122] },
    });
    
    doc.save(`relatorio-jarvis-${Date.now()}.pdf`);
  };

  const verDetalhes = (sessao) => {
    setSessaoSelecionada(sessao);
  };

  const fecharDetalhes = () => {
    setSessaoSelecionada(null);
  };

  return (
    <main className="dashboardContainer">
      <div className="glassWrapper">
        <div className="dashboardHeader">
          <h1 className="mainTitle">Seu histórico</h1>
          <div className="headerButtons">
            <button onClick={exportarPDF} className="pdfButton">
              Exportar PDF
            </button>
            <button onClick={limparHistorico} className="clearButton">
              Limpar Histórico
            </button>
            <button onClick={() => window.location.href = "/"} className="backButton">
              ← Voltar
            </button>
          </div>
        </div>

        {historico.length === 0 ? (
          <div className="emptyState">
            <p>Nenhum estudo realizado ainda.</p>
            <button onClick={() => window.location.href = "/exercicio"} className="actionButton">
              Começar Agora
            </button>
          </div>
        ) : (
          <>
            <div className="statsGrid">
              <div className="statCard">
                <h3>Sessões</h3>
                <p className="statNumber">{estatisticas.totalSessoes}</p>
              </div>
              <div className="statCard">
                <h3>Acertos</h3>
                <p className="statNumber">{estatisticas.totalAcertos}/{estatisticas.totalQuestoes}</p>
              </div>
              <div className="statCard">
                <h3>Média Geral</h3>
                <p className="statNumber">{estatisticas.mediaGeral}/10</p>
              </div>
              <div className="statCard">
                <h3>Melhor Nota</h3>
                <p className="statNumber">{estatisticas.melhorNota}/10</p>
              </div>
              <div className="statCard">
                <h3>Assunto mais estudado</h3>
                <p className="statNumber">{estatisticas.assuntoMaisEstudado || "-"}</p>
              </div>
            </div>

            <div className="historicoSection">
              <h2 className="sectionTitle">Histórico de Sessões</h2>
              <div className="historicoList">
                <table className="historicoTable">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Assunto</th>
                      <th>Nível</th>
                      <th>Acertos</th>
                      <th>Nota</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((sessao, index) => (
                      <tr key={sessao.id}>
                        <td>{sessao.data}</td>
                        <td>{sessao.assunto}</td>
                        <td>{sessao.nivel}</td>
                        <td>{sessao.acertos}/{sessao.total_questoes}</td>
                        <td className={sessao.nota >= 7 ? "notaBoa" : sessao.nota >= 5 ? "notaMedia" : "notaRuim"}>
                          {sessao.nota}/10
                        </td>
                        <td>
                          <button onClick={() => verDetalhes(sessao)} className="detailButton">
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {sessaoSelecionada && (
        <div className="modalOverlay" onClick={fecharDetalhes}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes da Sessão</h2>
            <p><strong>Data:</strong> {sessaoSelecionada.data}</p>
            <p><strong>Assunto:</strong> {sessaoSelecionada.assunto}</p>
            <p><strong>Nível:</strong> {sessaoSelecionada.nivel}</p>
            <p><strong>Nota:</strong> {sessaoSelecionada.nota}/10</p>
            
            <h3>Questões:</h3>
            <div className="questoesDetalhes">
              {sessaoSelecionada.questoes?.map((q, i) => (
                <div key={i} className={`questaoItem ${q.acertou ? "acertou" : "errou"}`}>
                  <p><strong>{i + 1}. {q.pergunta}</strong></p>
                  <p>Sua resposta: {q.resposta_usuario}</p>
                  <p>Resposta correta: {q.resposta_correta}</p>
                </div>
              ))}
            </div>
            
            <button onClick={fecharDetalhes} className="closeButton">Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}