# Jarvis - Assistente de Estudos com IA

## Nome da Solução

**Jarvis** - Assistente inteligente de estudos baseado em IA.

## Problema Escolhido

Estudantes que resolvem listas de exercícios como metodologia no processo de aprendizado frequentemente não têm acesso a um feedback imediato e estruturado sobre seu desempenho. Sem correção ou orientação sobre os erros, o entendimento do conteudo fica comprometido e a evolução se torna mais lenta.

## Objetivo da Aplicação

O Jarvis tem como objetivo fornecer um ambiente de estudo interativo onde o usuário pode gerar exercícios personalizados sobre qualquer assunto, respondê-los e receber um feedback detalhado com nota, correção e recomendações de melhoria, funcionando como um tutor particular disponível integralmente.

## Descrição do Caso de Uso

1. O usuário acessa a plataforma e configura um treino informando:
   - Assunto desejado 
   - Nível de dificuldade (Iniciante, Médio, Avançado)
   - Quantidade de questões (1 a 10)

2. O sistema gera os exercícios utilizando IA Groq e os apresenta ao usuário

3. O usuário responde as questões selecionando as alternativas

4. O sistema corrige as respostas, calcula a nota e gera um feedback personalizado

5. O histórico de sessões é armazenado e pode ser consultado em um dashboard

6. O usuário pode exportar relatórios em PDF com seu desempenho

## Tecnologias Utilizadas

### Front-end
- **Next.js 16** - Framework React com renderização híbrida
- **React 19** - Biblioteca para construção de interfaces
- **CSS Modules** - Estilização componentizada

### Back-end
- **Python 3.12** - Linguagem principal do back-end
- **FastAPI** - Framework para construção da API REST
- **SQLAlchemy** - ORM para gerenciamento do banco de dados
- **SQLite** - Banco de dados leve para persistência

### IA e Integrações
- **Groq API** - Provedor de IA para geração de exercícios e feedback
- **Modelo utilizado:** `llama-3.3-70b-versatile` (Meta Llama)

### Bibliotecas Adicionais
- **jsPDF** - Geração de relatórios PDF
- **jsPDF AutoTable** - Formatação de tabelas no PDF

## Arquitetura Geral da Solução
┌─────────────────────────────────────────────────────────────┐
│ Usuário │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Front-end (Next.js) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Página │ │ Página de │ │ Dashboard com │ │
│ │ Inicial │ │ Exercícios │ │ Histórico e PDF │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ API Routes (Next.js) │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ /api/gerar - Integração com Groq API (LLaMA 3.3) ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Back-end (Python/FastAPI) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ /api/ │ │ /api/ │ │ /api/ │ │
│ │ salvar- │ │ historico │ │ estatisticas │ │
│ │ sessao │ │ │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ Banco de Dados (SQLite) │
│ ┌─────────────────┐ ┌─────────────────────────────┐│
│ │ Tabela: │ │ Tabela: ││
│ │ sessoes │◄──────►│ questoes ││
│ └─────────────────┘ └─────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

### Fluxo de Dados

1. Usuário → Front-end → API Route → Groq API (LLaMA 3.3) → Exercícios gerados
2. Usuário responde → Front-end → Back-end Python → SQLite → Histórico salvo
3. Dashboard → Back-end Python → SQLite → Estatísticas e histórico

## Instruções de Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Python 3.12+
- npm ou yarn
- Chave de API do Groq (https://console.groq.com)

### Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/jarvis.git
cd jarvis

### Execução do front-end

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

## Explicação de Como a IA Foi Integrada

A integração da IA no Jarvis foi feita utilizando a API do Groq com o modelo `llama-3.3-70b-versatile`. A escolha do Groq se deu pela sua estabilidade superior em comparação com alternativas como o Google Gemini, que apresentava erros frequentes de congestionamento (503).

A comunicação com a IA ocorre através da API Route `app/api/gerar/route.js`. O fluxo é o seguinte:

1. O front-end envia uma requisição POST com os parâmetros da sessão (assunto, nível, quantidade de questões)

2. A API Route instancia o cliente Groq utilizando a chave armazenada em `GROQ_API_KEY`

3. Para geração de exercícios, é enviado um prompt estruturado solicitando um array JSON no formato: pergunta, quatro opções com letras (A, B, C, D) e a alternativa correta

4. Para geração de feedback, o prompt solicita uma análise detalhada com nota de 0 a 10, correção das respostas e recomendações de melhoria

5. A resposta da IA é tratada (remoção de marcações markdown e validação JSON) antes de ser retornada ao front-end

O modelo `llama-3.3-70b-versatile` foi escolhido por sua qualidade na geração de conteúdo educacional e pela velocidade de resposta proporcionada pela infraestrutura LPU do Groq.


## Exemplos de Uso da Aplicação

**Exemplo 1: Estudante de Ciências da Computação**

O usuário configura assunto "Estruturas de Dados", nível "Avançado" e 8 questões. O sistema gera exercícios sobre árvores binárias, listas encadeadas e algoritmos de ordenação. Ele responde as questões e recebe feedback detalhado sobre seu desempenho e uma nota geral, além de uma recomendação de possiveis melhorias.  O histórico fica salvo para acompanhar sua evolução. 

**Exemplo 2: Estudante de Ensino Fundamental**

O usuário configura assunto "Frações", nível "Iniciante" e 5 questões. O sistema gera os exercicios. Após responder, recebe feedback das suas respostas com uma nota final e explicação didática sobre os erros/acertos, bem como a indicação de principais pontos a serem reforçados para promoverem sua evolução no entendimento do assunto.

**Exemplo 3: Acompanhamento de desempenho**

Após duas semanas de uso, o estudante acessa o dashboard e visualiza seu progresso ao longo dos dias utilizando o Jarvis como apoio no processo de aprendizado. O sistema identifica todas as vezes que o aluno resolveu questões, bem como sua quantidade de acertos gerais e assunto mais estudado. Ele exporta um relatório PDF para mostrar ao professor.

**Exemplo 4: Revisão para prova final**

O estudante de Ciências da Computação cria uma sessão com assunto "Banco de Dados", nível "Médio" e 30 questões. Após responder, o feedback aponta erros recorrentes em comandos SQL de junção. Com base nisso, ele refaz os exercícios, melhora a nota de 6.0 para 8.5 e  sua evolução é registrada no seu histórico. 

## Limitações Atuais do MVP

**Dependência de API externa**  
O funcionamento do Jarvis depende exclusivamente da API do Groq. Em caso de instabilidade ou indisponibilidade do serviço, a geração de exercícios e feedback fica temporariamente comprometida.

**Sem autenticação de usuários**  
O MVP não possui sistema de login e cadastro. Todos os dados de histórico são armazenados localmente no navegador (localStorage), o que significa que cada dispositivo ou navegador mantém seu próprio histórico separado.

**Back-end local**  
O servidor Python com banco de dados SQLite precisa estar rodando localmente para salvar o histórico. Em produção, sem o deploy do back-end, os dados não persistem entre sessões.

**Sem compartilhamento**  
Não é possível compartilhar listas de exercícios, resultados ou relatórios com outros usuários ou professores.

**Exportação de PDF básica**  
O relatório gerado em PDF possui formatação simples, sem gráficos ou elementos visuais mais elaborados.

**Sem banco de dados em produção**  
Atualmente o SQLite é utilizado apenas localmente. Não há uma solção de banco de dados para múltiplos usuários simultâneos em ambiente de produção.

## Possíveis Evoluções Futuras

**Sistema de autenticação**  
Implementação de login e cadastro de usuários, permitindo que cada pessoa tenha seu próprio histórico salvo de forma segura e acessível de qualquer dispositivo.

**Dashboard com gráficos**  
Adição de gráficos visuais no dashboard para acompanhamento de desempenho, incluindo evolução de notas ao longo do tempo, distribuição de acertos por assunto e comparação entre diferentes períodos de estudo.

**Acompanhamento de evolução personalizado**  
Sistema que identifica pontos fracos do estudante e sugere automaticamente exercícios focados nas áreas que precisam de melhoria, criando um plano de estudos adaptativo.

**Questões discursivas**  
Suporte a diferentes formatos de questão, incluindo respostas discursivas com correção assistida por IA.

**Gamificação**  
Adição de elementos como medalhas, rankings, níveis de progresso e desafios semanais para aumentar o engajamento do usuário.