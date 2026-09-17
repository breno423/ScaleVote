# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# 🗳️ VoteFlow

> Uma plataforma de votação escalável baseada em arquitetura **Event-Driven** e **Serverless**, projetada para suportar grandes volumes de acessos e picos repentinos de votos.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Architecture](https://img.shields.io/badge/architecture-event--driven-blue)
![Cloud](https://img.shields.io/badge/cloud-AWS-orange)
![License](https://img.shields.io/badge/license-MIT-green)


## 📌 Sobre o Projeto

O **VoteFlow** é uma plataforma de votação online desenvolvida para simular cenários que exigem alta escalabilidade e disponibilidade, como:

* 📺 Reality Shows
* 🗳️ Eleições
* 📊 Enquetes
* 🎮 Votações de eventos
* 📱 Plataformas interativas

O principal objetivo do projeto é demonstrar como uma arquitetura **orientada a eventos** pode lidar com grandes volumes de requisições sem sobrecarregar diretamente o sistema de processamento.

Em vez de processar cada voto imediatamente durante a requisição HTTP, o VoteFlow utiliza uma arquitetura assíncrona baseada em filas e funções serverless.

Dessa forma, mesmo durante grandes picos de acesso, os votos podem continuar sendo recebidos e processados posteriormente.

---

# 🚀 Arquitetura

O VoteFlow utiliza uma arquitetura baseada em:

* Serverless
* Event-Driven Architecture
* Processamento Assíncrono
* Mensageria
* NoSQL
* Escalabilidade Automática

### Fluxo da aplicação

```text
                 ┌─────────────────┐
                 │    Frontend     │
                 │   Dashboard     │
                 └────────┬────────┘
                          │
                          │ HTTP Request
                          ▼
                 ┌─────────────────┐
                 │   API Gateway   │
                 └────────┬────────┘
                          │
                          │ Envia evento
                          ▼
                 ┌─────────────────┐
                 │       SQS       │
                 │      Queue      │
                 └────────┬────────┘
                          │
                          │ Processamento
                          ▼
                 ┌─────────────────┐
                 │   AWS Lambda    │
                 │ Vote Processor  │
                          │
                          │ Atualiza votos
                          ▼
                 ┌─────────────────┐
                 │    DynamoDB     │
                 │   Vote Counter  │
                 └────────┬────────┘
                          │
                          │ Resultados
                          ▼
                 ┌─────────────────┐
                 │    Dashboard    │
                 │   Quase Real    │
                 │      Time       │
                 └─────────────────┘
```

---

### 1️⃣ Usuário realiza um voto

O usuário acessa a plataforma e escolhe uma opção para votar.

Exemplo:

```json
{
  "votacaoId": "reality-2026",
  "opcaoId": "participante-01"
}
```

---

### 2️⃣ API recebe o voto


O objetivo da API é receber o voto rapidamente, evitando realizar operações pesadas durante a requisição.

---

### 3️⃣ Voto é enviado para a fila

Após receber o voto, o evento é enviado para uma fila do **Amazon SQS**.

A fila funciona como um buffer entre o recebimento e o processamento dos votos.

Isso permite absorver grandes picos de tráfego.

```text
10 votos
100 votos
10.000 votos

        ↓

      SQS Queue
```

---

### 4️⃣ Lambda processa os votos

Uma função **AWS Lambda** é acionada para consumir os eventos da fila.

A função é responsável por:

* Validar o voto
* Processar o evento
* Identificar a votação
* Identificar a opção escolhida
* Atualizar o contador
* Registrar informações necessárias

---

### 5️⃣ DynamoDB atualiza os resultados

Os votos processados são armazenados e contabilizados no **Amazon DynamoDB**.

Por utilizar um banco NoSQL gerenciado e escalável, o DynamoDB é adequado para cenários com grandes volumes de operações.

Exemplo de estrutura:

```text
Tabela: Votes

PK: votacaoId
SK: opcaoId

votos: 15420
```

Exemplo:

```json
{
  "votacaoId": "reality-2026",
  "opcaoId": "participante-01",
  "votos": 15420
}
```

---

# 🛠️ Tecnologias

## Frontend

* HTML
* CSS
* JavaScript
* GitHub Pages ou Vercel

Responsável por:

* Interface de votação
* Dashboard
* Exibição dos resultados
* Atualização dos dados

---

## API

### Amazon API Gateway

Responsável por receber as requisições HTTP da aplicação.

Exemplo:

```text
POST /vote
```

Payload:

```json
{
  "votacaoId": "reality-2026",
  "opcaoId": "participante-01"
}
```

---

## Mensageria

### Amazon SQS

Responsável por desacoplar o recebimento dos votos do processamento.

Benefícios:

* Absorção de picos de tráfego
* Processamento assíncrono
* Maior disponibilidade
* Desacoplamento entre serviços
* Maior tolerância a falhas

---

## Processamento

### AWS Lambda

Funções serverless responsáveis pelo processamento dos votos.

Benefícios:

* Escalabilidade automática
* Pagamento por uso
* Sem gerenciamento de servidores
* Integração com serviços AWS

---

## Banco de Dados

### Amazon DynamoDB

Banco NoSQL utilizado para armazenar os resultados das votações.

Benefícios:

* Alta performance
* Escalabilidade
* Baixa latência
* Serviço totalmente gerenciado
* Integração com AWS Lambda

---

# 📂 Estrutura do Projeto

```text
voteflow/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── vote-api/
│   └── vote-processor/
│
├── infrastructure/
│   ├── cloudformation/
│   └── terraform/
│
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   └── cost-report.md
│
├── README.md
└── LICENSE
```

---

# 🔄 Arquitetura Event-Driven

O VoteFlow foi desenvolvido seguindo o conceito de **Event-Driven Architecture**.

Um voto representa um evento.

```text
User Vote

    ↓

Vote Event

    ↓

Message Queue

    ↓

Event Consumer

    ↓

Vote Processing

    ↓

Database Update
```

O sistema não precisa esperar o processamento completo do voto para responder ao usuário.

Isso reduz o acoplamento entre os serviços e melhora a capacidade do sistema de lidar com grandes volumes de requisições.

---

# 📈 Planejamento de Escalonamento

O VoteFlow utilizará serviços serverless, permitindo ajustar a capacidade conforme o volume de votos sem manter servidores ativos continuamente.

## Escalonamento técnico

A fila **Amazon SQS** funcionará como mecanismo de desacoplamento. Os votos recebidos pelo API Gateway serão armazenados na fila e processados por execuções concorrentes da **AWS Lambda**.

O aumento da demanda será controlado por métricas como:

* **Quantidade de mensagens na fila:** indica o acúmulo de votos aguardando processamento;
* **Idade da mensagem mais antiga:** identifica atrasos no processamento;
* **Concorrência e duração da Lambda:** mostram se a função precisa de mais execuções simultâneas ou memória;
* **Erros e throttling:** indicam limites de capacidade ou falhas;
* **Consumo de escrita do DynamoDB:** permite identificar sobrecarga nos contadores.

Inicialmente, serão utilizados **contadores atômicos no DynamoDB**. Em cenários de grande volume, poderão ser adotados **contadores distribuídos**, dividindo as escritas entre diferentes partições para evitar o problema de *hot partition*.

O escalonamento será ajustado da seguinte forma:

* Se o backlog ou a idade das mensagens aumentar, a concorrência da Lambda será ampliada;
* Se a fila permanecer vazia, a concorrência poderá ser reduzida;
* Se a duração da função estiver alta, será avaliado o aumento de memória;
* Se ocorrerem erros de limite no DynamoDB, as escritas serão redistribuídas ou a capacidade será ajustada.

## Custos e controle financeiro

O custo será acompanhado considerando:

* Requisições do **API Gateway**;
* Operações de envio e leitura do **SQS**;
* Execuções e tempo de processamento da **Lambda**;
* Leituras e escritas do **DynamoDB**;
* Logs e métricas do **CloudWatch**.

Como os serviços são cobrados principalmente por uso, o custo tende a acompanhar a quantidade de votos processados. Entretanto, testes de carga, excesso de logs e configurações de alta concorrência podem aumentar os gastos.

Será utilizado um orçamento de referência para monitorar o projeto. O custo por voto será estimado pela fórmula:

$$
\text{Custo por voto} =
\frac{\text{Custo do API Gateway + SQS + Lambda + DynamoDB + CloudWatch}}
{\text{Quantidade de votos processados}}
$$

Também serão configurados alertas de orçamento para identificar aumentos inesperados e interromper ou reduzir testes quando necessário.

## Validação

Serão realizados testes com volume normal, picos de acesso e situações de estresse. Durante os testes, serão analisados o tempo de processamento, o crescimento da fila, a taxa de erros, a recuperação após o pico e o custo por voto.

---

# 📊 Dashboard

O dashboard será responsável por exibir os resultados da votação.

Exemplo:

```text
🔥 Reality Vote

Participante A

███████████████████

52%


Participante B

████████████████

38%


Participante C

████

10%
```

Os resultados serão atualizados em tempo real ou quase em tempo real.

---

# 🔌 API

## Registrar voto

### Endpoint

```http
POST /vote
```

### Request

```json
{
  "votacaoId": "reality-2026",
  "opcaoId": "participante-01"
}
```

### Response

```json
{
  "message": "Vote received successfully"
}
```

---

## Buscar resultados

### Endpoint

```http
GET /results/{votacaoId}
```

### Response

```json
{
  "votacaoId": "reality-2026",
  "resultados": [
    {
      "opcaoId": "participante-01",
      "votos": 15420
    },
    {
      "opcaoId": "participante-02",
      "votos": 12350
    }
  ]
}
```

---

# ☁️ AWS Services

| Serviço               | Função               |
| --------------------- | -------------------- |
| API Gateway           | Receber votos        |
| SQS                   | Fila de eventos      |
| Lambda                | Processar votos      |
| DynamoDB              | Armazenar resultados |
| CloudWatch            | Monitoramento        |
| IAM                   | Permissões           |
| GitHub Pages / Vercel | Frontend             |

---

# 💰 Estratégia de Custos

Este projeto foi planejado para ser desenvolvido utilizando os limites gratuitos dos serviços em nuvem sempre que possível.

O objetivo é demonstrar uma arquitetura escalável sem a necessidade de manter servidores ativos.

Serviços utilizados:

```text
AWS Lambda
↓

1 milhão de solicitações gratuitas/mês


Amazon SQS
↓

1 milhão de solicitações gratuitas/mês


Amazon API Gateway
↓

Utilização dentro das quotas disponíveis


Amazon DynamoDB
↓

Utilização dentro das quotas gratuitas disponíveis
```

> ⚠️ Os limites e condições dos planos gratuitos podem variar conforme região, tipo de conta e mudanças realizadas pelos provedores cloud. Antes de utilizar o projeto em produção, é importante configurar alertas e acompanhar os custos.

---

# 📉 Monitoramento

O projeto poderá utilizar o **Amazon CloudWatch** para monitorar:

* Quantidade de requisições
* Execuções da Lambda
* Erros
* Tempo de execução
* Mensagens na fila
* Eventos processados
* Falhas no processamento

Exemplo:

```text
API Requests
     │
     ▼
CloudWatch

Lambda Invocations
     │
     ▼
CloudWatch

SQS Messages
     │
     ▼
CloudWatch
```

---

# 🔐 Segurança

Algumas práticas previstas para o projeto:

* Validação dos dados recebidos
* Controle de permissões utilizando IAM
* Limitação de requisições
* Validação do voto
* Logs de eventos
* Tratamento de falhas
* Dead Letter Queue para mensagens que falharem no processamento

Arquitetura futura:

```text
SQS

 │

 ├── Success → Process Vote

 │

 └── Error → Dead Letter Queue
```

---

# 🚧 Roadmap

## MVP

* [ ] Criar frontend de votação
* [ ] Criar dashboard
* [ ] Configurar API Gateway
* [ ] Criar endpoint de votação
* [ ] Configurar SQS
* [ ] Criar Lambda de processamento
* [ ] Criar tabela DynamoDB
* [ ] Atualizar contador de votos

---

## Próximas funcionalidades

* [ ] Dashboard em tempo real
* [ ] WebSockets
* [ ] Autenticação de usuários
* [ ] Limite de votos
* [ ] Rate Limiting
* [ ] Dead Letter Queue
* [ ] CloudWatch Dashboard
* [ ] Teste de carga
* [ ] CI/CD com GitHub Actions
* [ ] Infrastructure as Code
* [ ] Terraform
* [ ] CloudFormation

---

# 🧪 Testes de Carga

Uma das etapas do projeto será testar o comportamento da arquitetura durante picos de tráfego.

Exemplo:

```text
Usuários simulados

      ↓

   10 usuários

      ↓

   100 usuários

      ↓

  1.000 usuários

      ↓

  10.000 usuários
```

O objetivo será analisar:

* Tempo de resposta
* Quantidade de votos processados
* Capacidade da fila
* Escalabilidade da Lambda
* Erros
* Custos

---

# 🎯 Objetivos de Aprendizado

Este projeto foi desenvolvido com o objetivo de aprofundar conhecimentos em:

* Cloud Computing
* AWS
* Serverless
* Event-Driven Architecture
* Mensageria
* Amazon SQS
* AWS Lambda
* Amazon DynamoDB
* API Gateway
* NoSQL
* Escalabilidade
* Alta disponibilidade
* Monitoramento
* CloudWatch
* CI/CD
* DevOps

---

# 👨‍💻 Autor

Desenvolvido por **Breno Marques**

Projeto criado como parte dos estudos em:

* Cloud Computing
* Arquitetura Serverless
* DevOps
* Sistemas Distribuídos
* Arquitetura Orientada a Eventos

---

# ⭐ Conclusão

O **VoteFlow** demonstra como uma arquitetura moderna baseada em eventos pode ser utilizada para construir sistemas capazes de lidar com grandes volumes de tráfego.

A combinação de:

```text
API Gateway
      +
SQS
      +
Lambda
      +
DynamoDB
```

permite criar uma arquitetura desacoplada, escalável e orientada a eventos.

O projeto simula um cenário real de votação em larga escala, como reality shows, eleições e enquetes, permitindo explorar conceitos importantes de arquitetura cloud e sistemas distribuídos.

---

⭐ Se este projeto foi útil para você, considere deixar uma estrela no repositório!
