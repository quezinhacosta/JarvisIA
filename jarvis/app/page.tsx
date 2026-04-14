import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      
      {/* Container */}
      <div className="max-w-3xl text-center">

        {/* Título */}
        <h1 className="text-5xl font-bold mb-6">
          Jarvis
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-300 mb-8">
          Seu assistente inteligente de estudos baseado em IA.
          Aprenda de forma prática, resolvendo exercícios e entendendo
          exatamente onde você precisa melhorar.
        </p>

        {/* Destaques */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
          
          <div className="bg-zinc-900 p-4 rounded-lg border border-blue-900">
            <h3 className="text-blue-400 font-semibold mb-2">
              Exercícios personalizados
            </h3>
            <p className="text-gray-400 text-sm">
              A IA gera atividades com base no tema e nível escolhido.
            </p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-blue-900">
            <h3 className="text-blue-400 font-semibold mb-2">
              Correção inteligente
            </h3>
            <p className="text-gray-400 text-sm">
              Receba feedback detalhado sobre suas respostas.
            </p>
          </div>

          <div className="bg-zinc-900 p-4 rounded-lg border border-blue-900">
            <h3 className="text-blue-400 font-semibold mb-2">
              Aprendizado contínuo
            </h3>
            <p className="text-gray-400 text-sm">
              Descubra seus pontos fracos e evolua com eficiência.
            </p>
          </div>

        </div>

        {/* Botão */}
        <button
          onClick={() => window.location.href = "/exercicio"}
          className="bg-blue-700 hover:bg-blue-800 transition px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          Gerar atividade
        </button>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        Jarvis © 2026 - Assistente de Estudos com IA
      </footer>
    </main>
  );
}