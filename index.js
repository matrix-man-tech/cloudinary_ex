const express =  require('express')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const app = express()
require('dotenv').config()

cloudinary.config({
    // cloud_name: process.env.cloud_name
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
})

app.set("view engine","ejs")

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
// app.use(fileUpload()) will just upload and dont display in correct format
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))


app.get('/myget',(req,res) =>{
    // get requests travel through url but it should not 
    // console.log(req.query);
    // res.send(req.query)
    console.log(req.body);
    res.send(req.body)
})

// post requests travel through body
app.post('/mypost', async (req,res) =>{
    console.log(req.body);
    console.log(req.files);

        let result
        let imageArray = []

    //## use case for multiple files/images  

    if (req.files) {
        for (let index = 0; index < req.files.samplefile.length; index++) {
          let result = await cloudinary.uploader.upload(
            req.files.samplefile[index].tempFilePath,
            {
              folder: "users"
            }
          );
    
          imageArray.push({
            public_id: result.public_id,
            secure_url: result.secure_url
          });
        }
      }



    //## use case for single file
    // let file = req.files.samplefile
    // result = await cloudinary.uploader.upload( file.tempFilePath, {
    //     folder: 'user'
    // })



    console.log(result);

    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        result,
        imageArray
    }

    console.log(details);

    res.send(details)
})

app.get("/mygetform",(req,res) =>{
    res.render("getform")
})

app.get("/mypostform",(req,res) =>{
    res.render("postform")
})




app.listen(4000,(req,res) =>{
    console.log("server running at port 4000");
})