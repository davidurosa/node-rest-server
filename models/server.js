
const express = require('express')
const cors = require('cors')

class Server{

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath ='/api/usuarios';
       
        //middlewares

        this.middlewares();
        //rutas de mi aplicacion
        this.routes();
    }


    middlewares(){

         //CORS
         this.app.use(cors())

         //lectura y parseo del body

         this.app.use(express.json());
        //Directorio public
        this.app.use(express.static('public'))
    }


    routes(){

        this.app.use(this.usuariosPath,require('../routes/usuarios'));
        
    }


    listen(){
        this.app.listen( this.port,()=>{
            console.log('Servido correndo en puerto', this.port);
        })
    }



}

module.exports = Server;