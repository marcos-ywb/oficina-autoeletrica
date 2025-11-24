DROP SCHEMA IF EXISTS oficina_autoeletrica;
CREATE SCHEMA IF NOT EXISTS oficina_autoeletrica;
USE oficina_autoeletrica;

CREATE TABLE funcionarios (
    funcionario_id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    telefone CHAR(11) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('Administrador', 'Funcionario') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(funcionario_id)
);

CREATE TABLE clientes (
    cliente_id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    telefone CHAR(11) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(cliente_id)
);

CREATE TABLE enderecos (
    endereco_id INT NOT NULL AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(endereco_id),
    FOREIGN KEY(cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE veiculos (
    veiculo_id INT NOT NULL AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano YEAR NOT NULL,
    placa CHAR(7) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(veiculo_id),
    FOREIGN KEY(cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE servicos (
    servico_id INT NOT NULL AUTO_INCREMENT,
    veiculo_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    descricao TEXT NOT NULL,
    orcamento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    custo_final DECIMAL(10,2) DEFAULT 0.00,
    data_entrada DATE NOT NULL,
    data_conclusao DATE,
    status ENUM('Pendente', 'Em andamento', 'Aguardando peças', 'Concluido', 'Cancelado') NOT NULL DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(servico_id),
    FOREIGN KEY(veiculo_id) REFERENCES veiculos(veiculo_id),
    FOREIGN KEY(funcionario_id) REFERENCES funcionarios(funcionario_id)
);

CREATE TABLE pagamentos (
    pagamento_id INT NOT NULL AUTO_INCREMENT,
    servico_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    forma_pagamento ENUM('Dinheiro', 'Credito', 'Debito', 'Pix') NOT NULL,
    data_pagamento DATE NOT NULL,
    status_pagamento ENUM('Pendente', 'Parcial', 'Pago') DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(pagamento_id),
    FOREIGN KEY(servico_id) REFERENCES servicos(servico_id)
);