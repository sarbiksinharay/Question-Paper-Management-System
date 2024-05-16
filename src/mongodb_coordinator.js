const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/Faculty_zone").then(()=>{
    console.log("Connected to MongoDB_Coordinator")
}).catch(err=>{
    console.log(err)
})

const CO_schema=new mongoose.Schema({

    au_email:{
        type: String,
        required: true,
    },
    co_id:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone_number:{
        type: String,
        required: true,
    },

})

const collection_co=new mongoose.model("Coordinator",CO_schema)

module.exports=collection_co;
