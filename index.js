const Koa = require('koa');
const bodyparser = require("koa-bodyparser");
const app = new Koa();
app.use(bodyparser());

const sucessoRequisicao = (ctx, codigoREST, conteudo) => {
    ctx.status = codigoREST;
    ctx.body = {
        status: 'sucesso',
        dados: conteudo,
    }
}

const falhaRequisicao = (ctx, codigoREST, mensagem) => {
    ctx.status = codigoREST;
    ctx.body = {
        status:  'erro',
        dados: {
            mensagem: mensagem
        }
    }
}

app.use((ctx) => {

})

app.listen(8081, () => console.log("API rodando na porta 8081"))