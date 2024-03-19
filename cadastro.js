// Função para lidar com o envio do formulário de cadastro
function handleCadastro(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const codigo = document.getElementById('codigo').value;
    const numero = document.getElementById('numero').value;
    const jogo = document.getElementById('jogo').value;
    const entrada = document.getElementById('entrada').value;
    const saida = document.getElementById('saida').value;
    const credito = document.getElementById('credito').value;

    // Abre o banco de dados
    const db = openDatabase('RIOS.db', '1.0', 'Banco de Dados RIOS', 2 * 1024 * 1024);

    // Insere os dados na tabela TAB_MAQ
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO TAB_MAQ (COD, NUM, JOGO, CRED) VALUES (?, ?, ?, ?)', [codigo, numero, jogo, credito]);
    });

    // Insere os dados na tabela TAB_LEITURA
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO TAB_LEITURA (COD, ENTRADA, SAIDA, DATA, HORA) VALUES (?, ?, ?, ?, ?)', [codigo, entrada, saida, Date.now(), Date.now()]);
    });

    // Limpa os campos do formulário após a inserção dos dados
    document.getElementById('formCadastro').reset();
}

// Adiciona um listener de evento para o formulário de cadastro
document.getElementById('formCadastro').addEventListener('submit', handleCadastro);
