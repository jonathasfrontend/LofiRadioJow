const mongoose = require('mongoose');
const { logger, databaseEvent, error, info } = require('../Logger');

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;
const db = process.env.MONGO_DB;

function bdServerConect() {
    const connectionString = `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority`;
    
    info('Iniciando conexão com MongoDB...', { module: 'DATABASE' });
    
    mongoose.connect(connectionString)
        .then(() => {
            databaseEvent('CONNECT', 'MongoDB', true, 'Conexão estabelecida com sucesso');
        })
        .catch(err => {
            databaseEvent('CONNECT', 'MongoDB', false, err.message);
            error('Erro ao conectar ao MongoDB', { module: 'DATABASE' }, err);
        });

    // Event listeners para monitorar a conexão
    mongoose.connection.on('connected', () => {
        databaseEvent('CONNECTION_EVENT', 'MongoDB', true, 'Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        databaseEvent('CONNECTION_EVENT', 'MongoDB', false, `Erro na conexão: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        databaseEvent('CONNECTION_EVENT', 'MongoDB', false, 'Mongoose desconectado do MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        databaseEvent('DISCONNECT', 'MongoDB', true, 'Conexão fechada devido ao encerramento da aplicação');
        process.exit(0);
    });
}

module.exports = { bdServerConect };
