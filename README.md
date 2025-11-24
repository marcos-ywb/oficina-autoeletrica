# Oficina Autoelétrica

Sistema web para gerenciar clientes e serviços de uma oficina autoelétrica, desenvolvido com **Next.js**, **React** e **Tailwind CSS**.  
Permite registrar clientes, veículos, serviços prestados e gerar históricos e orçamentos.

---

## Índice

- [Funcionalidades](#funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Instalação](#instalação)  
- [Como Usar](#como-usar)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Contribuição](#contribuição)  
- [Licença](#licença)  
- [Contato](#contato)  

---

## Funcionalidades

- Cadastro de clientes e veículos  
- Registro de serviços prestados  
- Histórico de serviços por cliente  
- Dashboard simples para gerenciar dados  
- Interface responsiva para desktop e mobile  
- Notificações via `react-hot-toast`  

---

## Tecnologias

- **Next.js 16** — Framework React com SSR e geração de páginas estáticas  
- **React 19** — Biblioteca para criação de interfaces  
- **Tailwind CSS 4** — Estilização rápida e responsiva  
- **Flowbite / Flowbite-React** — Componentes UI pré-construídos e alguns comportamentos da interface 
- **IMask / react-imask** — Máscaras de input  
- **bcryptjs** — Hash de senhas  
- **jsonwebtoken** — Autenticação com tokens JWT  
- **MySQL2** — Conexão e manipulação de banco MySQL  
- **PostCSS** — Processamento de CSS moderno  

---

## Instalação

1. Clone o repositório:  
```bash
git clone https://github.com/marcos-ywb/oficina-autoeletrica.git
```

2. Entre na pasta do projeto:  
```bash
cd oficina-autoeletrica
```

3. Instale as dependências:  
```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env.local` para variáveis de ambiente (exemplo):  
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=oficina_autoeletrica
JWT_SECRET=sua_chave_secreta
```

5. Inicie o servidor de desenvolvimento:  
```bash
npm run dev
# ou
yarn dev
```

6. Abra no navegador: `http://localhost:3000`

---

## Como Usar

- **Cadastro de Clientes:** acesse a página de clientes e clique em "Adicionar".  
- **Cadastro de Veículos:** associe veículos a clientes.  
- **Registro de Serviços:** registre serviços com data, descrição e valor.  
- **Histórico de Serviços:** visualize todos os serviços realizados por cada cliente.  
- **Notificações:** ações bem-sucedidas ou erros aparecem via `react-hot-toast`.

---

## Estrutura do Projeto

```
oficina-autoeletrica/
│
├── public/              
│   └── Arquivos públicos como imagens, favicon, ícones e outros assets estáticos.  
│      Tudo aqui é servido diretamente pelo Next.js sem precisar de importação.  
│
├── src/                 
│   ├── app/              
│   │    └── api/           
│   │         └── Contém as rotas API do Next.js (endpoints) que lidam com requisições HTTP.
│   │         └── Ex: cadastro de clientes, autenticação, CRUD de veículos e serviços.
│   │
│   ├── components/       
│   │    └── Componentes React reutilizáveis (botões, formulários, tabelas, layouts, etc).  
│   │
│   ├── lib/           
│   │    └── Bibliotecas / funções de conexão com banco de dados ou configuração global.
│   │       Ex: conexão MySQL (`mysql2`), instâncias de JWT, helpers de autenticação.
│   │
│   ├── utils/            
│   │    └── Funções utilitárias genéricas que podem ser usadas em várias partes do projeto.  
│   │       Ex: formatação de telefone, máscara de inputs, validações, helpers de data.
│   │
│   └── middleware.js
│        └── Middleware global do Next.js, usado para interceptar requisições e rotas.
│           Ex: autenticação, autorização, redirecionamentos ou logging.  
│
├── .env.local            
│   └── Variáveis de ambiente (ex: DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET).  
│
├── package.json  
│   └── Lista de dependências, scripts e metadados do projeto Node.js / Next.js.  
│
├── next.config.js  
│   └── Configurações específicas do Next.js (ex: rewrites, imagens, experimental features).  
│
└── README.md
     └── Documentação do projeto (instalação, uso, tecnologias, equipe, etc).  
```

---

## Contribuição

Contribuições são bem-vindas! Para colaborar:  

1. Fork este repositório  
2. Crie uma branch (`git checkout -b minha-feature`)  
3. Faça suas alterações e commit (`git commit -m "Minha feature"`)  
4. Envie para sua branch (`git push origin minha-feature`)  
5. Abra um Pull Request  

---

## Licença

Este projeto está licenciado sob a **MIT License**.  

---

## Contato e Equipe

### Colaboradores
- **Marcos Mello** ([marcos-ywb](https://github.com/marcos-ywb)) — Responsável pelo desenvolvimento da aplicação, arquitetura do projeto, integração com banco de dados, funcionalidades principais e manutenção do código.
- **João Vitor Gonçalves** ([joaovitgo](https://github.com/joaovitgo)) — Design do front-end, criação da interface do usuário (UI) e experiência do usuário (UX).  
- **Pedro Vinicius** ([Dark188](https://github.com/Dark188)) — Design do front-end, desenvolvimento de UI e otimização da experiência do usuário (UX).  
- **Jéferson Alves** ([jEFF-AS](https://github.com/jEFF-AS)) — Gestão do projeto e desenvolvimento de consultas SQL e estrutura de banco de dados.  
- **Leicimara Ribeiro** ([leicimara](https://github.com/leicimara)) — Testes de funcionalidades, controle de qualidade e verificação da aplicação.  

### Contato Geral
- **E-mail principal:** marcosmello.ywb@gmail.com
- **GitHub do projeto:** [https://github.com/marcos-ywb/oficina-autoeletrica](https://github.com/marcos-ywb/oficina-autoeletrica)