// Função para preencher a tabela com os dados das máquinas
function preencherTabela(maquinas, maquinas2) {
    var tabela = document.getElementById('maquinas').getElementsByTagName('tbody')[0];

    // Limpa a tabela antes de adicionar novas linhas
    tabela.innerHTML = '';

    // Loop para adicionar linhas à tabela
    for (var i = 0; i < maquinas.length; i++) {
        var linha = tabela.insertRow();

        // Loop para adicionar células à linha
        for (var j = 0; j < maquinas[i].length; j++) {
            var celula = linha.insertCell();
            celula.textContent = maquinas[i][j];
        }

        // Adiciona campos de entrada final e saída final após as células de entrada inicial e saída inicial
        linha.insertCell().innerHTML = '<input type="text" class="entrada-final">';
        linha.insertCell().innerHTML = '<input type="text" class="saida-final">';

        // Adiciona células vazias para os campos de diferença de créditos e resultado financeiro
        linha.insertCell().innerHTML = '';
        linha.insertCell().innerHTML = '';
        linha.insertCell().innerHTML = '';
        linha.insertCell().innerHTML = '';

        // Adiciona evento de escuta aos campos de entrada final e saída final
        linha.cells[5].querySelector('input').addEventListener('input', calcularDiferenca);
        linha.cells[6].querySelector('input').addEventListener('input', calcularDiferenca);

        // Adiciona o valor do divisor à linha
        var celulaDivisor = linha.insertCell();
        celulaDivisor.textContent = maquinas2[i][0]; // Considerando que a matriz maquinas2 tenha apenas uma coluna

        // Oculta a última célula da linha (celula do divisor)
        celulaDivisor.classList.add('hidden');
    }
}

// Função para calcular as diferenças ao editar os campos de entrada final e saída final
function calcularDiferenca() {
    var linha = this.parentNode.parentNode; // Obtém a linha da célula atual
    var entradaInicial = parseInt(linha.cells[3].textContent);
    var entradaFinal = parseInt(linha.cells[5].querySelector('input').value) || 0;
    var saidaInicial = parseInt(linha.cells[4].textContent);
    var saidaFinal = parseInt(linha.cells[6].querySelector('input').value) || 0;
    var divisor = parseFloat(linha.cells[11].textContent); // Obtém o valor do divisor

    // Calcula a diferença entre entrada final e inicial e preenche a oitava coluna
    var diferencaEntrada = entradaFinal - entradaInicial;
    linha.cells[7].textContent = diferencaEntrada;

    // Calcula a diferença entre saída final e inicial e preenche a nona coluna
    var diferencaSaida = saidaFinal - saidaInicial;
    linha.cells[8].textContent = diferencaSaida;

    // Calcula a diferença total e preenche a décima coluna
    var diferencaTotal = diferencaEntrada - diferencaSaida;
    linha.cells[9].textContent = diferencaTotal;

    // Calcula o resultado financeiro e preenche a décima primeira coluna
    var resultadoFinanceiro = diferencaTotal / divisor;
    linha.cells[10].textContent = resultadoFinanceiro.toFixed(2); // Ajusta para duas casas decimais

    // Saída no console para verificar os resultados
    console.log("Diferença de entrada para a linha " + linha.rowIndex + ": " + diferencaEntrada);
    console.log("Diferença de saída para a linha " + linha.rowIndex + ": " + diferencaSaida);
    console.log("Diferença total para a linha " + linha.rowIndex + ": " + diferencaTotal);
    console.log("Resultado financeiro para a linha " + linha.rowIndex + ": " + resultadoFinanceiro);
}

// Função para carregar o arquivo Excel quando o input de arquivo for alterado
document.getElementById('fileInput').addEventListener('change', function (e) {
    var arquivo = e.target.files[0];
    if (arquivo) {
        processarArquivoExcel(arquivo);
    }
});

// Função para carregar e processar o arquivo Excel
function processarArquivoExcel(arquivo) {
    var leitor = new FileReader();
    leitor.onload = function(e) {
        var dados = new Uint8Array(e.target.result);
        var workbook = XLSX.read(dados, { type: 'array' });

        // Processar apenas a aba desejada (no caso, SEX)
        var aba = workbook.Sheets['SEX'];

        // Array para armazenar os dados das máquinas
        var maquinas = [];
        var maquinas2 = [];

        // Loop para iterar sobre as células e extrair os dados
        for (var i = 4; i <= 111; i++) { // Inicia da célula A4 e vai até a célula A111
            var codigo = aba['A' + i].v;
            var numero = aba['B' + i].v;
            var equipamento = aba['C' + i].v;
            var entradaInicial = aba['D' + i].v;
            var saidaInicial = aba['E' + i].v;
            var divisor = aba['O' + i].v;

            // Adiciona os dados da máquina ao array
            maquinas.push([codigo, numero, equipamento, entradaInicial, saidaInicial]);
            maquinas2.push([divisor]);
        }

        // Chama a função para preencher a tabela com os dados das máquinas
        preencherTabela(maquinas, maquinas2);
    };
    leitor.readAsArrayBuffer(arquivo);
}
