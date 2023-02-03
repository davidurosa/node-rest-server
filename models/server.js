
const express = require('express')
const cors = require('cors');
const { dbConnetion } = require('../database/confi');
const fileUpload =require('express-fileupload');

class Server{

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        this.path = {
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            productos:'/api/productos',
            usuarios:'/api/usuarios',
            //cargar archivos
            uploads:'/api/uploads',



        }
      

       //conectar a base de datos
        this.conectarDB();

        //middlewares

        this.middlewares();
        //rutas de mi aplicacion
        this.routes();
    }

   async conectarDB(){
        await dbConnetion();
    }

    middlewares(){

         //CORS
         this.app.use(cors())

         //lectura y parseo del body
         this.app.use(express.json());
        //Directorio public
        this.app.use(express.static('public'))


        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }


    routes(){
        this.app.use(this.path.auth,require('../routes/auth'));
        this.app.use(this.path.buscar,require('../routes/buscar'));
        this.app.use(this.path.categorias,require('../routes/categorias'));
        this.app.use(this.path.productos,require('../routes/productos'));
        this.app.use(this.path.usuarios,require('../routes/usuarios'));
        this.app.use(this.path.uploads,require('../routes/uploads'));


        
    }


    listen(){
        this.app.listen( this.port,()=>{
            console.log('Servido correndo en puerto', this.port);
        })
    }



}

module.exports = Server;