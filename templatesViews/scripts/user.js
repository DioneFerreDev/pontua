
let arrProdutos = [];
let produtoSelected = null;
document.addEventListener("DOMContentLoaded", () => {
    managerFunction();
});













function managerFunction() {
    onCloseWindow()
    maskMoney()
    touchList();
    mainList();
    maskCPF();
    onInserir();
    btnSalvarProduto();
    actionBtnOnOff()
    editUser();
    onTrocar();
    logUser();
}
async function sendPoints() {
    try {
        let pontos = document.getElementById("box-pontos").value;
        let cpf = document.getElementById("box-cpf").value;
        if (cpf === null) return;
        if (pontos === "") return
        pontos = pontos.replace(",", ".");
        cpf = cpf.replace(/\./g, "").replace(/-/g, "");
        const data = new calendario().time;
        pontos = Number(pontos);
        document.getElementById("box-pontos").value = "";
        document.getElementById("box-cpf").value = "";

        const URL_API_SEND_API = "api/send-points";
        const dados = { pontos, cpf, data };
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
        const isOk = await new GenerateFetch(URL_API_SEND_API, options, true);
        if (isOk.error) alert("CPF NÃO ENCONTRADO!!!");
    } catch (error) { console.log(error) }
}
function quit() {
    document.getElementById("quit").addEventListener("click", async e => {
        const isQuit = new confirmation("Deseja realmente sair do Painel de usuários?");
        if (isQuit.result) {
            // fazer aqui a remoção do token                        
            const data = await new GenerateFetch("api/logout");
            if (data.logout)
                window.location.href = "/";
            else
                alert("NÃO FOI POSSÍVEL FAZER O LOGOUT")
        }
    })
}
function mainList() {
    quit();
}
function logUser() {

    const salvar = document.getElementById("salvar-user");
    salvar.addEventListener("click", async e => {
        e.preventDefault();
        overlays("content-preload");
        const senha = $('#password').val();
        const nome = document.getElementById("name").value;
        const resenha = document.getElementById("re-password").value;
        const nivel = document.getElementById("nivel").value;
        let erros = [];

        // Verifica se a senha tem pelo menos 6 caracteres
        if (senha.length < 6) {
            erros.push("Pelo menos 6 caracteres.");
        }

        // // Verifica se a senha tem pelo menos uma letra maiúscula 
        // if (!/[A-Z]/.test(senha)) {
        //     erros.push("Pelo menos uma letra maiúscula.");
        // }

        // // Verifica se a senha tem pelo menos 3 letras minúsculas
        // var lowercaseCount = senha.match(/[a-z]/g);
        // if (!lowercaseCount || lowercaseCount.length < 3) {
        //     erros.push("Pelo menos três letras minúsculas.");
        // }

        // // Verifica se a senha tem pelo menos um número
        // if (!/\d/.test(senha)) {
        //     erros.push("Pelo menos um número.");
        // }

        // // Verifica se a senha tem pelo menos um caractere especial
        // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
        //     erros.push("Pelo menos um caractere especial.");
        // }

        // Exibe mensagens de erro se houver problemas
        if (erros.length > 0) {
            let msg = "A senha deve conter ..." + "\n"
            erros.forEach(err => msg += err + "\n");
            alert(msg)

            return false; // Impede o envio do formulário
        } else {
            // verificando se todos os campos foram devidamente preenchidos
            if (nome === "" || senha === "" || resenha === "" || nivel === "") {
                alert("É necessário preencher todos os campos!!!");
                return
            }
            // verificando se as duas senhas são idênticas
            if (senha !== resenha) {
                alert("As senhas são diferentes!!!");
                return
            }
            alert('Enviando formulário...');

            try {
                const dados = { user: nome, password: senha };
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                }
                const URL_API_USER = "/api/create-user";
                await new GenerateFetch(URL_API_USER, options);
                new resetarForm("form-user");
                overlays("content-preload", true);
                effectPannel(`usuario ${nome} registrado com sucesso!.`, "message-pannel", "user-title");
                await preencherTabUsers();
            } catch (error) { console.log(error) }
        }

    });


}
function buscarUsers() {
    console.log("ter q programar ainda")
}
function overlays(idOverlay, desapear = null) {
    const overlays = document.querySelectorAll(".overlay-preload");
    overlays.forEach(overlay => overlay.style.display = "none");
    if (desapear) return

    const chooseOverlay = document.getElementById(idOverlay);
    chooseOverlay.style.display = "block";
}
function touchList() {
    document.getElementById("produtos").addEventListener("click", async e => {
        let contents = document.querySelectorAll(".contents-logged");
        contents.forEach(content => content.style.display = "none");
        overlays("content-preload");
        document.querySelector(".produtos-content").style.display = "flex";

        document.querySelectorAll("li").forEach(el => el.classList.remove("choose"))
        document.getElementById("produtos").classList.add("choose")

        try {
            // puxar os produtos e atualizar a tabela pela primeira vez
            const produtos = await puxarProdutos();
            document.querySelector(".wrap-table-produtos").innerHTML = preencherTabProdutos(produtos);
            overlays("content-preload", true);
            btnDelProduto();
            btnEditlProduto()
            btnAtualisarProduto();
        } catch (error) { console.log(error) }


    })
    document.getElementById("send").addEventListener("click", async e => {
        let contents = document.querySelectorAll(".contents-logged");
        contents.forEach(content => content.style.display = "none");
        document.querySelector(".send-content").style.display = "flex";
        document.querySelectorAll("li").forEach(el => el.classList.remove("choose"))
        document.getElementById("send").classList.add("choose")
    })
    document.getElementById("pontos-produtos").addEventListener("click", async e => {
        let contents = document.querySelectorAll(".contents-logged");
        contents.forEach(content => content.style.display = "none");
        overlays("content-preload");
        document.querySelector(".ponto-produto").style.display = "flex";

        document.querySelectorAll("li").forEach(el => el.classList.remove("choose"))
        document.getElementById("pontos-produtos").classList.add("choose")

        try {
            const URL_API_PUXAR_PRODUTOS = "api/puxar-produtos";
            const produtos = await new GenerateFetch(URL_API_PUXAR_PRODUTOS);
            buildList(produtos);
            overlays("content-preload", true);
            onclickListPontoProduto()
        } catch (error) { console.log(error) }

    })
    document.getElementById("roleta").addEventListener("click", printarPainelRoleta)
    document.getElementById("clientes").addEventListener("click", async e => {
        let contents = document.querySelectorAll(".contents-logged");
        contents.forEach(content => content.style.display = "none");
        overlays("content-preload")
        document.querySelector(".clientes-content").style.display = "flex";
        await telaClientes();
        overlays("content-preload", true);
        document.querySelectorAll("li").forEach(el => el.classList.remove("choose"))
        document.getElementById("clientes").classList.add("choose")
    })
    document.getElementById("skip-side-bar").addEventListener("click", () => {
        const wEffect = 50;
        const sidebar = document.querySelector(".side-bar");
        const body = document.querySelector(".body-logged-section");
        const isBar = document.querySelectorAll(".i-side-bar");
        const sBF = document.querySelectorAll(".side-bar-full");
        const titleUser = document.querySelector(".title-user");
        sidebar.style.transition = "width 0.2s ease";
        body.style.transition = "width 0.2s ease";

        if (sidebar.clientWidth > wEffect) {
            isBar.forEach(isb => isb.style.display = "block");
            titleUser.style.fontSize = "12px";
            sBF.forEach(sbf => sbf.style.display = "none");
            sidebar.style.width = `${wEffect}px`;
            body.style.width = `calc(100% - ${wEffect}px)`;
        } else {
            titleUser.style.fontSize = "16px";
            isBar.forEach(isb => isb.style.display = "none");
            sBF.forEach(sbf => sbf.style.display = "block");
            sidebar.style.width = "25%";
            sidebar.style.maxWidth = "300px";
            const widthSide = sidebar.clientWidth;
            body.style.width = `calc(100% - ${widthSide}px)`;
        }

    })

}
async function onTrocar() {
    const btnTrocar = document.getElementById("btn-pontos-produtos");

    btnTrocar.addEventListener("click", async e => {
        e.preventDefault();
        overlays('content-preload');
        let ultCPF = document.getElementById("cliente-cpf").value;
        ultCPF = ultCPF.replace(/[\D+]/g, ''); // \D+ (todo valor não numérico)
        // ultCPF = ultCPF.replace(/[.-]/g,'');        

        if (ultCPF.length < 11) return

        if (ultCPF === "") { alert("É NECESSÁRIO LOGAR COM O CPF!!!"); return }
        const produtoStr = document.getElementById("trocar-hidden").value;

        if (produtoStr === "" || produtoStr === null) return
        const obj = JSON.parse(produtoStr);

        try {
            const URL_CLIENTE = "api/cliente";
            const info = { cpf: ultCPF };
            const optionsCliente = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            }
            let hisCliente = await new GenerateFetch(URL_CLIENTE, optionsCliente, true);
            if (hisCliente.length === 0) {
                alert(`Cliente de CPF ${ultCPF} não cadastrado!!!`);
                await overlays('content-preload', true);
                return
            }
            // fazer a verificação do nome aqui
            let nome = "";
            if (hisCliente[0].nomeCliente === null) {
                nome = prompt("Cliente não registrado o nome, registre seu nome agora:");
                const URL_API_CPF_NOME = "api/nome-cpf";
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: nome, cpf: ultCPF })
                }
                await new GenerateFetch(URL_API_CPF_NOME, options)
            }
            let totalPontos = 0;
            hisCliente.forEach(cl => totalPontos += cl.pontos);
            if (totalPontos < obj.pontos) {
                alert(`Infelizmente seus ${totalPontos} pontos são insuficientes para trocar pelo produto que vale ${obj.pontos} `);
                return;
            }
            if (!new confirmation(`Deseja realmente trocar ${obj.pontos} pontos por ${obj.produtoDescricao}?`).result) return

            const URL_API_TROCA = "api/trocar-pontos";
            const dados = {
                cpf: ultCPF,
                sku: obj.sku,
                produtoDescricao: obj.produtoDescricao
            }
            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
            await new GenerateFetch(URL_API_TROCA, options)
        } catch (error) { console.log(error) }

        // fazer a animação da messagem
        const pannelMessage = document.querySelector(".message-pannel-troca");
        const msg = document.getElementById("title-message-troca");
        msg.innerHTML = "Pontos trocados com Sucesso!!!";

        pannelMessage.style.opacity = 1;
        overlays('content-preload', true);
        new resetarForm("form-pontos-produtos");
        setTimeout(() => {
            pannelMessage.style.opacity = 0;
        }, 5000);
    })
}
function buildList(produtos) {
    const alt = document.querySelector(".wrap-pontos-produtos").clientHeight
    // const altbody = document.querySelector(".wrap-form-select-produto").clientHeight;    
    const ul = document.querySelector(".ul-list-pontos-produto");
    const list = produtos.map(produto =>
        `<li id=${produto.sku} class="li-ponto-produto">${produto.produtoDescricao}<input class="input-hidden" type="hidden" /> <span id="span" disabled class="span-pontos">${produto.pontos}</span></li>`
    ).join('');

    ul.innerHTML = list
    document.querySelectorAll(".li-ponto-produto").forEach((li, i) => {
        const hidden = li.querySelector(".input-hidden");
        const objStr = JSON.stringify(produtos[i]);
        hidden.value = objStr;
    })
    document.getElementById("wrap-pontos-produtos").style.height = `${alt - 55}px`;
}
function onclickListPontoProduto() {
    const lis = document.querySelectorAll(".li-ponto-produto");
    lis.forEach(li => {
        li.addEventListener("click", async e => {
            if (e.target.id === "span") return
            const valueHidden = e.target.querySelector(".input-hidden").value;
            const objStr = valueHidden;
            const obj = JSON.parse(objStr);

            // passar para o hidden form
            document.getElementById("trocar-hidden").value = objStr;
            document.getElementById("input-pontos-produto").value = obj.produtoDescricao;
        })
    })
}
async function puxarProdutos() {
    try {
        const URL_API_PUXAR_PRODUTOS = "api/puxar-produtos";
        const produtos = await new GenerateFetch(URL_API_PUXAR_PRODUTOS);
        arrProdutos = produtos;
        return produtos
    } catch (error) { console.log(error) }
}
async function telaClientes() {
    try {
        const URL_API_CLIENTES = "api/all-clientes";
        let clientes = await new GenerateFetch(URL_API_CLIENTES);
        clientes = dateToRecent(clientes)
        if (clientes.length === 0) return
        let wrapClientes = document.querySelector(".wrap-table-clientes");
        wrapClientes.innerHTML = await preencherTabClientes(clientes);
        // btnDel();
    } catch (error) { console.log(error) }
}
async function preencherTabUsers() {
    try {
        const URL_API_USERS = "api/all-users";
        const users = await new GenerateFetch(URL_API_USERS);
        const wrap = document.querySelector(".wrap-table-usuarios");
        const rows = users.map(user => {

            let admin = user.isAdmin ? "Adm" : "Colaborador";
            let userStr = JSON.stringify(user)

            return `
            <tr>
                <td>${user.user}</td>
                <td>${admin}</td>
                <td>${user.password}</td>
                <td><i class="fa-solid fa-pen-to-square" onclick="btnEditUser(this)"><input id="hidden-user" type="hidden" value='${userStr}' /></i></td>
                <td><i class="fa-solid fa-trash-can" onclick="delUser(this)"><input id="hidden-user" type="hidden" value='${userStr}' /></i></td>
            </tr>            
        `
        }).join('');

        const table = `<table>
        <thead>
            <th>USER</th>
            <th>NÍVEL</th>
            <th>SENHA</th>
            <th>EDIT</th>
            <th>DELETE</th>
        </thead>
        <tbody>${rows}</tbody>
        </table>
        `
        wrap.innerHTML = table;
    } catch (error) { console.log(error) }
}
function maskCPF() {
    $('#cpf-cliente').mask('000.000.000-00', { reverse: true });
    $('#cliente-cpf').mask('000.000.000-00', { reverse: true });
    $('#box-cpf').mask('000.000.000-00', { reverse: true });
}
async function procurarMovimentacoesCliente(cpf) {
    if (cpf.length === 0) {
        telaClientes();
        return
    }
    if (cpf.length !== 11) return
    const isValid = TestaCPF(cpf)
    if (!isValid) return

    try {
        const URL_API_CLIENTE = "api/cliente";
        const options = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cpf })
        }
        let cliente = await new GenerateFetch(URL_API_CLIENTE, options, true);
        cliente = dateToRecent(cliente)
        let pontos = 0;
        cliente.forEach(cl => pontos += Number(cl.pontos));
        const tab = preencherTabClientes(cliente)
        let wrapClientes = document.querySelector(".wrap-table-clientes");
        wrapClientes.innerHTML = tab;
        effectPannel(`cliente com total ${pontos} pontos.`, "message-cliente", "title-message-cliente");
    } catch (error) { console.log(error) }
}
function onInserir() {
    const cpfCliente = document.getElementById("cpf-cliente");
    cpfCliente.addEventListener("keyup", e => {
        let cpf = e.target.value;
        cpf = cpf.replace(/\./g, "").replace(/-/g, "");
        procurarMovimentacoesCliente(cpf);
    })
}
function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}
function dateToRecent(cliente) {
    function parseDates(str) {
        const parts = str.split(/[\s/:]/);
        // ano, mês -1, dia, hora,minuto, segundo
        if (parts.length === 6)
            return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
        return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
    }
    cliente.sort((a, b) => {
        const dateA = parseDates(a.data)
        const dateB = parseDates(b.data)

        return dateB - dateA
    });

    return cliente
}
function btnDel(e) {
    const isDel = new confirmation(`Deseja realmente deletar o cliente ${e.id}? Os dados serão permanentemente perdidos.`);
    const pai = e.parentElement // encontrando o pai  
    const movimentation = pai.querySelector(".hidden-movimentation").value;
    const movimentationObj = JSON.parse(movimentation);
    let data = `${movimentationObj.dataDia} ${movimentationObj.dataHora}`;
    if (isDel.result) deletarCliente(e.id, data);
}
function btnDelProduto() {
    const btnDel = document.querySelectorAll(".del-produto");
    btnDel.forEach(btn => {
        btn.addEventListener("click", async e => {
            overlays("content-preload");
            const id = e.target.id
            const produto = arrProdutos.filter(pr => pr.sku === e.target.id)
            const descricao = produto[0].produtoDescricao
            const isDel = new confirmation(`Deseja realmente deletar ${descricao}? Os dados serão permanentemente perdidos.`);
            if (isDel.result) await deletarProduto(id, descricao);
            new resetarForm("manage-produto");
            overlays("content-preload", true);
        });
    });
}
function btnEditlProduto() {
    const btnDel = document.querySelectorAll(".edit-produto");
    btnDel.forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.id;
            const produto = arrProdutos.filter(pr => pr.sku === e.target.id)[0];

            // inserir os valores nos campos 
            document.getElementById("produto").value = produto.produtoDescricao;
            document.getElementById("pontos-produto").value = produto.pontos;
            document.getElementById("sku").value = produto.sku;

            // inversão de botoes
            document.getElementById("salvar-produto").style.display = "none";
            document.getElementById("atualisar-produto").style.display = "block";
        });
    });
}
async function deletarProduto(sku, descricao) {
    try {
        const URL_API_DEL_PRODUTO = "api/delete-produto";
        const options = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sku, descricao })
        }
        await new GenerateFetch(URL_API_DEL_PRODUTO, options);

        const produtos = await puxarProdutos();
        document.querySelector(".wrap-table-produtos").innerHTML = preencherTabProdutos(produtos);
        effectPannel(`cliente deletado com sucesso!!!`, "message-cliente", "title-message-cliente");
        btnDelProduto();
        btnEditlProduto();
        btnAtualisarProduto();
    } catch (error) { console.log(error) }
}
async function deletarCliente(cpf, data) {

    try {
        const URL_API_DEL_USER = "api/delete-Cliente";
        const dados = { cpf, data }
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
        await new GenerateFetch(URL_API_DEL_USER, options);
        telaClientes();
        effectPannel(`cliente deletado com sucesso!!!`, "message-cliente", "title-message-cliente");
    } catch (error) { console.log(error) }
}

function effectPannel(message, classPannel, idTitle) {
    const pannel = document.querySelector(`.${classPannel}`);
    const title = document.getElementById(idTitle);
    title.innerHTML = message;
    pannel.style.opacity = 1
    setTimeout(() => {
        pannel.style.opacity = 0
    }, 5000);
}
// produtos
async function btnSalvarProduto() {
    const salvar = document.getElementById("salvar-produto");

    salvar.addEventListener("click", async e => {
        e.preventDefault();
        overlays("content-preload");
        const produto = document.getElementById("produto").value;
        let pontos = document.getElementById("pontos-produto").value
        pontos = Number(pontos)
        const sku = document.getElementById("sku").value

        if (produto === "" && pontos === 0 && sku === "" || pontos === "") return

        const data = new calendario().time
        try {
            const URL_SAVE_PRODUTO = "api/salvar-produto";
            const dados = { sku, produtoDescricao: produto, data, pontos, isRoleta: false };
            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
            await new GenerateFetch(URL_SAVE_PRODUTO, options);
            overlays("content-preload", true);
            new resetarForm("manage-produto")

            // puxar todos produtos e atualizar
            const produtos = await puxarProdutos();
            document.querySelector(".wrap-table-produtos").innerHTML = preencherTabProdutos(produtos);
            btnDelProduto();
            btnEditlProduto()
            btnAtualisarProduto();
        } catch (error) { console.log(error) }
    })
}
function btnAtualisarProduto() {
    const salvar = document.getElementById("atualisar-produto");

    // mudar a lógica
    salvar.addEventListener("click", async e => {
        e.preventDefault();
        overlays("content-preload");
        const produto = document.getElementById("produto").value;
        let pontos = document.getElementById("pontos-produto").value
        pontos = Number(pontos)
        const hidden = document.getElementById("hidden-update-produto");
        let sku = hidden.value;
        sku = JSON.parse(sku);
        sku = sku.sku;

        if (produto === "" && pontos === 0 && sku === "" || pontos === "") return
        const data = new calendario().time;
        const dadosProduto = arrProdutos.filter(pr => pr.sku === sku)[0];

        try {
            const URO_API_UPDATE_PRODUTO = "api/update-produto";
            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sku, produtoDescricao: produto, data, pontos, isRoleta: dadosProduto.isRoleta })
            }
            await new GenerateFetch(URO_API_UPDATE_PRODUTO, options);
            overlays("content-preload", true);
            new resetarForm("manage-produto");
            hidden.value = "";
            document.getElementById("atualisar-produto").style.display = "none";
            document.getElementById("salvar-produto").style.display = "block";

            // puxar todos produtos e atualizar
            const produtos = await puxarProdutos();
            document.querySelector(".wrap-table-produtos").innerHTML = preencherTabProdutos(produtos);
            btnDelProduto();
            btnEditlProduto()
            btnAtualisarProduto();
        } catch (error) { console.log(error) }
    })
}
function preencherTabProdutos(produtos) {
    produtos = dateToRecent(produtos);
    produtos = produtos.map(pr => {
        const parts = pr.data.split(/[\s]/);
        return { sku: pr.sku, produtoDescricao: pr.produtoDescricao, dataDia: parts[0], dataHora: parts[1], pontos: pr.pontos }
    })
    tbodyProdutos = produtos.map(produto =>
        `
        <tr>
            <td>${produto.sku}</td>
            <td>${produto.produtoDescricao}</td>
            <td>${produto.dataDia}</td>
            <td>${produto.dataHora}</td>
            <td>${produto.pontos}</td>
            <td><i id=${produto.sku} sku=${produto.produtoDescricao} class="fa-solid fa-trash-can del-produto"></i></td>
            <td><i id=${produto.sku} value=${produto.produtoDescricao} class="fa-regular fa-pen-to-square edit-produto" onClick='sendProductHidden(this)'></i></td>
        </tr>        
        `
    ).join('');

    let tab =
        `<table>
                <thead>      
                    <th>COD.</th>              
                    <th>PRODUTO</th>
                    <th>DIA</th>
                    <th>HORA</th>
                    <th>PONTOS</th>
                    <th>DEL</th>
                    <th>EDIT</th>
                </thead>
                <tbody>${tbodyProdutos}</tbody>
            </table>
    `
    matchProdutos();
    return tab
}
async function drawRoleta() {
    const canvas = document.getElementById("canvas");
    let size = (window.innerWidth * 0.366);
    size = (size < 450) ? 500 : size;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    const width = document.getElementById("canvas").width
    const height = document.getElementById("canvas").height
    const centerX = width / 2
    const centerY = height / 2
    const radius = width / 2;
    const triangle = document.querySelector(".triangle");
    triangle.style.right = `-${width * 0.52}px`

    // simulando back cadastrado os produtos
    let items = await puxarProdutos();
    items = items.filter(pr => pr.isRoleta === true);
    if (items.length <= 1) return
    // let items = ["caca-cola", "fanta", "500g fritas", "Açaí 500ml", "cerveja", "sprite", "cachorro-quente", "xtudo", "xsalada"];
    let currentDeg = 0;
    let step = 360 / items.length;
    let colors = [];
    for (let i = 0; i < items.length + 1; i++) {
        colors.push(randonColors());
    }
    function createWheels() {
        step = 360 / items.length;
        colors = [];
        for (let i = 0; i < items.length + 1; i++) {
            colors.push(randonColors())
        }
    }

    draw();

    function randonColors() {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);

        return { r, g, b }
    }
    function easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2);
    }
    function getPercent(input, min, max) {
        return (((input - min) * 100) / (max - min)) / 100
    }
    function toRad(deg) {
        return deg * (Math.PI / 180)
    }
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function draw() {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
        ctx.fillStyle = `rgb(${33},${33},${33})`;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        let startDeg = currentDeg;
        for (let i = 0; i < items.length; i++, startDeg += step) {
            let endDeg = startDeg + step;

            color = colors[i];
            let colorStyle = `rgb(${color.r},${color.g},${color.b})`;


            ctx.beginPath();
            rad = toRad(360 / step);
            ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
            let colorStyle2 = `rgb(${color.r - 50},${color.g - 50},${color.b - 50})`
            ctx.fillStyle = colorStyle2;
            ctx.lineTo(centerX, centerY);
            ctx.fill();


            ctx.beginPath();
            rad = toRad(360 / step);
            ctx.arc(centerX, centerY, radius - 10, toRad(startDeg), toRad(endDeg));
            ctx.fillStyle = colorStyle;
            ctx.lineTo(centerX, centerY);
            ctx.fill();


            if (i === items.length - 1) {
                for (let index = 0; index < items.length; index++) {
                    let degPino = startDeg + (step * index); // Calcula o ângulo inicial do pino
                    let radPino = toRad(degPino);

                    const centerXPino = centerX + (radius - 5) * Math.cos(radPino); // Calcula a coordenada X do pino
                    const centerYPino = centerY + (radius - 5) * Math.sin(radPino); // Calcula a coordenada Y do pino

                    const gradiente = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                    ctx.beginPath();
                    ctx.arc(centerXPino, centerYPino, 5, 0, 2 * Math.PI, false);
                    gradiente.addColorStop(0.5, 'red');
                    gradiente.addColorStop(0.5, 'yellow');
                    ctx.fillStyle = gradiente;
                    // ctx.strokeStyle = "#38b507"
                    // ctx.strokeStyle = "#5302f5";
                    ctx.strokeStyle = "red"
                    ctx.fill();
                    ctx.stroke()
                }
            }

            // text
            ctx.save();
            ctx.translate(centerX, centerY)
            ctx.rotate(toRad(startDeg + endDeg) / 2);
            ctx.textAlign = "center";

            if (color.r > 150 || color.g > 150 || color.b > 150) {
                ctx.fillStyle = "#000";
            } else {
                ctx.fillStyle = "#fff";
            }

            const font = width * 0.036
            ctx.font = `bold ${font}px montserrat`;
            const textX = width * 0.26;
            const textY = width * 0.02
            ctx.fillText(items[i].produtoDescricao, textX, textY);
            ctx.restore();

            if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
                console.log(items[i].produtoDescricao)
            }
        }
    }

    let speed = 0;
    let maxRotation = randomRange(360 * 3, 360 * 6);
    let pause = false;

    function animate() {
        if (pause) return

        document.querySelector(".triangle").style.transform = "rotate(-10deg)";

        speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
        if (speed < 2) {
            document.querySelector(".triangle").style.transition = "transform 0.4s ease";
            document.querySelector(".triangle").style.transform = "rotate(-5deg)"
        }
        if (speed < 0.005) {
            speed = 0;
            pause = true;
            document.querySelector(".triangle").style.transition = "transform 0.5s ease";
            document.querySelector(".triangle").style.transform = "rotate(0deg)";
        }
        currentDeg += speed;
        draw();
        window.requestAnimationFrame(animate);

    }
    function spin() {
        if (speed !== 0) {
            return
        }
        currentDeg = 0;
        maxRotation = randomRange(360 * 3, 360 * 6);
        pause = false;
        window.requestAnimationFrame(animate);
    }

    document.getElementById("canvas").addEventListener("click", () => {
        // spin();
    })
}
function matchProdutos() {

    document.getElementById("produto").addEventListener("keyup", async e => {
        const arr = arrProdutos.map(pr => pr.produtoDescricao);
        new autoComplete(arr, "produto");
    })
}
function btnEditUser(el) {
    const userStr = el.querySelector("#hidden-user").value;
    const user = JSON.parse(userStr);

    // mudar o botoes
    document.getElementById("salvar-user").style.display = "none";
    document.getElementById("editar-user").style.display = "block";

    document.getElementById("name").value = user.user
    document.getElementById("password").value = user.password
    document.getElementById("re-password").value = user.password;
    document.getElementById("hidden-update-user").value = userStr;

    let isAdm = (user.isAdmin === true) ? "admin" : "colaborador";
    // document.getElementById("nivel").value = "";
    // const option = select.querySelector('option[value="' + isAdm + '"]');
    // console.log(option, isAdm)
    // select.value = option

}
async function delUser(el) {
    const userStr = el.querySelector("#hidden-user").value;
    const user = JSON.parse(userStr);
    if (!new confirmation(`Deseja realmente deletar o usuário ${user.user}`).result) return

    overlays("content-preload");
    try {
        // voltar aqui user
        const URL_API_DEL = "api/delete-user";
        const dados = { user: user.user, password: user.password };
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
        await new GenerateFetch(URL_API_DEL, options);
        new resetarForm("form-user");
        overlays('content-preload', true);
        effectPannel(`usuario ${user.user} deletado com sucesso!.`, "message-pannel-user", "user-title");
        await preencherTabUsers();
    } catch (error) { console.log(error) }
}
async function editUser() {

    const btnEditUser = document.getElementById("editar-user");

    btnEditUser.addEventListener("click", async e => {
        e.preventDefault();
        overlays("content-preload");
        const name = document.getElementById("name").value
        const password = document.getElementById("password").value
        const repassword = document.getElementById("re-password").value
        let oldUser = document.getElementById("hidden-update-user").value;
        oldUser = JSON.parse(oldUser);

        let admin = document.getElementById("nivel").value;
        console.log(admin)
        admin = (admin === "admin") ? true : false;
        if (password !== repassword) {
            alert("As senhas são diferentes");
            return
        }
        if (name === "" || password === "" || admin === "") {
            alert("Todos os campos precisam ser preenchidos!!!");
            return
        }

        try {
            // voltar aqui user
            const URL_API_UPDATE_USER = "api/update-user";
            const dados = { user: name, password: password, admin, oldUser: oldUser.user, oldPassword: oldUser.password };
            const options = {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
            await new GenerateFetch(URL_API_UPDATE_USER, options);
            new resetarForm("form-user");
            overlays("content-preload", true);
            effectPannel(`usuario ${name} atualizado com sucesso!.`, "message-pannel", "user-title");
            await preencherTabUsers();

            document.getElementById("salvar-user").style.display = "block";
            document.getElementById("salvar-user").style.display = "none";

        } catch (error) { console.log(error) }
    })


}
function maskMoney() {
    $('#box-pontos').mask("#.##0,00", { reverse: true });
}
function onCloseWindow() {
    window.addEventListener("unload", () => {
        // localStorage.removeItem("user");
        // localStorage.removeItem("admin");
    })
}
function sendProductHidden(el) {
    let sku = { sku: el.id };
    sku = JSON.stringify(sku);
    const hidden = document.getElementById("hidden-update-produto");
    hidden.value = sku;
}

