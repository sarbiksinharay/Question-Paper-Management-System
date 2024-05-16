const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/Faculty_zone").then(()=>{
    console.log("Connected to MongoDB_signup")
}).catch(err=>{
    console.log(err)
})

const Reg_schema=new mongoose.Schema({
    full_name:{
        type: String,
        required: true,
    },
    au_email:{
      type: String,
      required: true,
    },
    password:{
        type: String,
        required: true,
    },
    faculty_id:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    phone_number:{
        type: String,
        required: true,
    },
   date:{
        type: String,
       required: true,
   },
   time:{
       type: String,
       required: true,
}




})

const collection_sgup=new mongoose.model("Registration",Reg_schema)

module.exports=collection_sgup;

