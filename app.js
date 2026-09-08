// const ambiente_processo = 'producao';
const ambiente_processo = "desenvolvimento";

const caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev.example";

require("dotenv").config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");
const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

const app = express();

const indexRouter = require("./src/routes/index");
const loginRouter = require("./src/routes/login");
const employeeRouter = require("./src/routes/employees");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/", indexRouter);
app.use("/user", loginRouter);
app.use("/employee", employeeRouter)


app.listen(PORTA_APP, function () {
	console.log(
    `Servidor rodando: http://${HOST_APP}:${PORTA_APP}`)
});