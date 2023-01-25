
const mongoose = require('mongoose');

const dbConnetion = async()=>{

try {
    
    mongoose.set('strictQuery', true);
   await mongoose.connect(process.env.MONGODB_CNN);

   console.log('base de datos online');

} catch (error) {
    console.log(error);
    throw new Error('error cuando levantas la base de datos');
}

}


module.exports = {
    dbConnetion
};