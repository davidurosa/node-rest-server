require('dotenv').config();

const Server = require('./models/server');



const serve = new Server();


///metodo que llama al servidor
serve.listen();


