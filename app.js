import { Server } from 'socket.io';
import express from 'express';
import {createServer} from 'http';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

// init
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

const users = [];

app.use(express.static(join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.send('home');
});

io.on('connection', socket => {
    users.push(socket);
    console.log('a user is now connected...')

    socket.on('setPseudo',(data) => {
        console.log(data);
    });

    socket.on('message', message => {
        users.forEach(user => {
            if(user !== socket){
                user.emit('receiveMessage', message);
            }
        })
    });


    socket.on('disconnect',() => {
        console.log('a user is now disconnected');
    });

});



server.listen(8000, () => {
    console.log('server started...');
})