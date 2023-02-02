const {Producto}= require('../models');

// Ver todas la Productos

const indexProductos = async(req,res)=>{
    const {limite= 5,desde = 0} = req.query;
    const query = {estado:true}
  
  
  /* Ejecutar dos promesas al mismo tiempo */
    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
      Producto.find(query)
                .populate('usuario','nombre')
                .populate('categoria','nombre')
              .skip(desde)
              .limit(Number(limite))
    ])
  
      res.json({
        total,
        productos,
      })
}

// Ver Producto especifica
const showProducto = async(req,res)=>{
    
    const {id} = req.params;
    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');

    res.json(producto)

    
}


// Crear Producto
const storeProducto= async(req,res)=>{

    const {estado,usuario,...body} = req.body;

    const productoDB = await Producto.findOne({nombre:body.nombre})

    if(productoDB){
        return res.status(400).json({
            msg:`El Producto ${productoDB.nombre} ya existe`
        })
    }

    //generar la data para guardar

    const data = {
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id,

    }

    // Crear nueva Producto 

    const producto = new Producto(data);

    await producto.save();


    res.status(201).json(producto);
}


// actualizar Producto
const updateProducto = async(req,res)=>{
    const {id} = req.params;
    const {usuario,estado,...data} = req.body;
    if(data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true});


    res.json(producto)
}

// Eliminar Producto - cambiar estado
const detroyProducto = async(req,res)=>{
    
    const {id} = req.params;
    const productoBorrada = await Producto.findByIdAndUpdate(id,{estado:false},{new:true})

    res.json(productoBorrada);
}



module.exports = {
    storeProducto,
    indexProductos,
    showProducto,
    updateProducto,
    detroyProducto
}