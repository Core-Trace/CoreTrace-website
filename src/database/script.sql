DROP DATABASE IF EXISTS coretrace;
CREATE DATABASE coretrace;
USE coretrace;

DROP USER IF EXISTS 'user_admin'@'localhost';
CREATE USER 'user_admin'@'localhost' IDENTIFIED BY 'SPTech#2026';
GRANT ALL PRIVILEGES ON coretrace.* TO 'user_admin'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    dt_registro DATE
);

CREATE TABLE setor (
    id_setor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    fk_empresa INT NOT NULL,

    FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id_empresa)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    fk_empresa INT NOT NULL,

    FOREIGN KEY (fk_empresa)
        REFERENCES empresa(id_empresa)
);

CREATE TABLE servidor (
    id_servidor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    status VARCHAR(45),
    fk_setor INT NOT NULL,

    FOREIGN KEY (fk_setor)
        REFERENCES setor(id_setor)
);

CREATE TABLE maquina (
    id_maquina INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    fk_servidor INT NOT NULL,

    FOREIGN KEY (fk_servidor)
        REFERENCES servidor(id_servidor)
);

CREATE TABLE componente (
    id_componente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    comando VARCHAR(100) NOT NULL UNIQUE,
    unidade VARCHAR(45)
);

CREATE TABLE acesso_setor (
    fk_setor INT NOT NULL,
    fk_usuario INT NOT NULL,

    PRIMARY KEY (
        fk_setor,
        fk_usuario
    ),

    FOREIGN KEY (fk_setor)
        REFERENCES setor(id_setor),

    FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE acesso_maquina (
    fk_usuario INT NOT NULL,
    fk_maquina INT NOT NULL,

    PRIMARY KEY (
        fk_usuario,
        fk_maquina
    ),

    FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario),

    FOREIGN KEY (fk_maquina)
        REFERENCES maquina(id_maquina)
);

CREATE TABLE componente_maquina (
    fk_componente INT NOT NULL,
    fk_maquina INT NOT NULL,
    limite_atencao DECIMAL(10,2),
    limite_critico DECIMAL(10,2),

    PRIMARY KEY (
        fk_componente,
        fk_maquina
    ),

    FOREIGN KEY (fk_componente)
        REFERENCES componente(id_componente),

    FOREIGN KEY (fk_maquina)
        REFERENCES maquina(id_maquina)
);

INSERT INTO empresa
(razao_social, cnpj, dt_registro)
VALUES
('Empresa Principal', '12345678000101', '2026-01-10'),
('Tech Solutions LTDA', '98765432000199', '2026-02-15'),
('Data Center Brasil', '45678912000155', '2026-03-20');

INSERT INTO setor
(nome, fk_empresa)
VALUES
('Infraestrutura', 1),
('Desenvolvimento', 1),
('Banco de Dados', 1),
('Infraestrutura', 2),
('Data Center', 3);

INSERT INTO usuario
(nome, email, senha, cargo, fk_empresa)
VALUES
(
    'Eduardo',
    'eduardo@empresa.com',
    'senha123',
    'Engenheiro de Infraestrutura',
    1
),
(
    'Marcelo',
    'marcelo@empresa.com',
    'senha456',
    'Administrador de Sistemas',
    1
),
(
    'Amanda',
    'amanda@empresa.com',
    'senha789',
    'Analista de Observabilidade',
    1
);

INSERT INTO servidor
(nome, status, fk_setor)
VALUES
('Servidor Producao', 'ATIVO', 1),
('Servidor Banco', 'ATIVO', 3),
('Servidor Homologacao', 'ATIVO', 2),
('Servidor Tech', 'ATIVO', 4),
('Servidor Data Center', 'MANUTENCAO', 5);

INSERT INTO maquina
(nome, fk_servidor)
VALUES
('maquina-prod-01', 1),
('maquina-prod-02', 1),
('maquina-banco-01', 2),
('maquina-homolog-01', 3),
('maquina-tech-01', 4),
('maquina-datacenter-01', 5);

INSERT INTO acesso_setor
(fk_setor, fk_usuario)
VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(3, 2),
(1, 3),
(2, 3),
(3, 3);

INSERT INTO acesso_maquina
(fk_usuario, fk_maquina)
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(3, 4);

INSERT INTO componente
(nome, unidade, comando)
VALUES
('Uso da CPU', '%', 'CPU_PERCENT'),
('CPU User', '%', 'CPU_USER_PERCENT'),
('CPU Nice', '%', 'CPU_NICE_PERCENT'),
('CPU System', '%', 'CPU_SYSTEM_PERCENT'),
('CPU Idle', '%', 'CPU_IDLE_PERCENT'),
('CPU IOWait', '%', 'CPU_IOWAIT_PERCENT'),
('CPU IRQ', '%', 'CPU_IRQ_PERCENT'),
('CPU Soft IRQ', '%', 'CPU_SOFTIRQ_PERCENT'),
('CPU Steal', '%', 'CPU_STEAL_PERCENT'),
('CPU Guest', '%', 'CPU_GUEST_PERCENT'),
('CPU Guest Nice', '%', 'CPU_GUEST_NICE_PERCENT'),

('Frequencia atual da CPU', 'MHz', 'CPU_FREQ_ATUAL'),
('Frequencia minima da CPU', 'MHz', 'CPU_FREQ_MIN'),
('Frequencia maxima da CPU', 'MHz', 'CPU_FREQ_MAX'),

('Quantidade de CPUs logicas', 'nucleos', 'CPU_COUNT_LOGICA'),
('Quantidade de CPUs fisicas', 'nucleos', 'CPU_COUNT_FISICA'),

('Trocas de contexto', 'eventos', 'CPU_CTX_SWITCHES'),
('Interrupcoes', 'eventos', 'CPU_INTERRUPTS'),
('Interrupcoes de software', 'eventos', 'CPU_SOFT_INTERRUPTS'),
('Chamadas de sistema', 'eventos', 'CPU_SYSCALLS'),

('Load Average 1 minuto', NULL, 'LOAD_AVG_1'),
('Load Average 5 minutos', NULL, 'LOAD_AVG_5'),
('Load Average 15 minutos', NULL, 'LOAD_AVG_15'),

('RAM Total', 'bytes', 'RAM_TOTAL'),
('RAM Disponivel', 'bytes', 'RAM_AVAILABLE'),
('Uso da RAM', '%', 'RAM_PERCENT'),
('RAM Utilizada', 'bytes', 'RAM_USED'),
('RAM Livre', 'bytes', 'RAM_FREE'),
('RAM Ativa', 'bytes', 'RAM_ACTIVE'),
('RAM Inativa', 'bytes', 'RAM_INACTIVE'),
('Buffers da RAM', 'bytes', 'RAM_BUFFERS'),
('Cache da RAM', 'bytes', 'RAM_CACHED'),
('RAM Compartilhada', 'bytes', 'RAM_SHARED'),
('Slab da RAM', 'bytes', 'RAM_SLAB'),

('SWAP Total', 'bytes', 'SWAP_TOTAL'),
('SWAP Utilizada', 'bytes', 'SWAP_USED'),
('SWAP Livre', 'bytes', 'SWAP_FREE'),
('Uso da SWAP', '%', 'SWAP_PERCENT'),
('SWAP IN', 'bytes', 'SWAP_IN'),
('SWAP OUT', 'bytes', 'SWAP_OUT'),

('Disco Total', 'bytes', 'DISCO_TOTAL'),
('Disco Utilizado', 'bytes', 'DISCO_USED'),
('Disco Livre', 'bytes', 'DISCO_FREE'),
('Uso do Disco', '%', 'DISCO_PERCENT'),

('Quantidade de Leituras', 'operacoes', 'DISCO_READ_COUNT'),
('Quantidade de Escritas', 'operacoes', 'DISCO_WRITE_COUNT'),
('Bytes Lidos', 'bytes', 'DISCO_READ_BYTES'),
('Bytes Escritos', 'bytes', 'DISCO_WRITE_BYTES'),
('Tempo de Leitura', 'ms', 'DISCO_READ_TIME'),
('Tempo de Escrita', 'ms', 'DISCO_WRITE_TIME'),
('Leituras Agrupadas', 'operacoes', 'DISCO_READ_MERGED_COUNT'),
('Escritas Agrupadas', 'operacoes', 'DISCO_WRITE_MERGED_COUNT'),
('Tempo Ocupado do Disco', 'ms', 'DISCO_BUSY_TIME');

INSERT INTO componente_maquina
(fk_componente, fk_maquina, limite_atencao, limite_critico)
VALUES
(1, 1, 70, 90),
(2, 1, NULL, NULL),
(4, 1, NULL, NULL),
(5, 1, NULL, NULL),
(6, 1, NULL, NULL),
(12, 1, NULL, NULL),
(13, 1, NULL, NULL),
(14, 1, NULL, NULL),
(15, 1, NULL, NULL),
(16, 1, NULL, NULL),
(17, 1, NULL, NULL),
(18, 1, NULL, NULL),
(19, 1, NULL, NULL),
(20, 1, NULL, NULL),
(21, 1, NULL, NULL),
(22, 1, NULL, NULL),
(23, 1, NULL, NULL),
(24, 1, NULL, NULL),
(25, 1, NULL, NULL),
(26, 1, 80, 95),
(27, 1, NULL, NULL),
(28, 1, NULL, NULL),
(29, 1, NULL, NULL),
(30, 1, NULL, NULL),
(31, 1, NULL, NULL),
(32, 1, NULL, NULL),
(33, 1, NULL, NULL),
(34, 1, NULL, NULL),
(35, 1, NULL, NULL),
(36, 1, NULL, NULL),
(37, 1, NULL, NULL),
(38, 1, 70, 90),
(39, 1, NULL, NULL),
(40, 1, NULL, NULL),
(41, 1, NULL, NULL),
(42, 1, NULL, NULL),
(43, 1, NULL, NULL),
(44, 1, 80, 95),
(45, 1, NULL, NULL),
(46, 1, NULL, NULL),
(47, 1, NULL, NULL),
(48, 1, NULL, NULL),
(49, 1, NULL, NULL),
(50, 1, NULL, NULL),
(51, 1, NULL, NULL),
(52, 1, NULL, NULL),
(53, 1, NULL, NULL);

INSERT INTO componente_maquina
(fk_componente, fk_maquina, limite_atencao, limite_critico)
VALUES
(1, 2, 75, 90),
(21, 2, NULL, NULL),
(22, 2, NULL, NULL),
(23, 2, NULL, NULL),
(24, 2, NULL, NULL),
(25, 2, NULL, NULL),
(26, 2, 80, 95),
(27, 2, NULL, NULL),
(35, 2, NULL, NULL),
(36, 2, NULL, NULL),
(37, 2, NULL, NULL),
(38, 2, 70, 90),
(41, 2, NULL, NULL),
(42, 2, NULL, NULL),
(43, 2, NULL, NULL),
(44, 2, 80, 95),
(47, 2, NULL, NULL),
(48, 2, NULL, NULL);

INSERT INTO componente_maquina
(fk_componente, fk_maquina, limite_atencao, limite_critico)
VALUES
(1, 3, 70, 90),
(12, 3, NULL, NULL),
(21, 3, NULL, NULL),
(22, 3, NULL, NULL),
(23, 3, NULL, NULL),
(24, 3, NULL, NULL),
(25, 3, NULL, NULL),
(26, 3, 80, 95),
(27, 3, NULL, NULL),
(41, 3, NULL, NULL),
(42, 3, NULL, NULL),
(43, 3, NULL, NULL),
(44, 3, 80, 95),
(45, 3, NULL, NULL),
(46, 3, NULL, NULL),
(47, 3, NULL, NULL),
(48, 3, NULL, NULL);

SELECT
    c.id_componente,
    c.nome,
    c.unidade,
    c.comando,
    cm.limite_atencao,
    cm.limite_critico
FROM maquina m
JOIN componente_maquina cm
    ON cm.fk_maquina = m.id_maquina
JOIN componente c
    ON c.id_componente = cm.fk_componente
WHERE m.id_maquina = 1;