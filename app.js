// const ambiente_processo = 'producao';
const ambiente_processo = "desenvolvimento";

const caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

require("dotenv").config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");
const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

const app = express();

const indexRouter = require("./src/routes/index");
const employeeRouter = require("./src/routes/employees");
const servidorRouter = require("./src/routes/servidor");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/", indexRouter);
app.use("/employee", employeeRouter)
app.use("/servidor", servidorRouter);

app.listen(PORTA_APP, function () {
	console.log(
    `Servidor rodando: http://${HOST_APP}:${PORTA_APP}`)
});