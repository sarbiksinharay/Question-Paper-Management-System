const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/Faculty_zone").then(()=>{
    console.log("Connected to MongoDB_HOD")
}).catch(err=>{
    console.log(err)
})

const HOD_schema=new mongoose.Schema({

    au_email:{
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
    hod_id:{
        type: String,
        required: true,
    },
})

const collection_hod=new mongoose.model("HOD",HOD_schema)

module.exports=collection_hod;
