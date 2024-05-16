const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const port=process.env.PORT || 3000
const collection=require("./mongodb_sgup")
const collection_hod=require("./mongodb_hod")
const collection_co=require("./mongodb_coordinator")
const collection_upload=require("./mongodb_uploads")
const TemplatesPath=path.join(__dirname,"../templates")
const cors=require("cors")
// const mongoose=require("mongoose")
const bodyParser=require("body-parser")

const multer=require("multer")

const twilio = require('twilio');
const {cat} = require("require/example/shared/dependency");
// const {cat} = require("require/example/shared/dependency");
const accountSid = 'ACf89ed28bf6f3ec630872af7b2b312cde';
const authToken = '7b1ddd4b2644368e7381d06e867f70b3';
const client = new twilio(accountSid, authToken);


app.set('view engine','hbs');
app.set('views', TemplatesPath);
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cors())
app.use("/styles",express.static(path.join(__dirname,"../styles")))
app.use("/uploads",express.static(path.join(__dirname,"../uploads")));

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload=multer({storage : storage})



app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})

app.get('/',(req,res)=>{
      res.render('login');
})

app.get('/register',(req,res)=>{
    res.render("signup")
})

app.get('/forgot_password',(req,res)=>{
    res.render("forgot_password")
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.get("/otp_verify",(req,res)=>{
    res.render("reset_password")
})

app.post('/login',async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const id=req.body.id;
    const post=req.body.post;

   try{
       if(post==='Faculty'){
          let user=await collection.findOne({"au_email" : username})

           if(user){
               if(user.faculty_id===id){
                   if(user.password===password){
                       res.render("qus_submit")
                   }else{
                       res.send("Wrong Password")
                   }
               }else{
                   res.send("Wrong Faculty ID")
               }
           }else{
               res.send("User Not Found")
           }
       }else if(post==='HOD'){
           let hod=await collection_hod.findOne({"au_email":username})
           if(hod){
               if(hod.hod_id===id){
                   if(hod.password===password){
                       const fetch_data=await collection_upload.find()
                       res.render("hod_page",{fetch_data})
                   }else{
                       res.send("Wrong Password")
                   }
               }else{
                   res.send("Wrong HOD ID")
               }
           }else{
               res.send("User Not Found")
           }


       }else if(post==='Coordinator'){
           let coordinator=await collection_co.findOne({"au_email":username})
           if(coordinator){
               if(coordinator.co_id===id){
                   if(coordinator.password===password){
                       const fetch_data=await collection_upload.find()
                       res.render("coordinator_page",{fetch_data})
                   }else{
                       res.send("Wrong Password")
                   }
               }else{
                   res.send("Wrong Coordinator ID")
               }
           }else{
               res.send("User Not Found")
           }

       }
   }
   catch{
        res.sendStatus(404);
   }


})



app.post("/register",async (req,res)=>{
    const phoneNumber = req.body.ph_num;
    const data=  {
        full_name:req.body.full_name,
        password:req.body.password,
        au_email:req.body.au_email,
        faculty_id:req.body.faculty_id,
        gender:req.body.gender,
        department:req.body.department,
        phone_number:req.body.ph_num,
        date:req.body.date,
        time:req.body.time
    }


    try {
        const verificationCheck = await client.verify
            .services("VA5a9cc42e549d3f7049f67567d307d89e")
            .verifications.create({ to: '+91' + phoneNumber, channel: 'sms'  });

        console.log(verificationCheck.status); // Log the status of the verification check
       res.render("otp_verify")

        app.post("/otp_verify",async (req,res)=>{

            const enteredOTP=req.body.otp;
            const verificationCheck = await client.verify
                .services("VA5a9cc42e549d3f7049f67567d307d89e")
                .verificationChecks.create({ to: '+91' + phoneNumber, code: enteredOTP });

            if (verificationCheck.status === 'approved') {
                // OTP is correct
                // sendVerificationSuccessMessage("+91"+phoneNumber);
                await collection.insertMany([data])
                res.render("approved_otp")

            } else {
                // OTP is incorrect

                // res.send("Incorrect OTP, please try again");
                res.render("wrong_otp")
            }

        })


    } catch (error) {
        console.error("Error sending OTP:", error.message); // Log the error message
        res.status(500).send(` ${error.message} `); // Send a 500 status code if there's an error
    }

})

app.post("/forgot_password",async (req,res)=>{
    const email=req.body.au_email;
    const ph_num=req.body.ph_num;

    let user=await collection.findOne({"au_email": email});
    let coordinator=await collection_co.findOne({"au_email":email})
    let hod=await collection_hod.findOne({"au_email":email})

    try{
        if(user) {
            if (user.phone_number === ph_num) {
                const verificationCheck = await client.verify
                    .services("VA5a9cc42e549d3f7049f67567d307d89e")
                    .verifications.create({to: '+91' + ph_num, channel: 'sms'});

                console.log(verificationCheck.status); // Log the status of the verification check
                res.render("frg_psw_otp")

                app.post("/otp_verify_frgpw", async (req, res) => {
                    const entered_otp = req.body.otp;
                    const verificationCheck = await client.verify
                        .services("VA5a9cc42e549d3f7049f67567d307d89e")
                        .verificationChecks.create({to: '+91' + ph_num, code: entered_otp});
                    if (verificationCheck.status === 'approved') {
                        // OTP is correct
                        // sendVerificationSuccessMessage("+91"+phoneNumber);
                        res.render("reset_password")
                        app.post("/reset_password", async (req, res) => {
                            const password = req.body.password;

                            await collection.updateOne({"au_email": email}, {$set: {"password": password}})
                            res.render("login")
                        })

                    } else {
                        // OTP is incorrect

                        // res.send("Incorrect OTP, please try again");
                        res.render("wrong_otp_fp")
                    }


                })
            }
            else {
                res.send("Wrong Phone Number")
            }
        }
        else if(coordinator){
            if (coordinator.phone_number === ph_num) {
                const verificationCheck = await client.verify
                    .services("VA5a9cc42e549d3f7049f67567d307d89e")
                    .verifications.create({to: '+91' + ph_num, channel: 'sms'});

                console.log(verificationCheck.status); // Log the status of the verification check
                res.render("frg_psw_otp")

                app.post("/otp_verify_frgpw", async (req, res) => {
                    const entered_otp = req.body.otp;
                    const verificationCheck = await client.verify
                        .services("VA5a9cc42e549d3f7049f67567d307d89e")
                        .verificationChecks.create({to: '+91' + ph_num, code: entered_otp});
                    if (verificationCheck.status === 'approved') {
                        // OTP is correct
                        // sendVerificationSuccessMessage("+91"+phoneNumber);
                        res.render("reset_password")
                        app.post("/reset_password", async (req, res) => {
                            const password = req.body.password;

                            await collection_co.updateOne({"au_email": email}, {$set: {"password": password}})
                            res.render("login")
                        })
                    } else {
                        // OTP is incorrect

                        // res.send("Incorrect OTP, please try again");
                        res.render("wrong_otp_fp")
                    }
                })
            }
            else {
                res.send("Wrong Phone Number")
            }
    }else if(hod){
            if (hod.phone_number === ph_num) {
                const verificationCheck = await client.verify
                    .services("VA5a9cc42e549d3f7049f67567d307d89e")
                    .verifications.create({to: '+91' + ph_num, channel: 'sms'});

                console.log(verificationCheck.status); // Log the status of the verification check
                res.render("frg_psw_otp")

                app.post("/otp_verify_frgpw", async (req, res) => {
                    const entered_otp = req.body.otp;
                    const verificationCheck = await client.verify
                        .services("VA5a9cc42e549d3f7049f67567d307d89e")
                        .verificationChecks.create({to: '+91' + ph_num, code: entered_otp});
                    if (verificationCheck.status === 'approved') {
                        // OTP is correct
                        // sendVerificationSuccessMessage("+91"+phoneNumber);
                        res.render("reset_password")
                        app.post("/reset_password", async (req, res) => {
                            const password = req.body.password;

                            await collection_hod.updateOne({"au_email": email}, {$set: {"password": password}})
                            res.render("login")
                        })

                    } else {
                        // OTP is incorrect

                        // res.send("Incorrect OTP, please try again");
                        res.render("wrong_otp_fp")
                    }


                })
            }
            else {
                res.send("Wrong Phone Number")
            }
    }
        else{
            res.send("User not found \nInvalid Email")
        }
     }catch(er){
       console.log("Error")
     }
})

app.post("/upload",upload.single("qus_paper"),async (req, res) => {
    const filePath=req.file.path
    const data={
        full_name: req.body.full_name,
        au_email: req.body.au_email,
        phone_number: req.body.ph_number,
        faculty_id:req.body.faculty_id,
        department: req.body.department,
        subject: req.body.subject,
        course_code: req.body.course_code,
        qus_paper: req.file.filename,
        time:req.body.time,
        date:req.body.date,

    };
    try{
        await collection_upload.insertMany([data])

        res.send("Successfully uploaded")
    }catch(er){
        res.send("Error")
        console.log("Error")
    }
})


