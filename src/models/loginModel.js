const database = require("../database/config");

function autenticar(email, senha, passKey) {
    const instrucaoSql = `
        SELECT id, nome, email, id_empresa, id_papel, nome_papel, tipo_papel, passkey
        FROM vw_info_user 
        WHERE email = ? AND senha = ? AND passkey = ?;
    `;

    return database.executar(instrucaoSql, [email, senha, passKey]);
}

function buscarPorEmail(email) {
    const instrucaoSql = `
        SELECT id FROM vw_info_user  WHERE email = ?;
    `;

    return database.executar(instrucaoSql, [email]);
}

function validarPapelFuncionario(idPapel) {
    const instrucaoSql = `
        SELECT id_papeis
        FROM vw_papeis
        WHERE id_papeis = ? AND tipo = 'FUNCIONARIO';
    `;

    return database.executar(instrucaoSql, [idPapel]);
}

function validarResponsavel(idResponsavel, idEmpresa) {
    const instrucaoSql = `
        SELECT id
        FROM vw_info_user
        INNER JOIN vw_papeis ON vw_papeis.id_papeis = vw_info_user.id_papel
        WHERE vw_info_user.id = ?
            AND vw_info_user.id_empresa = ?
            AND vw_papeis.tipo = 'GESTOR';
    `;

    return database.executar(instrucaoSql, [idResponsavel, idEmpresa]);
}

function cadastrar(nome, email, senha, idPapel, idResponsavel, idEmpresa, passKey) {
    const instrucaoSql = `
        INSERT INTO usuarios (nome, email, senha, papel, cadastrado, empresa, passkey)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senha,
        idPapel,
        idResponsavel,
        idEmpresa,
        passKey
    ]);
}

function getSectors(idEmpresa){
    const instrucaoSQL = `SELECT id_setores, nome, empresa FROM setores WHERE empresa = ?`
    return database.executar(instrucaoSQL,[idEmpresa])
}


function getMachines(setor){
    const instrucaoSQL = `SELECT 
    m.id_maquina AS id_maquina, 
    m.nome AS nome_maquina, 
    m.codigo AS codigo_maquina, 
    m.servidor AS servidor,
    s.nome AS nome_servidor, 
    s.setor AS setor, 
    st.nome AS nome_setor 
    FROM maquina AS m 
    LEFT JOIN servidores s ON s.id_servidor = m.servidor 
    LEFT JOIN setores st ON st.id_setores = s.setor WHERE setor = ?`
    return database.executar(instrucaoSQL,[setor])
}

function inserirAcessosServidor(idUsuario, idConcedidoPor, acessos) {
    // acessos: array de objetos { servidor: number, maquina: number|null }

    if (!Array.isArray(acessos) || acessos.length === 0) {
        return Promise.resolve([]);
    }

    const instrucaoSQL = `
        INSERT INTO acessos_servidor (usuario, servidor, concedido_por, maquina)
        VALUES ?
    `;

    const valores = acessos.map(function (acesso) {
        return [idUsuario, acesso.servidor, idConcedidoPor, acesso.maquina ?? null];
    });

    return database.executar(instrucaoSQL, [valores]);
}

function criarAcesso(usuario, servidor, maquina, concedidoPor) {
    const instrucaoSQL = `
        INSERT INTO acessos_servidor (usuario, servidor, maquina, concedido_por)
        VALUES (?, ?, ?, ?)
    `;
    return database.executar(instrucaoSQL, [usuario, servidor, maquina, concedidoPor]);
}

function criarAcessosEmLote(usuario, concedidoPor, acessos) {
    const placeholders = acessos.map(function () {
        return "(?, ?, ?, ?)";
    }).join(", ");

    const instrucaoSQL = `
        INSERT INTO acessos_servidor (usuario, servidor, maquina, concedido_por)
        VALUES ${placeholders}
    `;

    const valores = [];
    acessos.forEach(function (acesso) {
        valores.push(usuario, acesso.servidor, acesso.maquina, concedidoPor);
    });

    return database.executar(instrucaoSQL, valores);
}
function listarAcessosPorUsuario(usuario) {
    const instrucaoSQL = `
        SELECT a.usuario, a.servidor, a.maquina, a.concedido_por, a.dt_acesso, a.dt_retirada,
               s.nome AS nome_servidor, m.nome AS nome_maquina
        FROM acessos_servidor a
        JOIN servidores s ON s.id_servidor = a.servidor
        JOIN maquina m ON m.id_maquina = a.maquina
        WHERE a.usuario = ?
          AND a.dt_retirada IS NULL
    `;
    return database.executar(instrucaoSQL, [usuario]);
}

function buscarAcesso(usuario, servidor, maquina) {
    const instrucaoSQL = `
        SELECT usuario, servidor, maquina, concedido_por, dt_acesso, dt_retirada
        FROM acessos_servidor
        WHERE usuario = ? AND servidor = ? AND maquina = ?
    `;
    return database.executar(instrucaoSQL, [usuario, servidor, maquina]);
}

function revogarAcesso(usuario, servidor, maquina) {
    const instrucaoSQL = `
        UPDATE acessos_servidor
        SET dt_retirada = CURRENT_TIMESTAMP
        WHERE usuario = ? AND servidor = ? AND maquina = ?
          AND dt_retirada IS NULL
    `;
    return database.executar(instrucaoSQL, [usuario, servidor, maquina]);
}

function removerAcesso(usuario, servidor, maquina) {
    const instrucaoSQL = `
        DELETE FROM acessos_servidor
        WHERE usuario = ? AND servidor = ? AND maquina = ?
    `;
    return database.executar(instrucaoSQL, [usuario, servidor, maquina]);
}
module.exports = {
    autenticar,
    buscarPorEmail,
    validarPapelFuncionario,
    validarResponsavel,
    cadastrar,
    getSectors,
    getMachines,
    inserirAcessosServidor,
    criarAcesso,
    criarAcessosEmLote,
    listarAcessosPorUsuario,
    buscarAcesso,
    revogarAcesso,
    removerAcesso,
    
};
