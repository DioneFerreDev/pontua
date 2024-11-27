document.addEventListener("DOMContentLoaded", () => {    
    playHome();
});



function playHome() {
    maskMoney()
    login();

}
function maskMoney() {
    $('#box-pontos').mask("#.##0,00", { reverse: true });
}
function login() {    
    const entrar = document.getElementById("entrar");    

    entrar.addEventListener("click", async e => {
        e.preventDefault();
        const user = document.getElementById("user").value;
        const password = document.getElementById("password").value;
        const preload = document.getElementById("home-preload");

        try {
            preload.style.display = "block";            
            const URL_API = "api/login";
            const dados = { user, password }
            const login_options =
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(dados)
            }

            // const admin = await new GenerateFetch(URL);
            const admin = await new GenerateFetch(URL_API, login_options,true);                                         
            if(admin.log){                
                window.location.href = admin.redirect
            }else{
                preload.style.display = "none";                                           
                setTimeout(() => {alert("DADOS INCORRETOS")}, 400);       
            }                 

        } catch (error) { preload.style.display ="block";;console.log(error) }

    })
}

