# Jarvis - Assistente de Estudos com Inteligencia Artificial

## Nome da Solucao

Jarvis - Assistente pessoal de estudos com inteligencia artificial

## Problema Escolhido

Estudantes que resolvem listas de exercicios frequentemente nao tem acesso a um feedback imediato e estruturado sobre seu desempenho. Sem correcao ou orientacao sobre os erros, o aprendizado fica comprometido e a evolucao se torna mais lenta. O estudo sem retorno claro gera frustracao e perda de tempo.

## Objetivo da Aplicacao

O Jarvis tem como objetivo fornecer um ambiente de estudo interativo onde o usuario pode gerar exercicios personalizados sobre qualquer assunto, respondelos e receber um feedback detalhado com nota, correcao e recomendacoes de melhoria, funcionando como um tutor particular disponivel a qualquer momento.

## Descricao do Caso de Uso

O usuario acessa a plataforma e configura um treino informando o assunto desejado, o nivel de dificuldade e a quantidade de questoes. O sistema gera os exercicios utilizando inteligencia artificial e os apresenta ao usuario. O usuario responde as questoes selecionando as alternativas. O sistema corrige as respostas, calcula a nota e gera um feedback personalizado. O historico de sessoes e armazenado e pode ser consultado em um dashboard. O usuario pode exportar relatorios em PDF com seu desempenho.

## Acesso direto

[Acessar o Jarvis](https://jarvis-ia-ashen.vercel.app/)

## Tecnologias Utilizadas

Front-end: Next.js 16, React 19 e CSS Modules.

Back-end: Python 3.12, FastAPI, SQLAlchemy e SQLite.

IA e integracoes: Groq API com o modelo llama-3.3-70b-versatile.

Bibliotecas adicionais: jsPDF e jsPDF AutoTable para geracao de PDFs.

## Arquitetura Geral da Solucao

O sistema e composto por tres camadas principais.

A camada de front-end e responsavel pela interface com o usuario. Ela e construida com Next.js e React, e inclui a pagina inicial, a pagina de exercicios e o dashboard de historico.

A camada de API Routes do Next.js e responsavel pela comunicacao com a inteligencia artificial. O arquivo app/api/gerar/route.js gerencia as requisicoes para a API do Groq.

A camada de back-end em Python e responsavel pelo armazenamento dos dados. Ela expoe endpoints REST para salvar sessoes, consultar historico e obter estatisticas. Os dados sao persistidos em um banco SQLite com duas tabelas: sessoes e questoes.

┌─────────────────────────────────────────────────────────────┐
│                         Usuário                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Front-end (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Página     │  │  Página de  │  │  Dashboard com      │ │
│  │  Inicial    │  │  Exercícios │  │  Histórico e PDF    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  /api/gerar - Integracao com Groq API (LLaMA 3.3)       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Back-end (Python/FastAPI)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  /api/      │  │  /api/      │  │  /api/              │ │
│  │  salvar-    │  │  historico  │  │  estatisticas       │ │
│  │  sessao     │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Banco de Dados (SQLite)                   │
│  ┌─────────────────┐        ┌─────────────────────────────┐│
│  │  Tabela:        │        │  Tabela:                    ││
│  │  sessoes        │◄──────►│  questoes                   ││
│  └─────────────────┘        └─────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

O fluxo de dados ocorre da seguinte forma. O usuario envia uma requisicao para gerar exercicios. O front-end chama a API Route, que consulta o Groq e retorna os exercicios em formato JSON. O usuario responde as questoes. O front-end envia as respostas para a API Route de feedback, que novamente consulta o Groq. O resultado e exibido ao usuario. Simultaneamente, o front-end envia os dados da sessao para o back-end Python, que os armazena no banco de dados. Quando o usuario acessa o dashboard, o front-end consulta o back-end para exibir o historico e as estatisticas.

## Instrucoes de Instalacao e Execucao

Pre-requisitos: Node.js 18 ou superior, Python 3.12 ou superior, npm ou yarn, e uma chave de API do Groq obtida em console.groq.com.

Configuracao do ambiente: Clone o repositorio, acesse a pasta do projeto e crie um arquivo .env.local com a seguinte variavel: GROQ_API_KEY=chave da api.

### Execução do Front-end

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar em http://localhost:3000

### Execução do back-end 

# Entrar na pasta do back-end
cd back-end

# Instalar dependências Python
pip install -r requirements.txt

# Executar o servidor
python main.py

# O servidor rodará em http://localhost:8000

### Execução simultânea (Front-end + back-end)

cd jarvis
npm run start:all 

## Explicacao de Como a IA Foi Integrada

A integracao da inteligencia artificial foi feita utilizando a API do Groq com o modelo llama-3.3-70b-versatile. A escolha do Groq se deu pela sua estabilidade superior em comparacao com alternativas como o Google Gemini, que apresentava erros frequentes de congestionamento.

A comunicacao com a IA ocorre atraves da API Route app/api/gerar/route.js. O front-end envia uma requisicao POST com os parametros da sessao. A API Route instancia o cliente Groq utilizando a chave armazenada em GROQ_API_KEY.

Para a geracao de exercicios, e enviado um prompt estruturado que solicita um array JSON no seguinte formato: pergunta, quatro opcoes com letras A, B, C e D, e a alternativa correta.

Para a geracao de feedback, o prompt solicita uma analise detalhada com nota de zero a dez, correcao das respostas e recomendacoes de melhoria.

## Exemplos de Uso da Aplicacao

Exemplo 1: Estudante de Ciencias da Computacao

O estudante configura assunto Estruturas de Dados, nivel Avancado e 8 questoes. O sistema gera exercicios sobre arvores binarias, listas encadeadas e algoritmos de ordenacao. Ele responde as questoes e recebe feedback com nota, correcao das respostas erradas e recomendacoes de materiais para aprofundamento. O historico fica salvo para acompanhar evolucao na disciplina.

Exemplo 2: Estudante de Ensino Fundamental

O usuário configura assunto "Frações", nível "Iniciante" e 5 questões. O sistema gera os exercicios. Após responder, recebe feedback das suas respostas com uma nota final e explicação didática sobre os erros/acertos, bem como a indicação de principais pontos a serem reforçados para promoverem sua evolução no entendimento do assunto.

Exemplo 3: Acompanhamento de desempenho

Apos duas semanas de uso, o estudante acessa o dashboard e visualiza seu progresso: realizou 12 sessoes, media geral 7,2, acertou 45 de 60 questoes. O sistema identifica que seu pior desempenho foi em Matematica e melhor em Programacao. Ele exporta um relatorio PDF para mostrar ao professor.

Exemplo 4: Revisao para prova final

O estudante de Ciencias da Computacao cria uma sessao com assunto Banco de Dados, nivel Medio e 10 questoes. Apos responder, o feedback aponta erros recorrentes em comandos SQL de juncao. Com base nisso, ele refaz os exercicios, melhora a nota de 6,0 para 8,5 e registra evolucao no historico.

## Limitacoes Atuais do MVP

Dependencia de API externa: O funcionamento do Jarvis depende exclusivamente da API do Groq. Em caso de instabilidade ou indisponibilidade do servico, a geracao de exercicios e feedback fica temporariamente comprometida.

Sem autenticacao de usuarios: O MVP nao possui sistema de login. Todos os dados de historico sao armazenados localmente no navegador, o que significa que cada dispositivo ou navegador mantem seu proprio historico separado.

Back-end local: O servidor Python com banco de dados SQLite precisa estar rodando localmente para salvar o historico. Em producao, sem o deploy do back-end, os dados nao persistem entre sessoes.

Sem compartilhamento: Nao e possivel compartilhar listas de exercicios, resultados ou relatorios com outros usuarios ou professores.

Quantidade limitada de questoes: A geracao esta limitada a no maximo 10 questoes por sessao para garantir tempo de resposta adequado da API.

Exportacao de PDF basica: O relatorio gerado em PDF possui formatacao simples, sem graficos ou elementos visuais mais elaborados.

Sem banco de dados em producao: Atualmente o SQLite e utilizado apenas localmente. Nao ha uma solucao de banco de dados para multiplos usuarios simultaneos em ambiente de producao.

## Possiveis evoluções futuras

Sistema de autenticacao: Implementacao de login e cadastro de usuarios, permitindo que cada pessoa tenha seu proprio historico salvo de forma segura e acessivel de qualquer dispositivo.

Dashboard com graficos: Adição de gráficos visuais no dashboard para acompanhamento de desempenho, incluindo evolucao de notas ao longo do tempo, distribuicao de acertos por assunto e comparacao entre diferentes periodos de estudo.

Acompanhamento de evolução personalizado: Sistema que identifica pontos fracos do estudante e sugere automaticamente exercicios focados nas areas que precisam de melhoria, criando um plano de estudos adaptativo.

Banco de dados em nuvem: Migracao do SQLite local para um banco de dados PostgreSQL hospedado em nuvem, garantindo persistencia dos dados e suporte a multiplos usuarios simultaneos.

Modo offline: Implementacao de Progressive Web App para permitir uso sem conexao com a internet, com sincronizacao automatica quando o usuario voltar a ficar online.

Compartilhamento de resultados: Funcionalidade para exportar relatorios em formatos variados como PDF, CSV e JSON, e compartilhar resultados com professores ou colegas.

Questoes discursivas: Suporte a diferentes formatos de questao, incluindo respostas discursivas com correcao assistida por inteligencia artificial.

Gamificação: Adicao de elementos como medalhas, rankings, niveis de progresso e desafios semanais para aumentar o engajamento do usuario.
