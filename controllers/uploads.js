const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2


cloudinary.config(process.env.CLOUDINARY_URL)



const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req ,res)=>{

 /* 
    if (!req.files || Object.keys(req.files).length === 0 ||!req.files.archivo ) {
      res.status(400).json({msg:'No hay archivos que subir'});
      return;
    } */

    try {
/*         const nombre = await subirArchivo(req.files,['jpg','png',],'imagenes');
 */        const nombre = await subirArchivo(req.files,undefined,'imagenes');
       res.json({nombre})
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

}


const actualizarArchivo= async(req,res)=>{


    const {id,coleccion} = req.params;

    let modelo ;

    switch(coleccion){
            case'usuarios':
                    modelo = await Usuario.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el usuario con el id ${id}`
                        })
                    }
            break

            case'productos':
                    modelo = await Producto.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el producto con el id ${id}`
                        })
                    }
            break

            default:
                return res.status(500).json({
                    msg:'se me olvido validar esto'
                });
    }


    ///limpiar la imagenes previas 

    if(modelo.img){
        //hay que borrar las imagenes del servidor
        const pathImage = path.join( __dirname,'../uploads',coleccion,modelo.img);

        if(fs.existsSync(pathImage)){
            //borrar el archivo
            fs.unlinkSync(pathImage);
        }
    }

        const nombre = await subirArchivo(req.files,undefined,coleccion);
        modelo.img = nombre;

        await modelo.save();

    res.json({
        modelo
    })

}


const actualizarArchivoCloudinary= async(req,res)=>{


    const {id,coleccion} = req.params;

    let modelo ;

    switch(coleccion){
            case'usuarios':
                    modelo = await Usuario.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el usuario con el id ${id}`
                        })
                    }
            break

            case'productos':
                    modelo = await Producto.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el producto con el id ${id}`
                        })
                    }
            break

            default:
                return res.status(500).json({
                    msg:'se me olvido validar esto'
                });
    }


    ///limpiar la imagenes previas 

    if(modelo.img){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.')

         cloudinary.uploader.destroy(public_id);

    }

    const {tempFilePath} = req.files.archivo

    const {secure_url} =  await  cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;

        await modelo.save();

    res.json({
        modelo
    })

}





const mostrarImagen = async(req,res)=>{

 
    const {id,coleccion} = req.params;

    let modelo ;

    switch(coleccion){
            case'usuarios':
                    modelo = await Usuario.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el usuario con el id ${id}`
                        })
                    }
            break

            case'productos':
                    modelo = await Producto.findById(id);
                    if(!modelo){
                        return res.status(400).json({
                            msg:`No existe el producto con el id ${id}`
                        })
                    }
            break

            default:
                return res.status(500).json({
                    msg:'se me olvido validar esto'
                });
    }


    ///limpiar la imagenes previas 

    if(modelo.img){
        //hay que borrar las imagenes del servidor
        const pathImage = path.join( __dirname,'../uploads',coleccion,modelo.img);

        if(fs.existsSync(pathImage)){
         return res.sendFile(pathImage)
        }
    }


    const pathImage=  path.join( __dirname,'../assets/no-image.jpg');

    return res.sendFile(pathImage);
}


module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}