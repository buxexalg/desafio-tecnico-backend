const Koa = require('koa');
const bodyparser = require("koa-bodyparser");
const fs = require('fs');
const app = new Koa();
app.use(bodyparser());

const medicos = [];
const consultas = [];
const consultasFinalizadas = [];

const err = (err) => {
    if (err) {
        console.log(err);
    }
}

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

const cadastrarMedico = (medicoJSON) => {
    if (!medicoJSON.especialidade || medicoJSON.especialidade.trim() === '' || medicoJSON.especialidade === null) {
        console.log('400 - Adicione pelo menos uma especialidade para cadastrar um médico.')
        return false;
    } else {
        let indexMedico;
        (medicos.length === 0) ? indexMedico = 1 : indexMedico = medicos[medicos.length-1].id + 1;
        const novoMedico = {
            id : indexMedico,
            nome: medicoJSON.nome,
            especialidade: medicoJSON.especialidade,
        }
        medicos.push(novoMedico);
        fs.writeFileSync('./medicos.json', JSON.stringify(medicos, null, 2));
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
                nome: medicoJSON.nome ? medicoJSON.nome : '',
                especialidade: medicoJSON.especialidade,
            }
            fs.writeFileSync('./medicos.json', JSON.stringify(medicos, null, 2));
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
        fs.writeFileSync('./medicos.json', JSON.stringify(medicos, null, 2));
        return medicos
    }
}

const cadastrarConsulta = (consultaJSON) => {
    if (!consultaJSON.especie || consultaJSON.especie.trim() === '' || consultaJSON.especie === null) {
        console.log('400 - Insira corretamente todos os dados necessários.');
        return false;
    } else if (!consultaJSON.raca || consultaJSON.raca.trim() === '' || consultaJSON.raca === null) {
        console.log('400 - Insira corretamente todos os dados necessários.');
        return false;
    } else if (typeof consultaJSON.urgente !== 'boolean' || consultaJSON.especie === null) {
        console.log('400 - Insira corretamente todos os dados necessários.');
        return false;
    } else if (!consultaJSON.atendimento || consultaJSON.atendimento.trim() === '' || consultaJSON.atendimento === null) {
        console.log('400 - Insira corretamente todos os dados necessários.');
        return false;
    }

    let indexConsulta;
    (consultas.length === 0) ? indexConsulta = 1 : indexConsulta = consultas[consultas.length-1].id + 1;
    const novaConsulta = {
            id : indexConsulta,
            especie: consultaJSON.especie,
            raca: consultaJSON.raca,
            urgente: consultaJSON.urgente,
            atendimento: consultaJSON.atendimento,
            status: "pendente"
        }
    consultas.push(novaConsulta);
    fs.writeFileSync('./consultas.json', JSON.stringify(consultas, null, 2));
    return novaConsulta;
}

const obterConsulta = (id) => {
    for (consulta of consultas) {
        if (consultas[id-1] === consulta) return consulta; 
    }
    console.log('404 - ID não encontrado.');
    return false
}

const proximaConsulta = (id) => {
    const proximoMedico = obterMedico(id);
    if(!proximoMedico) {
        return false
    } else {
        for(consultaUrgente of consultas) {
            if (consultaUrgente.urgente) {
                if (consultaUrgente.atendimento === proximoMedico.especialidade) {
                    return [proximoMedico, consultaUrgente];
                }
            }
        }
        for(consultaNaoUrgente of consultas) {
            if (consultaNaoUrgente.atendimento === proximoMedico.especialidade) {
                return [proximoMedico, consultaNaoUrgente];
            }
        }

        console.log('404 - Não foram encontrados atendimentos para este médico.');
        return false;
    }
}

const listarConsultas = () => {
    return consultas;
}

const consultaRealizada = (id) => {
    const indexConsulta = consultas.indexOf(obterConsulta(id));
    consultas[indexConsulta].status = 'ATENDIDO';

    consultasFinalizadas.push(consultas[indexConsulta]);
    consultas.splice(indexConsulta, 1);

    fs.writeFileSync('./consultas.json', JSON.stringify(consultas, null, 2));
    fs.writeFileSync('./consultasFinalizadas.json', JSON.stringify(consultasFinalizadas, null, 2));

    return consultasFinalizadas[consultasFinalizadas.length-1];
}

const consultaCancelada = (id) => {
    const indexConsulta = consultas.indexOf(obterConsulta(id));
    consultas[indexConsulta].status = 'CANCELADO';

    consultasFinalizadas.push(consultas[indexConsulta]);
    consultas.splice(indexConsulta, 1);

    fs.writeFileSync('./consultas.json', JSON.stringify(consultas, null, 2));
    fs.writeFileSync('./consultasFinalizadas.json', JSON.stringify(consultasFinalizadas, null, 2));
    
    return consultasFinalizadas[consultasFinalizadas.length-1];
}

const listarFinalizadas = () => {
    return consultasFinalizadas;
}

app.use((ctx) => {

})

app.listen(8081, () => console.log("API rodando na porta 8081"))

/* 200 OK
201 Conteúdo criado

400 - Requisição mal formada
401 - Não autorizado
403 - Proibido
404 - Not Found */