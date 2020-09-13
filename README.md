# Desafio técnico de Backend - Cubos
## API de controle de filas de um hospital veterinário.

Repositório referente a uma API REST que tem como função administrar os atendimentos de um hospital veterinário, englobando requerimentos de cadastro, atualização e listagem de médicos e consultas. 

# Conteúdos
- Endpoints
    - Requisições dos médicos
    - Requisições das consultas
- Instalação
- Documentação do Postman Collection

## Endpoints

### Requisições dos médicos

#### Cadastro de médico

POST `/medicos`
Recebe um JSON como entrada contendo nome e especialidade do médico e retorna o cadastro do mesmo. Especialidade é um campo obrigatório.

#### Listagem de Médicos

GET `/medicos`
Retorna todos os médicos cadastrados no sistema.

#### Listagem de um médico específico

GET `/medicos/:id`
Retorna as informações de um médico em específico com base no ID informado na requisição.

#### Atualizar informações de um médico

PUT `/medicos/:id`
Através de um JSON de entrada e o ID do médico em questão, é possível atualizar os dados de cadastro de um médico. O campo de especialidade é obrigatório.

#### Apagar registro de um médico

DEL `/medicos/:id`
A partir do ID do médico, deleta o registro do mesmo do sistema.

### Requisições das consultas

#### Cadastrar consulta

POST `/consultas`
Recebe um JSON como entrada contendo nome, especie, raça, urgência e o tipo de atendimento e retorna o cadastro do mesmo.

#### Listagem de consultas

GET `/consultas`
Retorna a lista completa de consultas, divididas entre pendentes e canceladas/finalizadas.

#### Listar consulta específica

GET `/consultas/:id`
Retorna informações de uma consulta específica através do seu ID.

#### Próxima consulta

GET `consultas/atendimento/:id`
Através do ID da requisição, apresenta o próximo atendimento com base na especialidade do médico.

#### Consulta realizada

PUT `consultas/realizada/:id`
Através do ID da consulta dada na requisição a marca como REALIZADA.

#### Consulta cancelada

PUT `consultas/cancelada/:id`
Através do ID da consulta dada na requisição a marca como CANCELADA.

## Instalação

Para rodar o projeto, você precisará ter o Node.js instalado na sua máquina.

### Node
- #### Instalação do Node no Windows
    Acesse a página oficial do Node.js (https://nodejs.org) e baixe o instalador.
Tenha certeza também que tem o `git` disponível no seu PATH, você também pode precisar do `npm`.

- #### Instalação do Node no Ubuntu
    Você pode instalar facilmente o nodejs e o npm com um apt install, basta seguir os seguintes comandos.

        $ sudo apt install nodejs
        $ sudo apt install npm

- #### Outros sistemas operacionais
    Você pode achar mais informações sobre a instalação no site oficial do Node.js (https://nodejs.org/) e no site oficial do NPM.

### Koa e Bodyparser

-    O Koa necessita do Node v7.6.0 ou mais para ED2015 e suporte a funções async.

        $ npm install koa
        
        [Documentação](https://koajs.com/)

-    Além disso, precisamos do koa-bodyparser, 

        $ npm i koa-bodyparser
        
        [Documentação](https://www.npmjs.com/package/koa-bodyparser)

## Documentação do Postman Collection

https://bit.ly/2FzzZWB
