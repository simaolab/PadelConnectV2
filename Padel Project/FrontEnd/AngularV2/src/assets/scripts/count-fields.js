// // Função para obter os campos da API
// async function obterCamposDaAPI() {
//     try {
//         const response = await fetch('https://api.padelconnect.pt/api/fields/');

//         if (!response.ok) {
//             throw new Error(`Erro na resposta da API: ${response.status}`);
//         }

//         const data = await response.json();

//         const campos = data.fields || [];

//         contarCampos(campos);
//     } catch (error) {
//         console.error('Erro ao obter os dados da API', error);
//     }
// }

// function contarCampos(campos) {
//     let totalCampos = 0;
//     let totalCamposIndoor = 0;
//     let totalCamposOutdoor = 0;

//     campos.forEach(campo => {
//         totalCampos++;
//         if (campo.cover === 0) {
//             totalCamposIndoor++;
//         }
//         if (campo.cover === 1) {
//             totalCamposOutdoor++;
//         }
//     });

//     function contarCrescente(elementId, start, end) {
//         let current = start;
//         const interval = setInterval(() => {
//             if (current < end) {
//                 current++;
//                 document.getElementById(elementId).textContent = current;
//             } else {
//                 clearInterval(interval);
//             }
//         }, 50);
//     }

//     contarCrescente('totalCampos', 0, totalCampos);
//     contarCrescente('totalCamposIndoor', 0, totalCamposIndoor);
//     contarCrescente('totalCamposOutdoor', 0, totalCamposOutdoor);
// }

// obterCamposDaAPI();
