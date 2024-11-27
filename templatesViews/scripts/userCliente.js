let pontos = 500;
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
    // verificar a validação do token
    // validarToken();
    // validationUser();
    // receivePontos();
    $('#cpf').mask('000.000.000-00', { reverse: true });
    onInserir()
    roleta();
    pontosProdutos()
    closePontosProdutos();
    // onTrocar();
    // drawRoleta();

}
async function validarToken() {
    // const url = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    // extraindo token
    if (token === null) {
        // window.location.href = "./unAuth.ejs"; 
        window.location.href = "/unAuth";
        return
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const data = await JSON.parse(jsonPayload);
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    try {
        const dados = { cnpj: data.empresaCNPJ, nome: data.empresaNome }

        const options_Cliente = {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dados)
        }
        // empresa autorizada ent setar o cookie do cliente
        const URL_TOKEN_CLIENTE = "/cliente/AuthEmpresa/ClienteToken";
        const res2 = await new GenerateFetch(URL_TOKEN_CLIENTE, options_Cliente);
        const overlay = document.querySelector(".overlay-auth");
        overlay.style.display = "none";

        console.log(res2);
        console.log("token do cliente com sucesso");



        // expirar o token
        setTimeout(async () => {
            console.log('verificar o token do usuário aqui');
            //simulando verificação do token
            const URL_VALIDATE_TOKEN = "/cliente/AuthEmpresa/validarToken";
            const validate_options = {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            const res3 = await new GenerateFetch(URL_VALIDATE_TOKEN, validate_options);
            console.log(res3)
        }, 1000);
        // if (res == 200) {
        //     console.log(res);
        //     console.log("token validado da empresa");


        // } else {
        //     // empresa não autorizada reencaminhar para outra página
        //     console.log(res);
        //     console.log("token n válido da empresa");
        //     // window.location.href = "./pages/unAuth.html";
        // }
    } catch (error) {
        console.log(error)
        // window.location.href = "./unAuth";
    }

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
            let produtos = await puxarProdutos();
            if (produtos.expired) window.location.href = produtos.url;
            console.log(produtos)
            buildList(produtos);
            // onclickListPontoProduto()
            const overlayPontosProdutos = document.getElementById("pontos-produtos-overlay");
            overlayPontosProdutos.style.display = "flex";
        } catch (error) { console.log(error) }
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
// async function onTrocar() {
//     const btnTrocar = document.getElementById("btn-pontos-produtos");
//     btnTrocar.addEventListener("click", e => {
//         e.preventDefault();

//         if (ultCPF === "") { alert("É NECESSÁRIO LOGAR COM O CPF!!!"); return }
//         const produtoStr = document.getElementById("trocar-hidden").value;

//         if (produtoStr === "" || produtoStr === null) return
//         const obj = JSON.parse(produtoStr);
//         let cliente = document.getElementById("input-hidden-cliente").value;
//         let objCliente = JSON.parse(cliente);

//         if (objCliente.totalPontos < obj.pontos) {
//             alert(`Infelizmente seus ${objCliente.totalPontos} pontos são insuficientes para trocar pelo produto que vale ${obj.pontos} `);
//             return;
//         }
//         if (!new confirmation(`Deseja realmente trocar ${obj.pontos} pontos por ${obj.produtoDescricao}?`).result) return

//         // voltar aqui e fazer essa troca no back
//         console.log(obj);
//         try {
//             const URL_TROCA = `https://bwa45br1c7.execute-api.us-east-1.amazonaws.com/v1/Cliente/TrocarPontos`;
//             const dados = {
//                 cpf: ultCPF,
//                 sku: obj.sku,
//                 produtoDescricao: obj.produtoDescricao
//             }
//             const options = {
//                 method: 'POST',
//                 headers: {
//                     'Accept': '*/*',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(dados)
//             }
//             new GenerateFetch(URL_TROCA, options)
//         } catch (error) { console.log(error) }

//         // fazer a animação da messagem
//         const pannelMessage = document.querySelector(".message-pannel");
//         const msg = document.getElementById("title-message");
//         msg.innerHTML = "Pontos trocados com Sucesso!!!";

//         pannelMessage.style.opacity = 1;

//         setTimeout(() => {
//             pannelMessage.style.opacity = 0;
//         }, 5000);
//     })
// }
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
    if (itemsoBJ.expired) window.location.href = itemsoBJ.url;
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
        if (pause) return;

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
            registrarRoleta(ultCPF, winnerProduct);
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
// async function drawRoleta() {
//     const audio = new Audio("../sounds/roleta.mp3");
//     const canvas = document.getElementById("canvas");
//     let size = (window.innerWidth * 0.366);
//     size = (size < 450) ? 500 : size;
//     const ctx = canvas.getContext("2d");
//     canvas.width = size;
//     canvas.height = size;
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const radius = width / 2;
//     const triangle = document.querySelector(".triangle");
//     triangle.style.right = `-${width * 0.52}px`;
//     let winnerProduct = '';

//     // Puxando do back os produtos    
//     let itemsoBJ = await puxarProdutos();
//     itemsoBJ = itemsoBJ.filter(it => it.isRoleta);
//     let items = itemsoBJ.map(it => it.produtoDescricao);
//     items = shuffleItems(items);
//     let currentDeg = 0;
//     let step = 360 / items.length;
//     let colors = [];
//     for (let i = 0; i < items.length + 1; i++) {
//         colors.push(randonColors());
//     }
//     function isAngleCloseToTarget(angle, targetDeg, tolerance = 0.5) {
//         // Normaliza os ângulos para o intervalo [0, 360)
//         angle = ((angle % 360) + 360) % 360;
//         targetDeg = ((targetDeg % 360) + 360) % 360;

//         // Verifica se a diferença entre o ângulo atual e o alvo está dentro da tolerância
//         return Math.abs(angle - targetDeg) < tolerance || Math.abs((angle - targetDeg + 360) % 360) < tolerance;
//     }
//     function createWheels() {
//         step = 360 / items.length;
//         colors = [];
//         for (let i = 0; i < items.length + 1; i++) {
//             colors.push(randonColors());
//         }
//     }

//     draw();

//     function randonColors() {
//         let r = Math.floor(Math.random() * 255);
//         let g = Math.floor(Math.random() * 255);
//         let b = Math.floor(Math.random() * 255);
//         return { r, g, b };
//     }

//     function easeOutSine(x) {
//         return Math.sin((x * Math.PI) / 2);
//     }

//     function getPercent(input, min, max) {
//         return (((input - min) * 100) / (max - min)) / 100;
//     }

//     function toRad(deg) {
//         return deg * (Math.PI / 180);
//     }

//     function randomRange(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }

//     function draw() {
//         ctx.beginPath();
//         ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
//         ctx.fillStyle = `rgb(${33},${33},${33})`;
//         ctx.lineTo(centerX, centerY);
//         ctx.fill();

//         let startDeg = currentDeg;
//         for (let i = 0; i < items.length; i++, startDeg += step) {
//             let endDeg = startDeg + step;

//             let color = colors[i];
//             let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

//             ctx.beginPath();
//             ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
//             let colorStyle2 = `rgb(${color.r - 50},${color.g - 50},${color.b - 50})`;
//             ctx.fillStyle = colorStyle2;
//             ctx.lineTo(centerX, centerY);
//             ctx.fill();

//             ctx.beginPath();
//             ctx.arc(centerX, centerY, radius - 10, toRad(startDeg), toRad(endDeg));
//             ctx.fillStyle = colorStyle;
//             ctx.lineTo(centerX, centerY);
//             ctx.fill();

//             if (i === items.length - 1) {
//                 for (let index = 0; index < items.length; index++) {
//                     let degPino = startDeg + (step * index);
//                     let radPino = toRad(degPino);
//                     const centerXPino = centerX + (radius - 5) * Math.cos(radPino);
//                     const centerYPino = centerY + (radius - 5) * Math.sin(radPino);
//                     const gradiente = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
//                     ctx.beginPath();
//                     ctx.arc(centerXPino, centerYPino, 5, 0, 2 * Math.PI, false);
//                     gradiente.addColorStop(0.5, 'red');
//                     gradiente.addColorStop(0.5, 'yellow');
//                     ctx.fillStyle = gradiente;
//                     ctx.strokeStyle = "red";
//                     ctx.fill();
//                     ctx.stroke();
//                 }
//             }

//             // Verifica se o triângulo está exatamente em cima de startDeg ou endDeg
//             if (isAngleCloseToTarget(currentDeg % 360, startDeg)) {
//                 console.log("Triângulo em cima de startDeg");
//                 document.querySelector(".triangle").style.transition = "transform 0.2s ease";
//                 document.querySelector(".triangle").style.transform = "rotate(-10deg)";
//                 setTimeout(() => {
//                     document.querySelector(".triangle").style.transition = "transform 0.5s ease";
//                     document.querySelector(".triangle").style.transform = "rotate(0deg)";                    
//                 }, 20)
//                 // Adicione o código para lidar com a situação quando o triângulo está em cima de startDeg
//             }
//             // if (isAngleCloseToTarget(currentDeg % 360, endDeg)) {
//             //     console.log("Triângulo em cima de endDeg");
//             //     document.querySelector(".triangle").style.transform = "rotate(-10deg)";
//             //     setTimeout(() => {
//             //         document.querySelector(".triangle").style.transform = "rotate(0deg)";
//             //     },100)
//             //     // Adicione o código para lidar com a situação quando o triângulo está em cima de startDeg
//             //     // Adicione o código para lidar com a situação quando o triângulo está em cima de endDeg
//             // }

//             ctx.save();
//             ctx.translate(centerX, centerY);
//             ctx.rotate(toRad(startDeg + endDeg) / 2);
//             ctx.textAlign = "center";

//             if (color.r > 150 || color.g > 150 || color.b > 150) {
//                 ctx.fillStyle = "#000";
//             } else {
//                 ctx.fillStyle = "#fff";
//             }

//             const font = width * 0.036;
//             ctx.font = `bold ${font}px montserrat`;
//             const textX = width * 0.26;
//             const textY = width * 0.02;
//             ctx.fillText(items[i], textX, textY);
//             ctx.restore();

//             if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
//                 document.getElementById("winner").innerHTML = items[i];
//                 winnerProduct = items[i];
//             }
//         }
//     }

//     let speed = 0;
//     let maxRotation = randomRange(360 * 3, 360 * 6);
//     let pause = false;

//     function animate() {
//         if (pause) return;

//         // document.querySelector(".triangle").style.transform = "rotate(-10deg)";

//         speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
//         if (speed < 2) {
//             // document.querySelector(".triangle").style.transition = "transform 0.4s ease";
//             // document.querySelector(".triangle").style.transform = "rotate(-5deg)";
//         }
//         if (speed < 0.005) {
//             speed = 0;
//             pause = true;

//             // definido vencedor 
//             //usando confeti

//             winnerProduct = itemsoBJ.filter(it => it.produtoDescricao === winnerProduct)[0];
//             console.log(winnerProduct);
//             console.log(winnerProduct)
//             registrarRoleta(ultCPF, winnerProduct);
//             console.log(winnerProduct, "fazer o cod no qual insere na roleta");
//             // document.querySelector(".triangle").style.transition = "transform 0.5s ease";
//             // document.querySelector(".triangle").style.transform = "rotate(0deg)";

//             document.getElementById("confetti").style.display = "block"
//             const jsConfetti = new JSConfetti()

//             const wItem = document.getElementById("winner");
//             let troca = true;
//             let times = 0
//             let idInterval = setInterval(frame, 500);
//             jsConfetti.addConfetti()
//             function frame() {
//                 times++
//                 if (troca) {
//                     wItem.style.color = "red"
//                     wItem.style.fontWeight = "bold"
//                     wItem.style.fontSize = "25px"
//                 } else {
//                     wItem.style.color = "white"
//                     wItem.style.fontWeight = "regular"
//                     wItem.style.fontSize = "18px"
//                 }
//                 troca = !troca
//                 jsConfetti.addConfetti()
//                 if (times === 6) clearInterval(idInterval)
//             }

//         }
//         currentDeg += speed;
//         draw();
//         window.requestAnimationFrame(animate);
//     }

//     function spin() {
//         if (speed !== 0) {
//             return;
//         }
//         currentDeg = 0;
//         maxRotation = randomRange(360 * 3, 360 * 6);
//         pause = false;
//         window.requestAnimationFrame(animate);
//     }

//     document.getElementById("canvas").addEventListener("click", () => {
//         let clPontos = document.getElementById("input-hidden-cliente").value;
//         clPontos = JSON.parse(clPontos)
//         if (ultCPF === "" || ultCPF === null || clPontos.pontosInseridos < 500) {
//             // voltar aqui para fazer a validação do valor mínimo para jogar a roleta
//             alert("É PRECISO ATINGIR VALOR MÍNIMO E LOGAR COM SEU CPF PARA JOGAR!!");
//             return;
//         }
//         audio.currentTime = 1.5;
//         // audio.playbackRate = 0.15;
//         audio.play()
//             .catch(error => console.log("não foi possível tocar o audio,:", error))
//         spin();
//     });
// }
function testeRoleta(el) {

}
async function registrarRoleta(ultCPF, winnerProduct) {
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
    console.log(`os pontos da roleta foram ${pontosRoleta}`);
    try {
        const URL_API_ROLETA = "api/cliente-roleta";
        const dados = {
            cpf: ultCPF,
            sku: winnerProduct.sku,
            produtoDescricao: winnerProduct.produtoDescricao,
            pontos: pontos
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
    } catch (error) { console.log(error) }
}
async function puxarProdutos() {
    try {
        const URL_API_PUXAR_PRODUTOS = "api/puxar-produtos-cliente";
        const produtos = await new GenerateFetch(URL_API_PUXAR_PRODUTOS);
        return produtos
    } catch (error) { console.log(error) }
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
        }

    })
}
async function inserirAlterarCPF(cpf) {
    const data = cpf;
    console.log(data)
    try {
        const URL_API_CPF = "api/cliente-CPF";
        const options = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cpf: data })
        }
        const cliente = await new GenerateFetch(URL_API_CPF, options, true);        
        if (cliente.expired) window.location.href = cliente.url        

        if (cliente.length === 0) {            
            // cadastrar novo cpf com os pontos ganhos            
            const URL_API_CLIENTE_CREATE = "api/cliente-create";
            const dados = {
                cpf,
                data: new calendario().time
            }

            const options = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
            let clienteCadastrado = await new GenerateFetch(URL_API_CLIENTE_CREATE, options, true);
            // let clienteCadastrado = await new GenerateFetch(URL);
            console.log("cliente cadastrado pela a primeira vez");
            console.log(clienteCadastrado)

            let pontosInseridos = 0;
            let totalPontos = 0;
            clienteCadastrado.forEach(cliente => totalPontos += cliente.pontos);
            let clientePontos = { totalPontos, pontosInseridos }

            console.log(`cliente atualizado com pontuação de ${clientePontos.pontosInseridos} e um total de ${clientePontos.totalPontos} pontos`);
            receivePontos(clientePontos.pontosInseridos)
            let pontosTela = document.getElementById("pontos-atuais");
            pontosTela.innerHTML = "";
            const msg = (clienteCadastrado[0].nomeCliente === null) ? `Você tem atualmente ${clientePontos.totalPontos} pontos no total!!` : `${clienteCadastrado[0].nomeCliente} tem atualmente ${clientePontos.totalPontos} pontos no total!!`;
            pontosTela.innerHTML = msg
            pontosTela.style.opacity = 1;

            // Fazer aqui uma simulação de valor estipulado para jogar a roleta     
            if (clientePontos.pontosInseridos >= 500) {
                if (new confirmation(`Sua compra atingiu o valor mínimo para jogar a roleta. Jogue de graça e ganhe algo por conta da casa.`).result) {
                    actionRoleta();
                }
            }

            clientePontos = JSON.stringify(clientePontos);
            document.getElementById("input-hidden-cliente").value = clientePontos;
            let pontos = document.getElementById("input-hidden-cliente").value;

        } else {
            // recuperar o cliente do cpf e adicionar os pontos ganhos    
            console.log('cpf ja cadastrado, ent recupera-lo e adicionar mais pontos');
            const URLUPDATE = `api/cliente-create`;
            const dados = {
                cpf: cliente[0].cpf,
                data: new calendario().time,
            };
            const prop = {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }            
            let clientePontos = await new GenerateFetch(URLUPDATE, prop, true);
            console.log('clientes pontos é');            
            console.log(clientePontos)
            let pontosInseridos = 0;
            let totalPontos = 0;
            // if (clientePontos.status === 400) {
                const URL_API_CLIENTE_BUSCAR = "api/cliente-CPF";
                const optionsCliente = {
                    method: "POST",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ cpf: cliente[0].cpf })
                }                
                clientePontos = await new GenerateFetch(URL_API_CLIENTE_BUSCAR, optionsCliente, true);     
                console.log('buscou o cliente');
                console.log(clientePontos)           
                clientePontos.forEach(cliente => totalPontos += cliente.pontos);
                clientePontos = { totalPontos, pontosInseridos }
            // }

            /// caso deu 400 liberar para jogar ou trocar por produtos
            // if (clientePontos.status === 400) return                        
            receivePontos(clientePontos.pontosInseridos)
            let pontosTela = document.getElementById("pontos-atuais");
            pontosTela.innerHTML = "";
            const msg = (cliente[0].nomeCliente === null) ? `Você tem atualmente ${clientePontos.totalPontos} pontos no total!!` : `${cliente[0].nomeCliente} tem atualmente ${clientePontos.totalPontos} pontos no total!!`;
            pontosTela.innerHTML = msg
            pontosTela.style.opacity = 1;

            // Fazer aqui uma simulação de valor estipulado para jogar a roleta     
            if (clientePontos.pontosInseridos >= 500) {
                if (new confirmation(`Sua compra atingiu o valor mínimo para jogar a roleta. Jogue de graça e ganhe algo por conta da casa.`).result) {
                    actionRoleta();
                }
            }

            clientePontos = JSON.stringify(clientePontos);
            document.getElementById("input-hidden-cliente").value = clientePontos;
            let pontos = document.getElementById("input-hidden-cliente").value;
        }
    } catch (error) { console.log(error) }
}
function receivePontos(pontos) {
    const pontosnow = document.getElementById("pontos-now")
    pontosnow.innerHTML = (pontos);
    pontosnow.style.opacity = 1;
}
// function receivePontos() {
//     // Cria ou conecta ao canal chamado 'meuCanal'
//     const channel = new BroadcastChannel('meuCanal');

//     // Função para lidar com mensagens recebidas no canal
//     channel.onmessage = function (event) {
//         pontos = event.data;
//         const pontosnow = document.getElementById("pontos-now")
//         pontosnow.innerHTML = (pontos).toFixed(2);
//         pontosnow.style.opacity = 1;
//     };
// }
