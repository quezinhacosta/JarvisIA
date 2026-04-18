## Nome da Solução

**Jarvis** - Assistente pessoal de estudos com inteligência artificial

---

## Problema Escolhido

Estudantes que resolvem listas de exercícios frequentemente não têm acesso a um feedback imediato e estruturado sobre seu desempenho. Sem correção ou orientação sobre os erros, o aprendizado fica comprometido e a evolução se torna mais lenta. O estudo sem retorno claro gera frustração e perda de tempo.

---

## Objetivo da Aplicação

O Jarvis tem como objetivo fornecer um ambiente de estudo interativo onde o usuário pode gerar exercícios personalizados sobre qualquer assunto, respondê-los e receber um feedback detalhado com nota, correção e recomendações de melhoria, funcionando como um tutor particular disponível a qualquer momento.

---

## Descrição do Caso de Uso

O usuário acessa a plataforma e configura um treino informando:

* Assunto desejado
* Nível de dificuldade
* Quantidade de questões

O sistema gera os exercícios utilizando inteligência artificial e os apresenta ao usuário. O usuário responde às questões selecionando as alternativas.

**O sistema:**
* Corrige as respostas
* Calcula a nota
* Gera um feedback personalizado

O histórico de sessões é armazenado e pode ser consultado em um dashboard. O usuário pode exportar relatórios em PDF com seu desempenho.

---

## Acesso Direto

[Acessar o Jarvis](https://jarvis-ia-ashen.vercel.app/)

---

## Tecnologias Utilizadas

### Front-end
* Next.js 16
* React 19
* CSS Modules

### Back-end
* Python 3.12
* FastAPI
* SQLAlchemy
* SQLite

### IA e Integrações
* Groq API
* Modelo llama-3.3-70b-versatile

### Bibliotecas Adicionais
* jsPDF
* jsPDF AutoTable

---

## Arquitetura geral da solução

O sistema é composto por três camadas principais.

### Front-end
A camada de front-end é responsável pela interface com o usuário. Ela é construída com Next.js e React, e inclui:
* Página inicial
* Página de exercícios
* Dashboard de histórico

### API Routes (Next.js)
A camada de API Routes do Next.js é responsável pela comunicação com a inteligência artificial.
* **Arquivo principal:** `app/api/gerar/route.js`

### Back-end (Python)
A camada de back-end em Python é responsável pelo armazenamento dos dados. Ela expõe endpoints REST para:
* Salvar sessões
* Consultar histórico
* Obter estatísticas

Os dados são persistidos em um banco SQLite com duas tabelas: `sessoes` e `questoes`.

---

### Diagrama da arquitetura

```text
┌─────────────────────────────────────────────────────────────┐
│                           Usuário                           │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Front-end (Next.js)                      │
│ ┌─────────────┐       ┌─────────────┐      ┌──────────────┐ │
│ │   Página    │       │  Página de  │      │  Dashboard   │ │
│ │   Inicial   │       │ Exercícios  │      │  e Relatórios│ │
│ └─────────────┘       └─────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Routes (Next.js)                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  /api/gerar - Integração com Groq API (LLaMA 3.3)       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Back-end (Python/FastAPI)                  │
│ ┌─────────────┐       ┌─────────────┐      ┌──────────────┐ │
│ │    /api/    │       │    /api/    │      │    /api/     │ │
│ │ salvar-sessao│      │  historico  │      │ estatísticas │ │
│ └─────────────┘       └─────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Banco de Dados (SQLite)                   │
│      ┌─────────────────┐           ┌──────────────────┐     │
│      │     Tabela:     │           │     Tabela:      │     │
│      │     sessoes     │◄─────────►│     questoes     │     │
│      └─────────────────┘           └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘

````


---

## Fluxo de dados

O fluxo de dados ocorre da seguinte forma:

1. O usuario envia uma requisicao para gerar exercicios  
2. O front-end chama a API Route  
3. A API consulta o Groq e retorna os exercicios em formato JSON  
4. O usuario responde as questoes  
5. O front-end envia as respostas para a API Route de feedback  
6. A API consulta novamente o Groq para gerar o feedback 
7. O resultado e exibido ao usuario  
8. O front-end envia os dados da sessao para o back-end Python  
9. Os dados sao armazenados no banco  
10. O dashboard consulta o back-end para exibir o historico e as estatisticas  

---

## Instruções de instalação e execução

### Pre-requisitos

- Node.js 18 ou superior  
- Python 3.12 ou superior  
- npm ou yarn   

### Configuração do ambiente

Clone o repositorio.

---

### Execução do Front-end

cd jarvis

npm install

npm run dev


Acessar em: http://localhost:3000

---

### Execução do back-end 


cd back-end

pip install fastapi uvicorn sqlalchemy pydantic

python main.py


O servidor rodara em: http://localhost:8000

---

### Execução simultanea (Front-end + back-end)


cd jarvis

npm install --save-dev concurrently

npm run start:all


---

## Explicação de como a IA foi integrada

A integracao da inteligencia artificial foi feita utilizando a API do Groq com o modelo llama-3.3-70b-versatile. A escolha do Groq se deu pela sua estabilidade superior em comparacao com alternativas como o Google Gemini, que apresentava erros frequentes de congestionamento.

A comunicacao com a IA ocorre atraves da API Route app/api/gerar/route.js. O front-end envia uma requisicao POST com os parametros da sessao. A API Route instancia o cliente Groq utilizando a chave armazenada em GROQ_API_KEY.

Para a geracao de exercicios, e enviado um prompt estruturado que solicita um array JSON no seguinte formato: pergunta, quatro opcoes com letras A, B, C e D, e a alternativa correta.

Para a geracao de feedback, o prompt solicita uma analise detalhada questao por questao, sem incluir a nota, pois esta e calculada separadamente pelo sistema.

---

## Exemplos de uso da aplicação

### Exemplo 1: Estudante de Ciencias da Computacao

O estudante configura assunto Estruturas de Dados, nivel Avancado e 8 questoes. O sistema gera exercicios sobre arvores binarias, listas encadeadas e algoritmos de ordenacao. Ele responde as questoes e recebe feedback com nota, correcao das respostas erradas e recomendacoes de materiais para aprofundamento. O historico fica salvo para acompanhar evolucao na disciplina.

### Exemplo 2: Estudante de Ensino Fundamental

O usuário configura assunto "Frações", nível "Iniciante" e 5 questões. O sistema gera os exercicios. Após responder, recebe feedback das suas respostas com uma nota final e explicação didática sobre os erros/acertos, bem como a indicação de principais pontos a serem reforçados para promoverem sua evolução no entendimento do assunto.

### Exemplo 3: Acompanhamento de desempenho

Apos duas semanas de uso, o estudante acessa o dashboard e visualiza seu progresso: realizou 12 sessoes, media geral 7,2, acertou 45 de 60 questoes. O sistema identifica que seu pior desempenho foi em Matematica e melhor em Programacao. Ele exporta um relatorio PDF para mostrar ao professor.

### Exemplo 4: Revisao para prova final

O estudante de Ciencias da Computacao cria uma sessao com assunto Banco de Dados, nivel Medio e 10 questoes. Apos responder, o feedback aponta erros recorrentes em comandos SQL de juncao. Com base nisso, ele refaz os exercicios, melhora a nota de 6,0 para 8,5 e registra evolucao no historico.

---

## Limitações atuais do MVP

* Dependencia de API externa: O funcionamento do Jarvis depende exclusivamente da API do Groq. Em caso de instabilidade ou indisponibilidade do servico, a geracao de exercicios e feedback fica temporariamente comprometida.

* Sem autenticação de usuários: O MVP nao possui sistema de login. Todos os dados de historico sao armazenados localmente no navegador, o que significa que cada dispositivo ou navegador mantem seu proprio historico separado.

* Back-end local: O servidor Python com banco de dados SQLite precisa estar rodando localmente para salvar o historico. Em producao, sem o deploy do back-end, os dados nao persistem entre sessoes.

* Exportacao de PDF básica: O relatorio gerado em PDF possui formatacao simples, sem graficos ou elementos visuais mais elaborados.

* Sem banco de dados em produção: Atualmente o SQLite e utilizado apenas localmente. Não há uma solucao de banco de dados para multiplos usuários simultaneos em ambiente de produção. 

---

## Possiveis evoluções futuras

* Sistema de autenticação: Implementacao de login e cadastro de usuarios, permitindo que cada pessoa tenha seu proprio historico salvo de forma segura e acessivel de qualquer dispositivo.

* Dashboard com gráficos: Adição de gráficos visuais no dashboard para acompanhamento de desempenho, incluindo evolucao de notas ao longo do tempo, distribuicao de acertos por assunto e comparacao entre diferentes periodos de estudo.

* Acompanhamento de evolução personalizado: Sistema que identifica pontos fracos do estudante e sugere automaticamente exercicios focados nas areas que precisam de melhoria, criando um plano de estudos adaptativo.

* Banco de dados em nuvem: Migracao do SQLite local para um banco de dados PostgreSQL hospedado em nuvem, garantindo persistencia dos dados e suporte a multiplos usuarios simultaneos.

* Questões discursivas: Suporte a diferentes formatos de questao, incluindo respostas discursivas com correcao assistida por inteligencia artificial.

* Gamificação: Adicao de elementos como medalhas, rankings, niveis de progresso e desafios semanais para aumentar o engajamento do usuario.
