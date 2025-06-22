const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    }catch(error){
        console.error(`Database connection error :${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;