const {Categoria}= require('../models')

// Ver todas la categorias

const indexCategorias = async(req,res)=>{
    const {limite= 5,desde = 0} = req.query;
    const query = {estado:true}
  
  
  /* Ejecutar dos promesas al mismo tiempo */
    const [total,categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
                .populate('usuario','nombre')
              .skip(desde)
              .limit(Number(limite))
    ])
  
      res.json({
        total,
        categorias,
      })
}

// Ver categoria especifica
const showCategoria = async(req,res)=>{
    
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria)

    
}


// Crear Categoria
const storeCategoria= async(req,res)=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${nombre} ya existe`
        })
    }

    //generar la data para guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // Crear nueva categoria 

    const categoria = new Categoria(data);

    await categoria.save();


    res.status(201).json(categoria);
}


// actualizar categoria
const updateCategoria = async(req,res)=>{
    const {id} = req.params;
    const {usuario,estado,...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true});


    res.json(categoria)
}

// Eliminar categoria - cambiar estado
const detroyCategoria = async(req,res)=>{
    
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})

    res.json(categoriaBorrada);
}



module.exports = {
    storeCategoria,
    indexCategorias,
    showCategoria,
    updateCategoria,
    detroyCategoria
}