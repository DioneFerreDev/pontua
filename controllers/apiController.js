

require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodeFetch = require("../templatesViews/classes/nodeFetch");
const DateToRecent = require("../templatesViews/classes/DateToRecent");

module.exports =
{
    logout: async (req, res) => {
        try {
            console.log('chegou no rota logout')
            res.clearCookie('authorization-pannel-token', { path: '/', httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).send({ logout: true });
        } catch (error) {
            console.log(error);
            res.status(401).send({ logout: false });
        }
    },
    login: async (req, res) => {
        try {
            const dados = req.body;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/${dados.user},${dados.password}`;
            let adm = new nodeFetch(URL)
            adm = await adm.manageFetch();
            // fazer aqui o set das session
            req.session.user = req.body.user;
            req.session.isAdmin = adm.isAdmin;
            // id provisório
            req.session.uuid = "804dcf6c-aa27-4a30-89d6-661574c29c58";
            const options = { expiresIn: "23h" }
            const token = jwt.sign({ user: adm.user, level: adm.isAdmin }, process.env.TOKEN_SECRET, options);
            res.cookie("authorization-pannel-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: (1000 * 60 * 60 * 23)
            })
            res.setHeader("Cache-Control", "no-store");
            res.send({ log: true, redirect: "/pannel" });

        } catch (error) { console.log(error); res.send({ log: false }) }

    },
    createUser: async (req, res) => {
        try {
            const URL_USER = "https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/Create";
            const user = req.body.user;
            const password = req.body.password;
            const dados = { user, password }
            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
            let resposta = new nodeFetch(URL_USER, options);
            resposta = await resposta.manageFetch();
            const msg = `resposta chegou com sucesso na API do create user com o use de ${user} e password de ${password}`;
            res.status(200).send(msg);
        } catch (error) {
            console.log(error);
            res.status(401).send({ logout: false });
        }
    },
    setarTokenCliente: async (req, res) => {
        try {
            const uuid = req.query.uuid;
            console.log(`uuid é de ${uuid}`);

            console.log('voltar em apiController.setarTokenCliente para arrumar o endpoint')
            // comentei até q dê uma arrumada no codigo
            const URL_EMPRESA_AUTH = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Empresa/Redirect?uuid=${uuid}`;
            const resposta = await new nodeFetch(URL_EMPRESA_AUTH).manageFetch();

            if (!resposta === "OK") return res.redirect("/unAuth")

            const options = { expiresIn: "1m" }
            const token = jwt.sign({ nome: "Pontua Mais", id: uuid }, process.env.TOKEN_SECRET, options);
            res.cookie("authorization-cliente-token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                maxAge: (5 * 60 * 1000)
            })
            res.redirect("/cliente");
        } catch (error) {
            console.log(error)
            res.status(401).redirect("/unAuth");
        }
    },
    puxarProdutos: async (req, res) => {
        try {
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/ListAll`;
            const produtos = await new nodeFetch(URL).manageFetch();
            res.send(produtos);

        } catch (error) { console.log(error); res.send({}) }

    },
    getHisCliente: async (req, res) => {
        try {
            const cpf = req.body.cpf;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/${cpf}`;
            const cliente = await new nodeFetch(URL).manageFetch();
            res.send(cliente);

        } catch (error) { console.log(error); res.send({}) }
    },
    saveNomeCPF: async (req, res) => {
        try {
            const nome = req.body.nome;
            const cpf = req.body.cpf;
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/NomearCliente ${cpf}, ${nome}`;
            await new nodeFetch(URL).manageFetch();
            res.send(200).send("OK");
        } catch (error) { console.log(error); res.send({}) }
    },
    trocarPontos: async (req, res) => {
        try {
            const sku = req.body.sku;
            const cpf = req.body.cpf;
            const produtoDescricao = req.body.produtoDescricao;
            const empresaId = req.session.uuid;

            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sku, cpf, produtoDescricao, empresaId })
            }

            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/TrocarPontos`;
            await new nodeFetch(URL, options).manageFetch();
            res.status(200).send("OK");
        } catch (error) { console.log(error); res.send({}) }
    },
    sendPoints: async (req, res) => {
        try {
            const empresaId = req.session.uuid;
            const points = req.body.pontos;
            const cpf = req.body.cpf;
            const data = req.body.data;

            const URL_CLIENTE = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/${cpf}`;
            await new nodeFetch(URL_CLIENTE).manageFetch();
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/PontosTemp?uuid=${empresaId}&valor=${points}`;
            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*"
                }
            }
            // voltar aqui
            await new nodeFetch(URL, options).manageFetch();
            const optionsCreate = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cpf, data })
            }
            const URLPOST = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/Create`;
            await new nodeFetch(URLPOST, optionsCreate).manageFetch();

            res.status(200).send({ error: false });
        } catch (error) { console.log(error); res.send({ error: true }) }
    },
    clienteRoleta: async (req, res) => {
        try {
            const cpf = req.body.cpf;
            const sku = req.body.sku;
            const produtoDescricao = req.body.produtoDescricao;
            const produtos = req.body.produtos;
            let pontosRoleta = req.body.pontos;
            // const empresaId = req.session.uuid;
            // resolver o problema do id pois estou passando manualmente            
            const empresaId = "804dcf6c-aa27-4a30-89d6-661574c29c58";
            pontosRoleta = 0;
            console.log('chegou em pontos roleta com valores de ')
            console.log(cpf, sku, produtoDescricao, empresaId)

            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/PontosRoleta ${pontosRoleta}`;
            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cpf, sku, produtoDescricao, empresaId })
            }
            await new nodeFetch(URL, options).manageFetch();
            res.status(200).send("OK");
        } catch (error) { console.log(error); res.send({}) }
    },
    salvarProduto: async (req, res) => {
        try {
            const produto = req.body;
            produto.empresaId = req.session.uuid;

            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/Create`;
            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            }
            await new nodeFetch(URL, options).manageFetch();
            res.status(200).send("OK");
        } catch (error) { console.log(error); res.send({}) }
    },
    allClientes: async (req, res) => {
        try {
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/ListAll`;
            const clientes = await new nodeFetch(URL).manageFetch();
            res.status(200).send(clientes);
        } catch (error) { console.log(error); res.send({}) }
    },
    allUsers: async (req, res) => {
        try {
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/ListAll`;
            const users = await new nodeFetch(URL).manageFetch();
            res.status(200).send(users);
        } catch (error) { console.log(error); res.send({}) }
    },
    deleteProduto: async (req, res) => {
        const sku = req.body.sku;
        const descricao = req.body.descricao;
        const options = {
            method: "DELETE",
            headers: {
                "Accept": "*/*"
            }
        }
        try {
            const URL_DEL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/Delete ${sku}, ${descricao}`;
            const users = await new nodeFetch(URL_DEL, options).manageFetch();
            res.status(200).send(users);
        } catch (error) { console.log(error); res.send({}) }
    },
    updateProduto: async (req, res) => {
        let product = req.body;
        product.empresaId = req.session.uuid;

        const URL_PRODUTOS = "https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/Update";
        const options = {
            method: "PUT",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }
        try {
            await new nodeFetch(URL_PRODUTOS, options).manageFetch();
            res.status(200).send({ response: "OK" });
        } catch (error) { console.log(error); res.send({}) }
    },
    deleteUser: async (req, res) => {
        let user = req.body;

        const URL_USER_DELETE = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/Delete`;
        const options = {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
        try {
            await new nodeFetch(URL_USER_DELETE, options).manageFetch();
            res.status(200).send({ response: "OK" });
        } catch (error) { console.log(error); res.send({}) }
    },
    updateUser: async (req, res) => {
        const data = req.body;
        const password = data.oldPassword;
        const user = data.oldUser;
        const URL_USER_UPDATE = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/UserLogin/updateUser ${user},${password}`;
        const options = {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        try {
            await new nodeFetch(URL_USER_UPDATE, options).manageFetch();
            res.status(200).send({ response: "OK" });
        } catch (error) { console.log(error); res.send({}) }
    },
    deleteCliente: async (req, res) => {
        const data = req.body;


        const URL_DEL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/Delete`;
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        try {
            await new nodeFetch(URL_DEL, options).manageFetch();
            res.status(200).send({ response: "OK" });
        } catch (error) { console.log(error); res.send({}) }
    },
    updateRoleta: async (req, res) => {
        let data = req.body;
        data.empresaId = req.session.uuid;
        const URL_ATUALIZAR_PRODUTO = "https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/ProdutoPontos/Update";
        const options = {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        try {
            await new nodeFetch(URL_ATUALIZAR_PRODUTO, options).manageFetch();
            res.status(200).send({ response: "OK" });
        } catch (error) { console.log(error); res.send({}) }
    },
    clienteCPF: async (req, res) => {
        const data = req.body;

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            const URLPOST = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/Create`;
            await new nodeFetch(URLPOST, options).manageFetch();
            // fazer aqui a recuperação do cliente e devolver
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/${data.cpf}`;
            let cliente = await new nodeFetch(URL).manageFetch();
            // fazer a somatoria de pontos e devolver ao front
            let pontosInseridos = 0;
            let totalPontos = 0;
            cliente = new DateToRecent(cliente).getArr();
            cliente.forEach((cl, i) => {
                totalPontos += cl.pontos;
                if (i === 0) {
                    if (cl.isRoleta === false && cl.produtoDescricao === null) {
                        pontosInseridos = cl.pontos
                    }
                }
            });
            let clientePontos =
            {
                nomeCliente: cliente[cliente.length - 1].nomeCliente,
                totalPontos, pontosInseridos
            }
            return res.status(200).send(clientePontos)
        } catch (error) {
            // caso n enviou pontos tentar recuperar
            console.log(error)
            console.log(data)
            console.log('n enviado pontos')
        }
        try {
            console.log('chegou para tentar recuperar o cliente')
            const URL = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/${data.cpf}`;
            let cliente = await new nodeFetch(URL).manageFetch();
            let pontosInseridos = 0;
            let totalPontos = 0;
            cliente = new DateToRecent(cliente).getArr();
            cliente.forEach((cl, i) => {
                totalPontos += cl.pontos;
                if (i === 0) {
                    if (cl.isRoleta === false && cl.produtoDescricao === null) {
                        pontosInseridos = cl.pontos
                    }
                }
            });

            let clientePontos =
            {
                nomeCliente: cliente[cliente.length - 1].nomeCliente,
                totalPontos, pontosInseridos
            }
            return res.status(200).send(clientePontos)
        } catch (error) {
            console.log(error)
            console.log('cliente n existente')
            res.status(404).send([])
        }

    }
}