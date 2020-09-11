const Koa = require('koa');
const bodyparser = require("koa-bodyparser");
const app = new Koa();
app.use(bodyparser());

const medicos = [];

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

const cadastrarMedico = (especialidade,nome = '') => {
    if (!especialidade || especialidade.trim() === '' || especialidade === null) {
        console.log('400 - Adicione pelo menos uma especialidade para cadastrar um médico.')
        return false;
    } else {
        let indexMedico;
        (medicos.length === 0) ? indexMedico = 1 : indexMedico = medicos.length + 1;
        const novoMedico = {
            id : indexMedico,
            nome: nome,
            especialidade: especialidade,
        }
        medicos.push(novoMedico);
        return novoMedico;
    }
}

const listarMedicos = () => {
    return medicos;
}

const obterMedico = (id) => {
    for (medico of medicos) {
        if (medicos[id-1] === medico) return medico; 
    }
    console.log('404 - ID não encontrado.');
    return false
}

const atualizarMedico = (id, medicoJSON) => {
    if (medicoJSON.id) {
        console.log('403 - Não é possível alterar o valor de ID. Insira os dados do médico sem o ID.')
        return false;
    } else if (!medicoJSON.especialidade || !medicoJSON.especialidade.trim() === '' || !medicoJSON.especialidade === null) {
        console.log('400 - Insira uma propriedade válida para atualização.');
        return false;
    } else {
        if (!obterMedico(id)) {
            console.log('404 - ID não encontrado.');
            return false;
        } else {
            const index = medicos.indexOf(obterMedico(id));
            medicos[index] = {
                id: medicos[index].id,
                nome: medicoJSON.nome,
                especialidade: medicoJSON.especialidade,
            }
            return medicos[index]
        }
    }
}

const removerMedico = (id) => {
    if (!obterMedico(id)) {
        console.log('404 - ID não encontrado.');
        return false;
    } else {
        const index = medicos.indexOf(obterMedico(id));
        medicos.splice(index, 1);
    
        return medicos
    }
}



app.use((ctx) => {

})

app.listen(8081, () => console.log("API rodando na porta 8081"))
