const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');




const login = async (req,res)=>{
    const {correo, password} = req.body;

    try {
        
        //veificar si el correo existe

        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg:'Usuario o contraseña no son correctas - correo'
            })
        }

        /// verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario o contraseña no son correctas - estado = false'
            })
        }


        //verificar la contraseña

        const validarPassword = bcryptjs.compareSync(password,usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg:'Usuario o contraseña no son correctas -password'
            })
        }

        //generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            token,
            usuario
        })

    } catch (error) {
        console.log(error);

         res.status(500).json({
            msg:'Algo salio masl hable con el administrador'
        })
    }


    

}



const googleSingIn = async (req,res)=>{

   const {id_token} = req.body;

try {

    const {nombre,correo,img} = await googleVerify(id_token);


    let usuario =  await Usuario.findOne({correo});

    if(!usuario){

        const data = {
            nombre,
            correo,
            img, 
            google :true,
            password:'231312',
        }

        console.log(data);
        usuario =  new Usuario(data) ;
       await usuario.save();
    }


    if(!usuario.estado){

        return res.status(401).json({
            msg:'Hable con el administrador usuario bloqueado'
        })
    }


//genera JWT
    const token = await generarJWT(usuario.id);

    console.log(usuario);
    
    res.json({
     usuario,
     token
    })
} catch (error) {
   
    console.log(error);
}

   
}


module.exports= {
    login,
    googleSingIn
}