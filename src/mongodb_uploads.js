const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Faculty_zone").then(()=>{
    console.log("Connected to MongoDB_Uploads");
}).catch(err=>{
    console.log("Error connecting to MongoDB_Uploads");
})

const Upload_Schema= new mongoose.Schema({

    full_name: {
        type: String,
        required: true,
    },
    au_email: {
        type: String,
        required: true,
    },
    phone_number:{
        type: String,
        required: true,
    },
    faculty_id:{
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    subject:{
        type: String,
        required: true,
    },
    course_code:{
        type: String,
        required: true,
    },
    qus_paper:{
        type: String,
        required: true,
    },
  time:{
        type: String,
      required: true,
  },
  date:{
        type: String,
        required: true,
  }
}
)

const collection_upload=new mongoose.model("Upload",Upload_Schema)

module.exports=collection_upload

