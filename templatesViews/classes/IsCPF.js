class IsCPF {
    constructor(strCPF) {
        this.strCPF = strCPF
    }
    TestaCPF() {
        var Soma;
        var Resto;
        Soma = 0;
        if (this.strCPF == "00000000000") return false;

        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(this.strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(this.strCPF.substring(9, 10))) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(this.strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(this.strCPF.substring(10, 11))) return false;
        return true;
    }
}




module.exports = IsCPF;





