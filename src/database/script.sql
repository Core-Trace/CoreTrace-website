CREATE DATABASE coretrace;

USE coretrace;

CREATE TABLE papeis (
    id_papeis INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo ENUM('GESTOR', 'FUNCIONARIO') NOT NULL
);

-- Empresas (precisa existir antes de usuarios e servidores)
CREATE TABLE empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    cnpj CHAR(14),
    codigo CHAR(16) NOT NULL UNIQUE
);

-- Setores da empresa (Financeiro, TI, Marketing...)
CREATE TABLE setores (
    id_setores INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

ALTER TABLE usuarios ADD passkey CHAR(16) NOT NULL;

select * from usuarios;

-- Usuários do sistema (quem faz login)
CREATE TABLE usuarios (
    id_usuarios INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    passkey CHAR(16) NOT NULL,
    papel INT NOT NULL,
    cadastrado INT,
    empresa INT NOT NULL,
    CONSTRAINT fk_usuarios_papeis FOREIGN KEY (papel) REFERENCES papeis (id_papeis),
    CONSTRAINT fk_usuarios_cadastrado_por FOREIGN KEY (cadastrado) REFERENCES usuarios (id_usuarios),
    CONSTRAINT fk_usuarios_empresa FOREIGN KEY (empresa) REFERENCES empresa (id_empresa)
);

-- Servidores monitorados, cada um pertence a um setor
CREATE TABLE servidores (
    id_servidor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    setor INT NOT NULL,
    empresa INT NOT NULL,
    CONSTRAINT fk_servidores_setores FOREIGN KEY (setor) REFERENCES setores (id_setores),
    CONSTRAINT fk_servidor_empresa FOREIGN KEY (empresa) REFERENCES empresa (id_empresa)
);

-- Quem pode ver qual servidor
CREATE TABLE acessos_servidor (
    usuario INT NOT NULL,
    servidor INT NOT NULL,
    concedido_por INT NOT NULL,
    PRIMARY KEY (usuario, servidor),
    CONSTRAINT fk_acessos_usuarios FOREIGN KEY (usuario) REFERENCES usuarios (id_usuarios),
    CONSTRAINT fk_acessos_servidores FOREIGN KEY (servidor) REFERENCES servidores (id_servidor),
    CONSTRAINT fk_acessos_concedido_por FOREIGN KEY (concedido_por) REFERENCES usuarios (id_usuarios)
);

CREATE TABLE maquina (
    id_maquina INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    codigo CHAR(16) NOT NULL UNIQUE,
    dt_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_fim DATETIME,
    servidor INT NOT NULL,
    CONSTRAINT fk_maquina_servidor FOREIGN KEY (servidor) REFERENCES servidores (id_servidor)
);

CREATE TABLE componentes (
    id_componentes INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45),
    maquina INT NOT NULL,
    CONSTRAINT fk_maquina_componentes FOREIGN KEY (maquina) REFERENCES maquina (id_maquina)
);

CREATE TABLE parametros (
    id_parametro INT AUTO_INCREMENT PRIMARY KEY,
    nome_parametro VARCHAR(45),
    valor_paramentro DOUBLE
);

CREATE TABLE parametros_componentes (
    parametros INT NOT NULL,
    componente INT NOT NULL,
    PRIMARY KEY (parametros, componente),
    CONSTRAINT fk_parametros FOREIGN KEY (parametros) REFERENCES parametros (id_parametro),
    CONSTRAINT fk_componente FOREIGN KEY (componente) REFERENCES componentes (id_componentes)
);

-- Inserts

INSERT INTO
    papeis (nome, tipo)
VALUES (
        'Gestor de Infraestrutura',
        'GESTOR'
    ),
    (
        'Analista de Dados',
        'FUNCIONARIO'
    );

-- Precisa existir uma empresa antes do usuário, já que empresa agora é NOT NULL
INSERT INTO
    empresa (nome, cnpj, codigo)
VALUES (
        'Empresa Exemplo',
        '12345678000199',
        'EMP0000000000001'
    );

INSERT INTO
    usuarios (
        nome,
        email,
        senha,
        papel,
        cadastrado,
        empresa
    )
VALUES (
        'Marina Gestora',
        'marina@empresa.com',
        'senha',
        1,
        NULL,
        1
    );

INSERT INTO
    setores (nome)
VALUES ('Financeiro'),
    ('TI'),
    ('Marketing'),
    ('Logística');

SELECT * FROM usuarios;

SELECT * FROM empresa;
use coretrace;
DROP VIEW vw_info_user;

CREATE VIEW vw_info_user AS
SELECT
            usuarios.id_usuarios AS id,
            usuarios.nome,
            usuarios.senha,
            usuarios.email,
            usuarios.passkey,
            usuarios.empresa AS id_empresa,
            papeis.id_papeis AS id_papel,
            papeis.nome AS nome_papel,
            papeis.tipo AS tipo_papel
        FROM usuarios
        INNER JOIN papeis ON papeis.id_papeis = usuarios.papel;
-- LOGIN PARA TESTE
-- Execute após criar todas as tabelas e os dados iniciais.
--
-- INSERT INTO usuario
-- (nome, email, senha, cpf, token_acesso, telefone, fkEmpresa, fkNivel_acesso, status)
-- VALUES
-- ('Administrador CoreTrace', 'admin@coretrace.com', '123456', '12345678900', NULL, '11999999999', 1, 1, 'ATIVO');
--
-- INSERT INTO usuario_perfil_servidor
-- (idUsuario, fkPerfil_servidor)
-- VALUES
-- (1, 1);


-- TOKENS PARA TESTE
-- Empresa: 123
-- Servidor 1: 456
-- Servidor 2: 789


DROP DATABASE IF EXISTS coretrace;

CREATE DATABASE coretrace;

USE coretrace;


CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(45) NOT NULL,
    cnpj VARCHAR(45) NOT NULL UNIQUE,
    dt_registro DATE,
    token_instalacao VARCHAR(255) UNIQUE
);


CREATE TABLE endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10),
    cidade VARCHAR(45),
    estado VARCHAR(45),
    logradouro VARCHAR(100),
    fkEmpresa INT NOT NULL,

    FOREIGN KEY (fkEmpresa)
        REFERENCES empresa(id)
);


CREATE TABLE nivel_acesso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    descricao VARCHAR(255)
);


CREATE TABLE permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    descricao VARCHAR(45)
);


CREATE TABLE nivel_acesso_permissoes (
    fkNivel_acesso INT NOT NULL,
    fkPermissoes INT NOT NULL,

    FOREIGN KEY (fkNivel_acesso)
        REFERENCES nivel_acesso(id),

    FOREIGN KEY (fkPermissoes)
        REFERENCES permissoes(id)
);


CREATE TABLE usuario (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha VARCHAR(45),
    cpf CHAR(11) UNIQUE,
    token_acesso VARCHAR(255),
    telefone VARCHAR(45),
    fkEmpresa INT NOT NULL,
    fkNivel_acesso INT NOT NULL,
    status VARCHAR(45),

    FOREIGN KEY (fkEmpresa)
        REFERENCES empresa(id),

    FOREIGN KEY (fkNivel_acesso)
        REFERENCES nivel_acesso(id)
);


CREATE TABLE perfil_servidor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    fkEmpresa INT NOT NULL,

    FOREIGN KEY (fkEmpresa)
        REFERENCES empresa(id)
);


CREATE TABLE usuario_perfil_servidor (
    idUsuario INT NOT NULL,
    fkPerfil_servidor INT NOT NULL,

    FOREIGN KEY (idUsuario)
        REFERENCES usuario(idusuario),

    FOREIGN KEY (fkPerfil_servidor)
        REFERENCES perfil_servidor(id)
);


CREATE TABLE servidores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    status VARCHAR(45),
    token_servidor VARCHAR(255) UNIQUE,
    fkPerfil_servidor INT NOT NULL,

    FOREIGN KEY (fkPerfil_servidor)
        REFERENCES perfil_servidor(id)
);


CREATE TABLE container (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    status VARCHAR(45),
    fkServidor INT NOT NULL,

    FOREIGN KEY (fkServidor)
        REFERENCES servidores(id)
);


CREATE TABLE componentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nomeColuna VARCHAR(100) NOT NULL UNIQUE,
    funcaoPsutil VARCHAR(100) NOT NULL,
    argumentoNome VARCHAR(100),
    argumentoValor VARCHAR(100),
    atributoRetorno VARCHAR(100),
    indiceRetorno INT,
    unidade VARCHAR(45)
);


CREATE TABLE componentes_perfil (
    fkComponentes INT NOT NULL,
    fkPerfil INT NOT NULL,
    limite_atencao DECIMAL(10,2),
    limite_critico DECIMAL(10,2),

    FOREIGN KEY (fkComponentes)
        REFERENCES componentes(id),

    FOREIGN KEY (fkPerfil)
        REFERENCES perfil_servidor(id)
);


INSERT INTO empresa
(razao_social, cnpj, dt_registro, token_instalacao)
VALUES
('CoreTrace Empresa Teste', '12345678000199', CURDATE(), '123');


INSERT INTO endereco
(numero, cidade, estado, logradouro, fkEmpresa)
VALUES
('100', 'São Paulo', 'SP', 'Avenida Paulista', 1);


INSERT INTO nivel_acesso
(nome, descricao)
VALUES
('Administrador', 'Acesso completo ao sistema'),
('Operador', 'Acesso ao monitoramento dos servidores'),
('Visualizador', 'Acesso somente para visualização');


INSERT INTO permissoes
(nome, descricao)
VALUES
('GERENCIAR_USUARIOS', 'Gerenciar usuários'),
('GERENCIAR_PERFIS', 'Gerenciar perfis'),
('GERENCIAR_SERVIDORES', 'Gerenciar servidores'),
('VISUALIZAR_MONITORAMENTO', 'Visualizar monitoramento'),
('VISUALIZAR_ALERTAS', 'Visualizar alertas');


INSERT INTO nivel_acesso_permissoes
(fkNivel_acesso, fkPermissoes)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),

(2, 3),
(2, 4),
(2, 5),

(3, 4),
(3, 5);


INSERT INTO perfil_servidor
(nome, descricao, fkEmpresa)
VALUES
(
    'Produção',
    'Perfil dos servidores do ambiente de produção',
    1
);


INSERT INTO servidores
(nome, status, token_servidor, fkPerfil_servidor)
VALUES
('Servidor Produção 01', 'ATIVO', '456', 1),
('Servidor Produção 02', 'ATIVO', '789', 1);


INSERT INTO container
(nome, status, fkServidor)
VALUES
('coretrace-api', 'ATIVO', 1),
('coretrace-banco', 'ATIVO', 1),
('coretrace-web', 'ATIVO', 2);


INSERT INTO componentes
(
    nome,
    nomeColuna,
    funcaoPsutil,
    argumentoNome,
    argumentoValor,
    atributoRetorno,
    indiceRetorno,
    unidade
)
VALUES

(
    'Uso de CPU',
    'cpu_percent',
    'cpu_percent',
    'interval',
    '1',
    NULL,
    NULL,
    '%'
),

(
    'CPU Usuário',
    'cpu_user',
    'cpu_times_percent',
    'interval',
    '1',
    'user',
    NULL,
    '%'
),

(
    'CPU Sistema',
    'cpu_system',
    'cpu_times_percent',
    'interval',
    '1',
    'system',
    NULL,
    '%'
),

(
    'CPU Ociosa',
    'cpu_idle',
    'cpu_times_percent',
    'interval',
    '1',
    'idle',
    NULL,
    '%'
),

(
    'Frequência Atual da CPU',
    'cpu_freq_current',
    'cpu_freq',
    NULL,
    NULL,
    'current',
    NULL,
    'MHz'
),

(
    'Frequência Mínima da CPU',
    'cpu_freq_min',
    'cpu_freq',
    NULL,
    NULL,
    'min',
    NULL,
    'MHz'
),

(
    'Frequência Máxima da CPU',
    'cpu_freq_max',
    'cpu_freq',
    NULL,
    NULL,
    'max',
    NULL,
    'MHz'
),

(
    'Núcleos Físicos',
    'cpu_count_physical',
    'cpu_count',
    'logical',
    'False',
    NULL,
    NULL,
    'núcleos'
),

(
    'Núcleos Lógicos',
    'cpu_count_logical',
    'cpu_count',
    'logical',
    'True',
    NULL,
    NULL,
    'núcleos'
),

(
    'RAM Total',
    'ram_total',
    'virtual_memory',
    NULL,
    NULL,
    'total',
    NULL,
    'bytes'
),

(
    'RAM Disponível',
    'ram_available',
    'virtual_memory',
    NULL,
    NULL,
    'available',
    NULL,
    'bytes'
),

(
    'RAM Utilizada',
    'ram_used',
    'virtual_memory',
    NULL,
    NULL,
    'used',
    NULL,
    'bytes'
),

(
    'RAM Livre',
    'ram_free',
    'virtual_memory',
    NULL,
    NULL,
    'free',
    NULL,
    'bytes'
),

(
    'Uso de RAM',
    'ram_percent',
    'virtual_memory',
    NULL,
    NULL,
    'percent',
    NULL,
    '%'
),

(
    'Disco Total',
    'disk_total',
    'disk_usage',
    'path',
    '/',
    'total',
    NULL,
    'bytes'
),

(
    'Disco Utilizado',
    'disk_used',
    'disk_usage',
    'path',
    '/',
    'used',
    NULL,
    'bytes'
),

(
    'Disco Livre',
    'disk_free',
    'disk_usage',
    'path',
    '/',
    'free',
    NULL,
    'bytes'
),

(
    'Uso de Disco',
    'disk_percent',
    'disk_usage',
    'path',
    '/',
    'percent',
    NULL,
    '%'
),

(
    'Swap Total',
    'swap_total',
    'swap_memory',
    NULL,
    NULL,
    'total',
    NULL,
    'bytes'
),

(
    'Swap Utilizada',
    'swap_used',
    'swap_memory',
    NULL,
    NULL,
    'used',
    NULL,
    'bytes'
),

(
    'Swap Livre',
    'swap_free',
    'swap_memory',
    NULL,
    NULL,
    'free',
    NULL,
    'bytes'
),

(
    'Uso de Swap',
    'swap_percent',
    'swap_memory',
    NULL,
    NULL,
    'percent',
    NULL,
    '%'
),

(
    'Swap Entrada',
    'swap_sin',
    'swap_memory',
    NULL,
    NULL,
    'sin',
    NULL,
    'bytes'
),

(
    'Swap Saída',
    'swap_sout',
    'swap_memory',
    NULL,
    NULL,
    'sout',
    NULL,
    'bytes'
);


INSERT INTO componentes_perfil
(fkComponentes, fkPerfil, limite_atencao, limite_critico)
VALUES

(1, 1, 70.00, 90.00),

(2, 1, NULL, NULL),
(3, 1, NULL, NULL),
(4, 1, NULL, NULL),
(5, 1, NULL, NULL),
(6, 1, NULL, NULL),
(7, 1, NULL, NULL),
(8, 1, NULL, NULL),
(9, 1, NULL, NULL),

(10, 1, NULL, NULL),
(11, 1, NULL, NULL),
(12, 1, NULL, NULL),
(13, 1, NULL, NULL),

(14, 1, 75.00, 90.00),

(15, 1, NULL, NULL),
(16, 1, NULL, NULL),
(17, 1, NULL, NULL),

(18, 1, 80.00, 95.00),

(19, 1, NULL, NULL),
(20, 1, NULL, NULL),
(21, 1, NULL, NULL),

(22, 1, 50.00, 80.00),

(23, 1, NULL, NULL),
(24, 1, NULL, NULL);
