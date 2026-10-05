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

### Página de teste: cadastro com convite por email

Com `npm start`, abra `http://localhost:3333/pages/cadastro-teste.html`
(ajuste a porta conforme o `.env.dev`). A página é HTML simples, sem CSS.

Preencha nome, email, CPF e telefone (opcionais), ID da empresa e ID do nível
de acesso. A empresa e o nível precisam existir no banco.

O formulário usa `POST /convites/criarConvite`. O usuário é criado como `PENDENTE`,
com `token_acesso` gerado no servidor. O Resend envia o link para definir a senha
na página de ativação. Ao concluir, o status muda para `ATIVO`, o token é removido
e o usuário pode fazer login.

Configure no `.env.dev`:

```dotenv
RESEND_API_KEY=sua_chave_do_resend
RESEND_FROM=seu_remetente_no_resend
APP_URL=http://localhost:3333
```

`RESEND_FROM` é opcional e usa `onboarding@resend.dev` por padrão. Esse remetente
de teste só envia ao email da própria conta Resend. Para enviar a outras pessoas,
configure um remetente de um domínio verificado, conforme a
[documentação do Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

`APP_URL` define o endereço do site no link do email; use uma URL acessível ao destinatário para
ativação em outro dispositivo. Sem `APP_URL`, são usados `APP_HOST` e `APP_PORT`.

Se o Resend recusar o envio, o cadastro pendente é desfeito para permitir nova
tentativa. A página só confirma o envio após o Resend aceitar a solicitação.
