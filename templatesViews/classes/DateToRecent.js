class DateToRecent {
    constructor(arr) {
        this.arr = arr;
        this.arr.sort((a, b) => {
            const dateA = this.parseDates(a.data)
            const dateB = this.parseDates(b.data)

            return dateB - dateA
        });
        this.arr;
    }
    parseDates(str) {
        const parts = str.split(/[\s/:]/);
        // ano, mês -1, dia, hora,minuto, segundo
        if (parts.length === 6)
            return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
        return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
    }
    getArr(){
        return this.arr
    }
}




module.exports = DateToRecent;


// function dateToRecent(cliente) {
//     function parseDates(str) {
//         const parts = str.split(/[\s/:]/);
//         // ano, mês -1, dia, hora,minuto, segundo
//         if (parts.length === 6)
//             return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
//         return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
//     }
//     cliente.sort((a, b) => {
//         const dateA = parseDates(a.data)
//         const dateB = parseDates(b.data)

//         return dateB - dateA
//     });

//     return cliente
// }