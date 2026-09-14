var database = require("../database/config");

function searchEmployee(nomeServer, emailServer, posicaoServer, ordemNomeServer, ordemEmailServer, ordemPosicaoServer, marcadoNomeServer, marcadoEmailServer, marcadoPosicaoServer, idEmpresaServer) {
    console.log("ACESSEI O EMPLOYEE MODEL function searchEmployee():", nomeServer, emailServer, posicaoServer, idEmpresaServer);

    let direcaoNome = ordemNomeServer === "DESC" ? "DESC" : "ASC";
    let direcaoEmail = ordemEmailServer === "DESC" ? "DESC" : "ASC";
    let direcaoPosicao = ordemPosicaoServer === "DESC" ? "DESC" : "ASC";
    // let direcaoData = ordemDataServer === "DESC" ? "DESC" : "ASC"; // Dt. Admissão ainda não existe na tabela usuarios
    // let direcaoAtividade = ordemAtividadeServer === "DESC" ? "DESC" : "ASC"; // Atividade ainda não existe no BD

    // Monta o ORDER BY apenas com as colunas marcadas, na ordem em que
    // aparecem no HTML: Funcionário (nome), Email, Cargo (posição)
    let colunasOrdenacao = "";

    if (marcadoPosicaoServer) {
        colunasOrdenacao += `p.nivel_papel ${direcaoPosicao}, `;
    }else{
        colunasOrdenacao += `p.nivel_papel ${direcaoPosicao}, `;
    }
    if (marcadoNomeServer) {
        colunasOrdenacao += `nome ${direcaoNome}, `;
    }else{
        if (marcadoEmailServer) {
            colunasOrdenacao += `email ${direcaoEmail}, `;
        }else{
            colunasOrdenacao += `email ${direcaoEmail}, `;
        }
        }

    if (colunasOrdenacao !== "") {
        colunasOrdenacao = colunasOrdenacao.substring(0, colunasOrdenacao.length - 2);
    } else {
        colunasOrdenacao = "u.nome ASC";
    }

    const instrucaoSql = `
        SELECT
            u.id_usuarios AS id,
            u.nome AS nome,
            u.email AS email,
            p.nome AS papel,
            p.tipo AS tipo_papel
        FROM usuarios u
        INNER JOIN papeis p ON p.id_papeis = u.papel
        WHERE u.nome LIKE ?
          AND u.email LIKE ?
          AND p.nome LIKE ?
          AND u.empresa = ?
        ORDER BY ${colunasOrdenacao}
    `;
    // Quando dt_admissao / atividade existirem no BD:
    // adicionar "u.dt_admissao AS dt_admissao" e "u.atividade AS atividade" no SELECT,
    // e considerar essas colunas na montagem de colunasOrdenacao acima.

    var parametros = [nomeServer, emailServer, posicaoServer, idEmpresaServer];

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, parametros);
}

function catchServer(idUsuario) {
    console.log("ACESSEI O EMPLOYEE MODEL function catchServer():", idUsuario)
    const instrucaoSQL = `SELECT
        u.id_usuarios AS id_usuario,
        u.nome AS nome_usuario,
        st.id_setores AS id_setor,
        st.nome AS nome_setor,
        sv.id_servidor AS id_servidor,
        sv.nome AS nome_servidor,
        m.id_maquina AS id_maquina,
        m.nome AS nome_maquina,
        m.codigo AS codigo_maquina,
        m.dt_inicio AS dt_inicio_maquina,
        m.dt_fim AS dt_fim_maquina
    FROM acessos_servidor
    INNER JOIN usuarios AS u ON u.id_usuarios = acessos_servidor.usuario
    INNER JOIN maquina AS m ON m.id_maquina = acessos_servidor.maquina
    INNER JOIN servidores AS sv ON sv.id_servidor = acessos_servidor.servidor
    LEFT JOIN setores AS st ON st.id_setores = sv.setor
    WHERE u.id_usuarios = ?;`
    console.log("Executando a instrução SQL: \n" + instrucaoSQL);
    var parametros = [idUsuario]
    return database.executar(instrucaoSQL, parametros);
}

function revokeAccess(idUsuario, arrayMaquinas) {
    console.log("ACESSEI O EMPLOYEE MODEL function revokeAccess():", idUsuario, arrayMaquinas);
    
    let placeholders = arrayMaquinas.map(() => '?').join(',');

    const instrucaoSQL = `
        UPDATE acessos_servidor 
        SET dt_retirada = CURRENT_TIMESTAMP 
        WHERE usuario = ? 
        AND servidor IN (
            SELECT servidor FROM maquina WHERE id_maquina IN (${placeholders})
        );
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSQL);
    
    var parametros = [idUsuario, ...arrayMaquinas];
    
    return database.executar(instrucaoSQL, parametros);
}

function getPapel(idUsuario, emailUsuario){
    console.log("ACESSEI O EMPLOYEE MODEL function getPapel():", idUsuario, emailUsuario);

    const instrucaoSQL = `
        SELECT papel 
        FROM usuarios u 
        WHERE id_usuarios = ? 
        AND email = ?;
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSQL);
    var parametros = [idUsuario, emailUsuario]
    return database.executar(instrucaoSQL,parametros)
}


module.exports = {
    searchEmployee,
    catchServer,
    revokeAccess,
    getPapel,
};