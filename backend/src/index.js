require('dotenv').config();
const SocketIo = require('socket.io');

const app = require('./app');
require('./database');

async function main(){
    const server = await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));

    const io = SocketIo(server);
    io.on('connection', (socket) => {
        console.log('Alguien conectándose', socket.id);
    });
}

main();