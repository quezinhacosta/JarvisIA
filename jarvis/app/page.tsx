"use client";

import  "./globals.css";

export default function Home() {
  return (
    <main className="container">
      
      <div className="content">
        <h1 className="title">Jarvis</h1>

        <p className="description">
          Seu assistente inteligente de estudos baseado em IA.
          Aprenda de forma prática, resolvendo exercícios e entendendo
          exatamente onde você precisa melhorar.
        </p>

        <div className="featuresGrid">
          
          <div className="featureCard">
            <h3 className="featureTitle">Exercícios personalizados</h3>
            <p className="featureText">
              A IA gera atividades com base no tema e nível escolhido.
            </p>
          </div>

          <div className="featureCard">
            <h3 className="featureTitle">Correção inteligente</h3>
            <p className="featureText">
              Receba feedback detalhado sobre suas respostas.
            </p>
          </div>

          <div className="featureCard">
            <h3 className="featureTitle">Aprendizado contínuo</h3>
            <p className="featureText">
              Descubra seus pontos fracos e evolua com eficiência.
            </p>
          </div>

        </div>

        <button
          onClick={() => window.location.href = "/exercicio"}
          className="button"
        >
          Gerar atividade
        </button>
      </div>

      <footer className="footer">
        Jarvis © 2026 - Assistente de Estudos com IA
      </footer>
    </main>
  );
}