// Função para obter os campos da API
async function obterCamposDaAPI() {
    try {
        const response = await fetch('https://api.padelconnect.pt/api/fields/');

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status}`);
        }

        const data = await response.json();

        const campos = data.fields || [];

        contarCampos(campos);
    } catch (error) {
        console.error('Erro ao obter os dados da API', error);
    }
}

// Função para contar os campos
function contarCampos(campos) {
    let totalCampos = 0;
    let totalCamposIndoor = 0;
    let totalCamposOutdoor = 0;

    // Contagem dos campos
    campos.forEach(campo => {
        totalCampos++; // Conta todos os campos
        if (campo.cover === 0) {
            totalCamposIndoor++; // Conta apenas os campos indoor com cover true
        }
        if (campo.cover === 1) {
            totalCamposOutdoor++; // Conta apenas os campos outdoor com cover false
        }
    });

    // Função para criar o efeito de contagem crescente
    function contarCrescente(elementId, start, end) {
        let current = start;
        const interval = setInterval(() => {
            if (current < end) {
                current++;
                document.getElementById(elementId).textContent = current;
            } else {
                clearInterval(interval); // Para o contador quando chega ao fim
            }
        }, 50); // Ajuste o tempo (50ms) para controlar a velocidade
    }

    // Chama o contador para atualizar os elementos de forma crescente
    contarCrescente('totalCampos', 0, totalCampos);
    contarCrescente('totalCamposIndoor', 0, totalCamposIndoor);
    contarCrescente('totalCamposOutdoor', 0, totalCamposOutdoor);
}

// Chama a função para obter os campos
obterCamposDaAPI();
