const clienteController = {};

const ClienteModel = require ('../models/Cliente');

clienteController.createCliente = async(req, res) =>{
    const{tipoPersona,name,direccion,cedula} = req.body;

    if(!tipoPersona){
        return res.json({
            success: false,
            message: 'Tipo de persona no puede estar vacio'
        });
    }

    if (!name){
        return res.json({
            success: false,
            message: 'El nombre no puede estar vacio'
        }); 
    }

    if (!direccion){
        return res.json({
            success: false,
            message: 'La direccion no puede estar vacio'
        }); 
    }

    if (!cedula){
        return res.json({
            success: false,
            message: 'La cedula no puede estar vacio'
        }); 
    }

    const newCliente = new ClienteModel({
        tipoPersona,
        name,
        direccion,
        cedula
    });

    await newCliente.save((err,cliente) =>{
        if (cliente){
            res.json({
                success: true,
                message: 'Yes'
            })
        }else{
            res.json({
                success: false,
                message: 'vayavaya'
            })
        }
    });    
};

clienteController.getCliente = async(req,res) =>{
    const cliente = await ClienteModel.findById(req.params.id);
    res.json(cliente);
}; 

clienteController.getClientes= async(req, res) =>{
    const clientes = await ClienteModel.find();
    res.json(clientes);
}; 

clienteController.updateCliente = async(req,res) =>{
  await ClienteModel.findByIdAndUpdate({_id: req.params.id}, req.body);
  res.json({
      success: true,
      message: 'Cliente actualizado'
  });
}

clienteController.deleteCliente = async(req,res) =>{
    await ClienteModel.findByIdAndDelete({
        _id: req.params.id},
         req.body);
    res.json({
        success: true,
        message: 'Cliente eliminado'
    }); 
}
module.exports = clienteController;