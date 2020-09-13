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

const sucessoRequisicao = (ctx,  conteudo, codigoREST = 200) => {
    ctx.status = codigoREST;
    ctx.body = {
        status: 'sucesso',
        dados: conteudo,
    }
}

const falhaRequisicao = (ctx, mensagem, codigoREST = 404) => {
    ctx.status = codigoREST;
    ctx.body = {
        status:  'erro',
        dados: {
            mensagem: mensagem
        }
    }
}

const cadastrarMedico = (ctx) => {
    const medicoJSON = ctx.request.body;
    if (!medicoJSON.especialidade) {
        falhaRequisicao(ctx,'Adicione pelo menos uma especialidade para cadastrar um médico.', 400);
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
        fs.writeFileSync('./writeFile/medicos.json', JSON.stringify(medicos, null, 2));
        return novoMedico;
    }
}

const listarMedicos = () => {
    return medicos;
}

const obterMedico = (id, ctx) => {
    for (let medico of medicos) {
        if (medico.id === parseInt(id, 10)) return medico; 
    }
    falhaRequisicao(ctx, 'ID não encontrado.', 404)
    return false
}

const atualizarMedico = (id, ctx) => {
    const medicoJSON = ctx.request.body;
    if (medicoJSON.id) {
        falhaRequisicao(ctx, 'Não é possível alterar o valor de ID. Insira os dados do médico sem o ID.', 403)
        return false;
    } else if (!medicoJSON.especialidade) {
        falhaRequisicao(ctx, 'Insira uma propriedade válida para atualização.', 400)
        return false;
    } else {
        if (!obterMedico(id, ctx)) {
            falhaRequisicao(ctx, 'ID não encontrado.', 404)
            return false;
        } else {
            const index = medicos.indexOf(obterMedico(id, ctx));
            medicos[index] = {
                id: medicos[index].id,
                nome: medicoJSON.nome ? medicoJSON.nome : '',
                especialidade: medicoJSON.especialidade,
            }
            fs.writeFileSync('./writeFile/medicos.json', JSON.stringify(medicos, null, 2));
            return medicos[index]
        }
    }
}

const removerMedico = (id, ctx) => {
    if (!obterMedico(id, ctx)) {
        falhaRequisicao(ctx, 'ID não encontrado.', 404)
        return false;
    } else {
        const medicoRemovido = obterMedico(id, ctx);
        const index = medicos.indexOf(obterMedico(id, ctx));
        medicos.splice(index, 1);
        fs.writeFileSync('./writeFile/medicos.json', JSON.stringify(medicos, null, 2));
        return medicoRemovido
    }
}

const cadastrarConsulta = (ctx) => {
    const consultaJSON = ctx.request.body;
    if (!consultaJSON.nome) {
        falhaRequisicao(ctx, 'Insira corretamente todos os dados necessários.', 400);
        return false;
    } else if (!consultaJSON.raca) {
        falhaRequisicao(ctx, 'Insira corretamente todos os dados necessários.', 400);
        return false;
    } else if (!consultaJSON.urgente === Boolean) {
        falhaRequisicao(ctx, 'Insira corretamente todos os dados necessários.', 400);
        return false;
    } else if (!consultaJSON.atendimento) {
        falhaRequisicao(ctx, 'Insira corretamente todos os dados necessários.', 400);
        return false;
    }

    let indexConsulta;
    (consultas.length === 0) ? indexConsulta = 1 : indexConsulta = consultas[consultas.length-1].id + 1;
    const novaConsulta = {
            id : indexConsulta,
            nome: consultaJSON.nome,
            especie: consultaJSON.especie,
            raca: consultaJSON.raca,
            urgente: consultaJSON.urgente,
            atendimento: consultaJSON.atendimento,
            status: "pendente"
        }
    consultas.push(novaConsulta);
    fs.writeFileSync('./writeFile/consultas.json', JSON.stringify(consultas, null, 2));
    return novaConsulta;
}

const obterConsulta = (id, ctx) => {
    for (let consulta of consultas) {
        if (consulta.id === parseInt(id, 10)) return consulta; 
    }
    falhaRequisicao(ctx, 'ID não encontrado.', 404)
    return false
}

const proximaConsulta = (id, ctx) => {
    const proximoMedico = obterMedico(id, ctx);
    if(!proximoMedico) {
        falhaRequisicao(ctx, 'ID não encontrado.', 404)
        return false;
    } else {
        for(let consultaUrgente of consultas) {
            if (consultaUrgente.urgente) {
                if (consultaUrgente.atendimento === proximoMedico.especialidade) {
                    return [proximoMedico, consultaUrgente];
                }
            }
        }
        for(let consultaNaoUrgente of consultas) {
            if (consultaNaoUrgente.atendimento === proximoMedico.especialidade) {
                return [proximoMedico, consultaNaoUrgente];
            }
        }
        falhaRequisicao(ctx, 'Não foram encontrados atendimentos para este médico.', 404)
        return false;
    }
}

const listarConsultas = () => {
    return consultas;
}

const consultaRealizada = (id, ctx) => {
    const indexConsulta = consultas.indexOf(obterConsulta(id, ctx));
    if (indexConsulta === false || indexConsulta === -1) {
        return false
    } else {
    consultas[indexConsulta].status = 'ATENDIDO';

    consultasFinalizadas.push(consultas[indexConsulta]);
    consultas.splice(indexConsulta, 1);

    fs.writeFileSync('./writeFile/consultas.json', JSON.stringify(consultas, null, 2));
    fs.writeFileSync('./writeFile/consultasFinalizadas.json', JSON.stringify(consultasFinalizadas, null, 2));

    return consultasFinalizadas[consultasFinalizadas.length-1];
    }
}

const consultaCancelada = (id, ctx) => {
    const indexConsulta = consultas.indexOf(obterConsulta(id, ctx));
    console.log(indexConsulta);
    if (indexConsulta === false || indexConsulta === -1) {
        return false
    } else {
    consultas[indexConsulta].status = 'CANCELADO';

    consultasFinalizadas.push(consultas[indexConsulta]);
    consultas.splice(indexConsulta, 1);

    fs.writeFileSync('./writeFile/consultas.json', JSON.stringify(consultas, null, 2));
    fs.writeFileSync('./writeFile/consultasFinalizadas.json', JSON.stringify(consultasFinalizadas, null, 2));
    

    return consultasFinalizadas[consultasFinalizadas.length-1];
    }
}

const listarFinalizadas = () => {
    return consultasFinalizadas;
}

app.use((ctx) => {
    const body = ctx.body;
    const path = ctx.url;
    const method = ctx.method;
    const subPath = path.split('/');

    if (path === "/medicos") {
        switch (method) {
            case 'GET':
                sucessoRequisicao(ctx, listarMedicos(), 200);
                break;
            
            case 'POST':
                const medicoCriado = cadastrarMedico(ctx);

                if (medicoCriado) {
                    sucessoRequisicao(ctx, medicoCriado, 201);
                }
                break;
            
            default:
                falhaRequisicao(ctx, 'Método não permitido' , 405);
                break;
        }
    } else 
    if (path.includes("/medicos/")) {
        if (subPath[1] === "medicos") {
            if (!isNaN(subPath[2])) {
                switch (method) {
                    case 'GET':
                        obterMedico(subPath[2], ctx) ? sucessoRequisicao(ctx, obterMedico(subPath[2], ctx), 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                        break;

                    case 'PUT':
                        const medicoAtualizado = atualizarMedico(subPath[2], ctx);
                        medicoAtualizado ? sucessoRequisicao(ctx, medicoAtualizado, 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                        break;
                    
                    case 'DELETE':
                        const medicoRemovido = removerMedico(subPath[2], ctx);
                        medicoRemovido ? sucessoRequisicao(ctx, medicoRemovido, 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                        break;

                    default:
                        falhaRequisicao(ctx, 'Método não permitido' , 405);
                        break;    
                }
            } else {
                falhaRequisicao(ctx, 'Requisição mal formada. Insira um ID que seja um número.' , 400);
            }
        } else {
            falhaRequisicao(ctx, 'Não encontrado.' , 404);
        }
    } else if (path === "/consultas") {
        switch (method) {
            case 'GET':
                sucessoRequisicao(ctx, listarConsultas(), 200);
                break;
            case 'POST':
                const consultaCriada = cadastrarConsulta(ctx);
                if (consultaCriada) {
                    sucessoRequisicao(ctx, consultaCriada, 201);
                }
                break;
            default:
                falhaRequisicao(ctx, 'Método não permitido' , 405);
                break;
        }
    } else if (path.includes("/consultas/")) {
        if (subPath[1] === "consultas") {
            switch (true) {
                case (!isNaN(subPath[2])):
                    if (method === 'GET') {
                        obterConsulta(subPath[2], ctx) ? sucessoRequisicao(ctx, obterConsulta(subPath[2], ctx), 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                        break;
                    } else {
                        falhaRequisicao(ctx, 'Método não permitido' , 405);
                        break;
                    }

                case (subPath[2] === 'atendimento'):
                    if (!isNaN(subPath[3])) {
                        if (method === 'GET') {
                            proximaConsulta(subPath[3], ctx) ? sucessoRequisicao(ctx, proximaConsulta(subPath[3], ctx), 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                            break;
                        } else {
                            falhaRequisicao(ctx, 'Método não permitido' , 405);
                            break;
                        }
                    } else {
                        falhaRequisicao(ctx, 'Requisição mal formada. Insira um ID que seja um número.' , 400);
                        break;
                    }

                case (subPath[2] === 'realizada'):
                    if (!isNaN(subPath[3])) {
                        if (method === 'PUT') {
                            const consultaFeita = consultaRealizada(subPath[3], ctx);
                            consultaFeita ? sucessoRequisicao(ctx, consultaFeita, 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                            break;
                        } else {
                            falhaRequisicao(ctx, 'Método não permitido' , 405);
                            break;
                        }
                    } else {
                        falhaRequisicao(ctx, 'Requisição mal formada. Insira um ID que seja um número.' , 400);
                        break;
                    }

                case (subPath[2] === 'cancelada'):
                    if (!isNaN(subPath[3])) {
                        if (method === 'PUT') {
                            const cancelamento = consultaCancelada(subPath[3], ctx);
                            cancelamento ? sucessoRequisicao(ctx, cancelamento, 200) : falhaRequisicao(ctx, 'ID não encontrado.', 404);
                            break;
                        } else {
                            falhaRequisicao(ctx, 'Método não permitido' , 405);
                            break;
                        }
                    } else {
                        falhaRequisicao(ctx, 'Requisição mal formada. Insira um ID que seja um número.' , 400);
                        break;
                    }
                
                case (subPath[2] === 'finalizadas'):
                    if (method === 'GET') {
                        sucessoRequisicao(ctx, listarFinalizadas(), 200);
                        break;
                    } else {
                        falhaRequisicao(ctx, 'Método não permitido' , 405);
                        break;
                    }
                
                default:
                    falhaRequisicao(ctx, 'Não encontrado.' , 404);
                    break;
            }
        } else {
            falhaRequisicao(ctx, 'Não encontrado.' , 404);
        }
    } else {
        falhaRequisicao(ctx, 'Não encontrado.' , 404);
    }
})

app.listen(8081, () => console.log("API rodando na porta 8081"))