# CoreTrace-website

### 1. Clone o repositório

```bash
git clone https://github.com/Core-Trace/CoreTrace-website.git
```

### 2. Acesse o diretorio do projeto

```bash
cd CoreTrace-website
```

### 3. Instale as dependências

```bash
npm install / npm i
```

### 4. Configure as variáveis de ambiente

```
AMBIENTE_PROCESSO=desenvolvimento

DB_HOST=''
DB_DATABASE=''
DB_USER=''
DB_PASSWORD=''
DB_PORT=''

APP_PORT=''
APP_HOST=''
```

### 5. Inicie o projeto

```bash
npm start
```

### Rotas da tabela `usuario`

`POST /usuario/cadastrar` recebe JSON no padrão dos outros controllers:

```json
{
  "nomeServer": "Ana Silva",
  "emailServer": "ana@empresa.com",
  "senhaServer": "senha123",
  "cpfServer": "12345678901",
  "telefoneServer": "11999999999",
  "empresaServer": 1,
  "nivelAcessoServer": 2
}
```

CPF e telefone são opcionais. A empresa e o nível de acesso precisam existir
nas tabelas `empresa` e `nivel_acesso`. O cadastro cria o usuário com status `ATIVO`.

`POST /usuario/autenticar` recebe:

```json
{
  "emailServer": "ana@empresa.com",
  "senhaServer": "senha123"
}
```

O login aceita usuários ativos e retorna `idusuario`, `nome`, `email`,
`fkEmpresa`, `fkNivel_acesso` e `status`.
