let ultCPF = "";

document.addEventListener("DOMContentLoaded", () => {
    playUserHome();
})









function validationUser() {
    const isLogged = localStorage.getItem("admin");
    if (isLogged === "true")
        return
    window.location.href = "../home.html";
}
function playUserHome() {
    $('#cpf').mask('000.000.000-00', { reverse: true });
    onInserir()
    roleta();
    pontosProdutos()
    closePontosProdutos();
}
function roleta() {
    const roleta = document.getElementById("roleta");
    roleta.addEventListener("click", () => { actionRoleta(); })
}
function actionRoleta() {
    const overlayWheel = document.getElementById("wheel-overlay");
    overlayWheel.style.display = "flex";
    drawRoleta();

    const overlayX = document.querySelector(".wrap-x");
    overlayX.addEventListener("click", () => {
        document.getElementById("wheel-overlay").style.display = "none";
        window.location.href = window.location.href;
    })
}
function pontosProdutos() {
    //  voltar aqui
    const pannelprodutos = document.getElementById("pontos-produtos");
    pannelprodutos.addEventListener("click", async () => {
        try {
            const URL_API_PRODUTOS = "api/puxar-produtos-cliente";
            const produtos = await new GenerateFetch(URL_API_PRODUTOS);
            buildList(produtos);
            // onclickListPontoProduto()            
            const overlayPontosProdutos = document.getElementById("pontos-produtos-overlay");
            overlayPontosProdutos.style.display = "flex";
        } catch (error) { console.log(error); window.location.href = "/unAuth" }
    })

    const overlayX = document.querySelector(".wrap-x");
    overlayX.addEventListener("click", () => {
        document.getElementById("wheel-overlay").style.display = "none";
    })
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

function buildList(produtos, pontosClientes) {
    const ul = document.querySelector(".ul-list-pontos-produto");
    const list = produtos.map(produto =>
        `<li id=${produto.sku} class="li-ponto-produto">${produto.produtoDescricao}<input class="input-hidden" type="hidden" /> <span id="span" disabled class="span-pontos">${produto.pontos}</span></li>`
    ).join('');

    ul.innerHTML = list
    document.querySelectorAll(".li-ponto-produto").forEach((li, i) => {
        const hidden = li.querySelector(".input-hidden");
        const objStr = JSON.stringify(produtos[i])
        hidden.value = objStr;
    })
}
function closePontosProdutos() {
    document.getElementById("close-pontos-produtos").addEventListener("click", () => {
        const overlayPontosProdutos = document.getElementById("pontos-produtos-overlay");
        overlayPontosProdutos.style.display = "none";
        window.location.href = window.location.href;
    })
}
function shuffleItems(arrItems) {

    function randomComparator() {
        return Math.random() - 0.5
    }
    // aqui estou copiando o msm arr para n modificar o original, passando par 0 para o slice
    const shuffledItems = arrItems.slice();
    shuffledItems.sort(randomComparator);
    return shuffledItems;
}
async function drawRoleta() {
    const audio = new Audio("./sounds/roleta.mp3");
    const audioAplausos = new Audio("./sounds/aplausos.mp3");
    const canvas = document.getElementById("canvas");
    // factor antigo 0.366
    const wFactor = 0.7;
    let size = (window.innerWidth * wFactor);
    size = (size > 500) ? 500 : size;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;
    const triangle = document.querySelector(".triangle");
    triangle.style.right = `-${width * 0.52}px`;
    let winnerProduct = '';

    // Puxando do back os produtos    
    let itemsoBJ = await puxarProdutos();
    itemsoBJ = itemsoBJ.filter(it => it.isRoleta);
    let items = itemsoBJ.map(it => it.produtoDescricao);
    items = shuffleItems(items);
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
            colors.push(randonColors());
        }
    }

    draw();

    function randonColors() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return { r, g, b };
    }

    function easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2);
    }

    function getPercent(input, min, max) {
        return (((input - min) * 100) / (max - min)) / 100;
    }

    function toRad(deg) {
        return deg * (Math.PI / 180);
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

            let color = colors[i];
            let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
            let colorStyle2 = `rgb(${color.r - 50},${color.g - 50},${color.b - 50})`;
            ctx.fillStyle = colorStyle2;
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 10, toRad(startDeg), toRad(endDeg));
            ctx.fillStyle = colorStyle;
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            if (i === items.length - 1) {
                for (let index = 0; index < items.length; index++) {
                    let degPino = startDeg + (step * index);
                    let radPino = toRad(degPino);
                    const centerXPino = centerX + (radius - 5) * Math.cos(radPino);
                    const centerYPino = centerY + (radius - 5) * Math.sin(radPino);
                    const gradiente = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                    ctx.beginPath();
                    ctx.arc(centerXPino, centerYPino, 5, 0, 2 * Math.PI, false);
                    gradiente.addColorStop(0.5, 'red');
                    gradiente.addColorStop(0.5, 'yellow');
                    ctx.fillStyle = gradiente;
                    ctx.strokeStyle = "red";
                    ctx.fill();
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(toRad(startDeg + endDeg) / 2);
            ctx.textAlign = "center";

            if (color.r > 150 || color.g > 150 || color.b > 150) {
                ctx.fillStyle = "#000";
            } else {
                ctx.fillStyle = "#fff";
            }

            const font = width * 0.036;
            ctx.font = `bold ${font}px montserrat`;
            const textX = width * 0.26;
            const textY = width * 0.02;
            ctx.fillText(items[i], textX, textY);
            ctx.restore();

            if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
                document.getElementById("winner").innerHTML = items[i];
                winnerProduct = items[i];
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
            document.querySelector(".triangle").style.transform = "rotate(-5deg)";
        }
        if (speed < 0.005) {
            speed = 0;
            pause = true;

            // definido vencedor 
            //usando confeti

            winnerProduct = itemsoBJ.filter(it => it.produtoDescricao === winnerProduct)[0];
            registrarRoleta(winnerProduct);
            document.querySelector(".triangle").style.transition = "transform 0.5s ease";
            document.querySelector(".triangle").style.transform = "rotate(0deg)";

            document.getElementById("confetti").style.display = "block"
            const jsConfetti = new JSConfetti()

            const wItem = document.getElementById("winner");
            let troca = true;
            let times = 0
            let idInterval = setInterval(frame, 500);
            jsConfetti.addConfetti();
            audioAplausos.currentTime = 0.5;
            // audio.playbackRate = 0.15;
            audioAplausos.play()
                .catch(error => console.log("não foi possível tocar o audio,:", error))
            function frame() {
                times++
                if (troca) {
                    wItem.style.color = "red"
                    wItem.style.fontWeight = "bold"
                    wItem.style.fontSize = "25px"
                } else {
                    wItem.style.color = "white"
                    wItem.style.fontWeight = "regular"
                    wItem.style.fontSize = "18px"
                }
                troca = !troca
                jsConfetti.addConfetti()
                if (times === 5) {
                    // fazer simulação de print
                    // html2canvas(document.body).then(canvas => {
                    //     // Criar link para download
                    //     const link = document.createElement("a");
                    //     link.download = "premio.png";
                    //     link.href = canvas.toDataURL("image/png");

                    //     setTimeout(() => {
                    //         if (new confirmation("Gostaria de compartilhar seu prêmio nas suas redes sociais?").result) {
                    //             link.click();
                    //         }
                    //     }, 2500);
                    // }).catch(err => { console.error("Erro ao capturar a página:", err) });
                }
                if (times === 6) clearInterval(idInterval)
            }

        }
        currentDeg += speed;
        draw();
        window.requestAnimationFrame(animate);
    }

    function spin() {
        if (speed !== 0) {
            return;
        }
        currentDeg = 0;
        maxRotation = randomRange(360 * 3, 360 * 6);
        pause = false;
        window.requestAnimationFrame(animate);
    }

    document.getElementById("canvas").addEventListener("click", () => {
        let clPontos = document.getElementById("input-hidden-cliente").value;
        clPontos = JSON.parse(clPontos)
        if (ultCPF === "" || ultCPF === null || clPontos.pontosInseridos < 500) {
            // voltar aqui para fazer a validação do valor mínimo para jogar a roleta
            alert("É PRECISO ATINGIR VALOR MÍNIMO E LOGAR COM SEU CPF PARA JOGAR!!");
            return;
        }
        audio.currentTime = 1.5;
        // audio.playbackRate = 0.15;
        audio.play()
            .catch(error => console.log("não foi possível tocar o audio,:", error))
        spin();
    });
}
async function registrarRoleta(winnerProduct) {
    const pontosRoleta = 0;
    const pontosStr = document.getElementById("input-hidden-cliente").value;
    let objCliente = JSON.parse(pontosStr);
    if (pontosStr === "" || pontosStr === null) return
    const pontosObj = JSON.parse(pontosStr);
    // if (pontosObj.totalPontos < pontosRoleta) {
    //     alert(`Infelizmente seus ${pontosObj.totalPontos} pontos são insuficientes para jogar na roleta no momento!!!`);
    //     return;
    // }
    // fazer a verificação aqui
    // aqui roleta

    try {
        const URL_API_ROLETA = "api/cliente-roleta";
        const dados = {
            cpf: ultCPF,
            sku: winnerProduct.sku,
            produtoDescricao: winnerProduct.produtoDescricao,
            pontos: 0
        }
        const options = {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
        new GenerateFetch(URL_API_ROLETA, options);
        console.log('registrado com sucesso')
        ultCPF = "";
    } catch (error) { console.log(error) }
}
async function puxarProdutos() {
    try {
        const URL_API_PUXAR_PRODUTOS = "api/puxar-produtos-cliente";
        const produtos = await new GenerateFetch(URL_API_PUXAR_PRODUTOS);
        // arrProdutos = produtos;
        if (produtos.status === '401') window.location.href = "/unAuth";
        return produtos
    } catch (error) { console.log(error); window.location.href = "/unAuth" }
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
function onInserir() {
    const cpf = document.getElementById("cpf");
    cpf.addEventListener("keyup", e => {
        let cpfUser = e.target.value;
        cpfUser = cpfUser.replace(/\./g, "").replace(/-/g, "");
        if (cpfUser.length === 11) {
            if (!TestaCPF(cpfUser)) {
                alert("CPF INVÁLIDO!!!");
                ultCPF = cpfUser
            } else {
                if (ultCPF !== cpfUser) inserirAlterarCPF(cpfUser)

                ultCPF = cpfUser
            }
        } else {
            document.getElementById("input-hidden-cliente").value = "";
            document.getElementById("pontos-now").style.opacity = 0;
            document.getElementById("pontos-atuais").style.opacity = 0;
            ultCPF = "";
        }

    })
}
async function inserirAlterarCPF(cpf) {
    try {
        // RECOMEÇAR
        let dados = { cpf: cpf };
        const URL_API_CLIENTE = "api/cliente-CPF";
        const options = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
        const cliente = await new GenerateFetch(URL_API_CLIENTE, options, true);
        if (cliente.length === 0) {
            ultCPF = "";
            return alert('cliente n existente');
        }
        if (cliente.expired === true) window.location.href = cliente.url;
        const msg = (cliente.nomeCliente === null) ? `Você tem atualmente ${cliente.totalPontos} pontos no total!!` : `${cliente.nomeCliente} tem atualmente ${cliente.totalPontos} pontos no total!!`;
        let pontosTela = document.getElementById("pontos-atuais");
        pontosTela.innerHTML = msg
        pontosTela.style.opacity = 1;
        // Fazer aqui uma simulação de valor estipulado para jogar a roleta     
        if (cliente.pontosInseridos >= 500) {
            if (new confirmation(`Sua compra atingiu o valor mínimo para jogar a roleta. Jogue de graça e ganhe algo por conta da casa.`).result) {
                let clPontos = document.getElementById("input-hidden-cliente");
                let strPontos = { pontosInseridos: cliente.pontosInseridos };
                strPontos = JSON.stringify(strPontos);
                clPontos.value = strPontos;
                actionRoleta();
            }
        }
        // ultCPF = "";
    } catch (error) { console.log(error) }
}
function receivePontos(pontos) {
    const pontosnow = document.getElementById("pontos-now")
    pontosnow.innerHTML = (pontos);
    pontosnow.style.opacity = 1;
}
