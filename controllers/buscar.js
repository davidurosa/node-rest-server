const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const buscar = (req, res) => {

    const {
        coleccion,
        termino
    } = req.params;


    const coleccionesPermitidas = [
        "usuarios",
        "categorias",
        "productos",
        "roles"
    ]


    const buscarUsuario = async(termino='', res= response)=>{

        const esMongoID = ObjectId.isValid(termino);

        if(esMongoID){
            const usuario = await Usuario.findById(termino);

          return  res.json({
               results: (usuario) ? [usuario]:[]
            })
        }

        const regex = new RegExp(termino, 'i' )

        const usuarios = await Usuario.find({
            $or:[{nombre:regex},{correo:regex}],
            $and:[{estado:true}]

        }) ;

        res.json({
            results:usuarios
        })

    }


    
    const buscarCategoria = async(termino='', res= response)=>{

        const esMongoID = ObjectId.isValid(termino);

        if(esMongoID){
            const categoria = await Categoria.findById(termino);

          return  res.json({
               results: (categoria) ? [categoria]:[]
            })
        }

        const regex = new RegExp(termino, 'i' )

        const categorias = await Categoria.find({
            $and:[{nombre:regex},{estado:true}]

        }) ;

        res.json({
            results:categorias
        })

    }


    const buscarProducto = async(termino='', res= response)=>{

        const esMongoID = ObjectId.isValid(termino);

        if(esMongoID){
            const producto = await Producto.findById(termino).populate('categoria','nombre');

          return  res.json({
               results: (producto) ? [producto]:[]
            })
        }

        const regex = new RegExp(termino, 'i' )

        const productos = await Producto.find({
            $and:[{nombre:regex},{estado:true}]

        }).populate('categoria','nombre') ;

        res.json({
            results:productos
        })

    }


    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }


    switch (coleccion) {
        case "usuarios":
            buscarUsuario(termino,res)
            break;
        case "categorias":
            buscarCategoria(termino,res)

            break;
        case "productos":
            buscarProducto(termino,res)
            break;

        default:

        res.status(500).json({
            msg:"se me olvido esta busquedad"
        })
            break;
    }



}


module.exports = {
    buscar
}