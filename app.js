const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
let alert = require('alert');


var session = require('express-session')
require("./db/database");
const Flipr = require("./db/schema");

const port = process.env.PORT || 5000


const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '362154966855-rd2udkip3pagmm0v6a1ime2b5i6vpa78.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

app.set('view engine','pug');
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use('/static',express.static('static'));
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
  }));
  

app.get("/",(req,res)=>{
    req.session.gemail_found=0;
    res.render("index");
})
app.post('/',async(req,res)=>{
    // console.log(req.body);
    res.render("index");
})


app.get("/register",(req,res)=>{
    res.render("register");
})


var myemail=""
var User_status=""
var Occup_Status=""

app.post("/glogin",async(req,res)=>{
    token = req.body.token;
    // console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        req.session.email_found=1;
        myemail = payload.email;
        req.session.email = payload.email;
        req.session.save();
        console.log("Gmail: "+req.session.email);
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify().then(()=>{

        res.cookie('session-token',token);
        var tempmail = req.session.email;

      Flipr.findOne(
        {email:tempmail}, 

        function(err,user){
            if(user)
            {
             if(user.isTeacher == true)   
             {
                 req.session.sub_code=user.teacherCode;
                 User_status="found";
                 res.send("Teach");
             }
             else
             if(user.isStudent == true)
             {
                User_status = "found";
                res.send("Stud");

             }

            }
            else{
                User_status = "Not registerd";
                res.send("Notregistered");
            }
        }
        ) 

        
    }).catch();
    
   
    
})

app.post("/login",async (req,res)=>{
    // console.log("vvbbb: "+req.body.button);
    try {

        if (req.body.button == 1) {
            await Flipr.findOne(
                { email: req.body.email },
                
                temp = function (err, user) {
                    if (user) {
                        if (user.password === req.body.pass) {
                            User_status = "Loggedin";
                            console.log("foound");
                            req.session.email = req.body.email;
                            var tempmail = req.session.email;
                            console.log(tempmail);

                            if (user.isTeacher == true) {
                                req.session.sub_code = user.teacherCode;
                                req.session.occ = "Teacher";
                                Occup_Status = req.session.occ;
                                res.render('teacher', { tempmail, User_status, Occup_Status });
                            }
                            else if (user.isStudent == true) {
                                req.session.occ = "Studddent";
                                Occup_Status = req.session.occ;
                                res.render('student', { tempmail, User_status, Occup_Status });
                            }

                        }
                        else {
                            User_status = "Wrong Password";
                            res.render('index', { User_status });
                        }
                    }
                    else {
                        User_status = "Not Exist";
                        res.render('index', { User_status });
                    }
                    if (err) {
                        // console.log('skadbs');
                        // console.log(err);

                        // res.sendStatus(500);
                        return;
                    }
                });
                            
                            
        }
        res.render("index");
    }
    catch (error) {
        // console.log(error);
    }
    })

app.post("/register", async (req,res)=>{

    var email_here=req.body.email;
    try {
        if (req.body.pass === req.body.confirm_pass) {
            User_status = "";
           let user= await Flipr.findOne({
                email: req.body.email
            },
            )
            //   function (err, user) { 
            if (user) {
                console.log("user already registered");
                User_status = "User Already Registered"
                req.session.destroy();
                res.render("index.pug", { User_status });
                return;

            }
            else {
                console.log(" Registering new user");
                if (req.body.tech == 1) {
                    const mydata = new Flipr(
                        {
                            email: req.body.email,
                            password: req.body.pass,
                            isTeacher: true,
                            isStudent: false,
                            username: req.body.username,
                            teacherCode: req.body.subjectCode,
                            subject: req.body.subject,
                            assignment: [
                                {
                                    assign_id: null,
                                    title: null,
                                    content: null,
                                    deadline: null,
                                    submission: [
                                        {
                                            subemail: null,
                                        }
                                    ]
                                }
                            ]
                        });
                        
                    var registered = mydata.save();
                    User_status = "Registered As Teacher";
                    res.render("index.pug", { User_status });
                return;


                }
                else
                    if (req.body.stud == 1) {
                        const mydata = new Flipr(
                            {
                                email: req.body.email,
                                password: req.body.pass,
                                isStudent: true,
                                isTeacher: false,
                            });
                            
                        var registered = mydata.save();
                        User_status = "Registered As Student";
                        res.render("index.pug", { User_status });
                return;

                    }
                    
                    
                    // console.log("userPass: "+req.session.userPassword);
                } 
                 
        }
        else {
            User_status = "Password doesn't matches"
        }
        res.render('register', { User_status });
    } catch (error) {
        console.log('fsdlnf');
        console.log(error);
        
    }
})


app.post('/logout',(req,res)=>{
    req.session.email=""
    req.session.destroy();
    var myemail = req.session.email;
    res.render("index",{myemail});
})

const url = 'mongodb+srv://marizvi007:O9FNb3f6vZ1LaACP@cluster0.eocts.mongodb.net/FliprX?retryWrites=true&w=majority';


const MongoClient = require('mongodb').MongoClient;
const { isValidObjectId } = require("mongoose");
app.use(express.json());

const client1 = new MongoClient(url);
client1.connect();


app.get('/api',async(req,res)=>{
    const database = client1.db("FliprX");
await database.collection('fliprxes').find({email:req.session.email}).toArray((err,result)=>{
    if(err) throw error
    // console.log(result[0].email);
    res.send(result)
})
}) 


app.get("/teacher_assign",(req,res)=>{
    res.render("teacher_assign");
})

const generateUniqueId = require('generate-unique-id');

app.post("/teacher_assign", async (req, res) => {
    var Assign_id = generateUniqueId();
console.log(req.body.deadline);
if(req.body.deadline=="")
{
    var alert_msg="deadline required";
console.log("nulldeadline...");
var tempmail = req.session.email;
res.render("teacher_assign",{alert_msg,tempmail})
}
else{
    try{
    await Flipr.findOneAndUpdate(
        {
        email: req.body.email,
        },
        {$pull : {"assignment": {"title":null}}},
    )
    }
    catch{
        console.log("Not new Teacher");
    }

    try{
        await Flipr.findOneAndUpdate(
            {
                email:req.body.email,
                 
            },
            {$pull : {"assignment": {"assign_id":Assign_id}}},
            
        )
        }    
        catch{
            console.log("inside first catch");
        }
    try{
        await Flipr.updateMany(
            {
                "studentCode.code":req.session.sub_code,
            },
            {$pull:{"studentCode.$.assignment":{"assign_id":Assign_id}}},
    
        )
        }    
        catch{
            console.log("inside first catch");
        }
           
    await Flipr.findOneAndUpdate(
        {
        email: req.body.email,
        },
        {
        $addToSet: {
            assignment:[
                {
                    assign_id:Assign_id,
                    title:req.body.title,
                    content:req.body.content,
                    deadline:req.body.deadline,
                    isSubmitted:false,
                    submission:[
                        {
                            subemail:null,
                        }
                    ]
                    }
            ]
        }}
    )

    await Flipr.updateMany(
        {
            "studentCode.code":req.session.sub_code,
        },
        {"$addToSet":{"studentCode.$.assignment":{"assign_id":Assign_id,"title":req.body.title,"content":req.body.content,"deadline":req.body.deadline,"isSubmitted":false}}},

    )

    var tempmail = req.session.email;
    res.render("teacher_assign",{tempmail});
}
})

app.post("/notice", async (req, res) => {
    let date_ob = new Date();

    let ddate = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

    
    var Notice_id = generateUniqueId();
    try {
        await Flipr.findOneAndUpdate(
            {
                email: req.body.email,
            },
            {
                $addToSet: {
                    notice: [
                        {
                            notice_id: Notice_id,
                            title: req.body.title,
                            content: req.body.content,
                            date: year + "-" + month + "-" + ddate + " " + hours + ":" + minutes,
                        }
                    ]
                }
            }
        )
    }
    catch(error)
    {
        // console.log(error);
    }
    var tempmail = req.session.email
    res.render("notice",{tempmail});
})

app.get("/teacher",(req,res)=>{
    var tempmail = req.session.email;
    res.render("teacher",{tempmail});
})

app.post("/teacher",(req,res)=>{
    var tempmail = req.session.email;
    res.render("teacher_assign",{tempmail});
})
app.get("/student",(req,res)=>{
    var tempmail = req.session.email;
    res.render("student",{tempmail});
})

app.get("/student_assign",(req,res)=>{
    var tempmail = req.session.email;
    res.render("student_assign",{tempmail});
})

app.post("/student_notice", (req, res) => {
    api_email = req.body.button;
    console.log("for notice: " + api_email);
    app.get("/subject_api",(req,res)=>{
        console.log("button1: "+api_email);
    const database = client1.db("FliprX");
    database.collection('fliprxes').
    find({email:api_email}).toArray((err,result)=>{
        if(err) throw error
        // console.log(result[0].email);
        res.send(result)
    })
    })
    res.render("student_notice");
    
})

app.get("/student_notice", (req, res) => {
    res.render("student_notice");
})

app.post("/student",async(req,res)=>{

    console.log("button: "+req.body.button );
    api_email = req.body.button;

    app.get("/subject_api",(req,res)=>{
        console.log("button1: "+api_email);
    const database = client1.db("FliprX");
    database.collection('fliprxes').
    find({email:api_email}).toArray((err,result)=>{
        if(err) throw error
        // console.log(result[0].email);
        res.send(result)
    })
})
var tempmail = api_email;
var usermail = req.session.email;
res.render("student_assign",{usermail,tempmail});
})

app.post("/assigned",async(req,res)=>{

    api_email1 = req.body.button;
    console.log("button: "+req.body.button);
    app.get("/teacher_api",(req,res)=>{
        console.log("button1: "+api_email1);
    const database = client1.db("FliprX");
    database.collection('fliprxes').
    find({email:api_email1}).toArray((err,result)=>{
        if(err) throw error
        // console.log(result[0].email);
        res.send(result)
    })
})
var tempmail=api_email1;
res.render("assigned",{tempmail});
})

app.get("/edit",(req,res)=>{
    res.render("assigned");
})

app.post("/notice_edit", async (req, res) => {
    console.log("_id: " + req.body.notice_id);
    
    try {
        await Flipr.findOneAndUpdate(
            {
                email:req.body.email,
            },
            {$pull : {"notice": {"notice_id":req.body.notice_id}}},
            
        )
        }    
        catch{
            console.log("inside first catch");
    }

    if (req.body.edit != -1) {
        let date_ob = new Date();

    let ddate = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

        await Flipr.findOneAndUpdate(
            {
                email: req.body.email,
            },
            {
                $addToSet: {
                    notice: [
                        {
                            notice_id: req.body.notice_id,
                            title: req.body.title,
                            content: req.body.content,
                            date: "Updated on: "+year + "-" + month + "-" + ddate + " " + hours + ":" + minutes,
                        }
                    ]
                }
            }
        )
    }
    var tempmail = req.session.email;
    res.render("notice_edit", { tempmail });
})
app.post("/edit",async(req,res)=>{

tryemail=req.body.email;
console.log("trying id:"+req.body.assign_id);
console.log("trying date:"+req.body.deadline);

try{
    await Flipr.findOneAndUpdate(
        {
            email:req.body.email,
             
        },
        {$pull : {"assignment": {"assign_id":req.body.assign_id}}},
        
    )
    }    
    catch{
        console.log("inside first catch");
    }
    try{

        await Flipr.updateMany(
            {
                "studentCode.code":req.session.sub_code,
            },
            {$pull:{"studentCode.$.assignment":{"assign_id":req.body.assign_id}}},
    
        )
    }    
    catch{
        console.log("inside first catch");
    }


if(req.body.edit!=-1)
    {
    await Flipr.findOneAndUpdate(
        {
        email: req.body.email,
        },
        {
        $addToSet: {
            assignment:[
                {
                    assign_id:req.body.assign_id,
                    title:req.body.title,
                    content:req.body.content,
                    deadline:req.body.deadline,
                    isSubmitted:false,
                    submission:[
                        {
                            subemail:null,
                        }
                    ]
                    }
            ]
        }}
    )
    await Flipr.updateMany(
        {
            "studentCode.code":req.session.sub_code,
        },
        {"$addToSet":{"studentCode.$.assignment":{"assign_id":req.body.assign_id,"title":req.body.title,"content":req.body.content,"deadline":req.body.deadline,"isSubmitted":false}}},
    )
    }
    
    var tempmail = req.body.email
    res.render("assigned",{tempmail});
})

app.get("/todo",async(req,res)=>{
    res.render("todo");
})

app.post("/todo",(req,res)=>{
    var tempmail = req.session.email;
    console.log(tempmail);
    res.render("todo",{tempmail});
})

app.post("/submit",async(req,res)=>{
    var tempmail = req.body.email;
    var usermail = req.session.email;
    try{
    await Flipr.findOneAndUpdate(
        {
        "email": req.body.email,
        "assignment.assign_id":req.body.assign_id,
        },
        {$pull:{"assignment.$.submission":{"subemail":req.session.email}}},
    )
}
catch
{
console.log("Not submitting");
}
    try{
    await Flipr.findOneAndUpdate(
        {
        "email": req.body.email,
        "assignment.assign_id":req.body.assign_id,
        },
        {$push:{"assignment.$.submission":{"subemail":req.session.email}}},
    )
}
catch
{
console.log("Not submitting");
}
    try{
    Flipr.updateOne(
        {
        "email": req.session.email,
        "studentCode":{
            "$elemMatch":{
                "email":req.body.email,
                "assignment.assign_id":req.body.assign_id,
            }
        },

        },

        { "$set": { 
            "studentCode.$.assignment.$[inner].isSubmitted": true,
        } },
        { "arrayFilters": [
            // { "outer.code": req.session.sub_code},
            { "inner.assign_id": req.body.assign_id,
                }
        ] },
        
        function(err,user){
            if(user)
            {
                console.log("Assignment found: "+user);
            }
            else{
                console.log("Assignment not found");
            }
           
        }
        
    )
}
catch(error)
{
// console.log(error);
}
    res.render("student_assign",{tempmail,usermail});
})

app.post("/Join_Subject", async (req, res) => {
    try {

        await Flipr.updateMany(
            {
                "studentCode.code": req.body.subjectCode,
            },
            
            { $pull: { "studentCode": { "code": req.body.subjectCode } }, }
           
    
        ),
            await Flipr.findOne(
                {
                    "studentCode.code": req.body.subjectCode,
                },
                async function (err, user) {
                    if (user)
                        console.log('techer already exist');
                }
            )
    }    
    catch{
        console.log("inside join subject");
    }
    try {
        var code_alert = ""
        var tempmail = req.session.email;
        console.log(tempmail);
        await Flipr.findOne({
            "teacherCode": req.body.subjectCode,
        },
            async function (err, user) {
                if (user) {
                    req.session.teachemail = user.email;
                    req.session.username = user.username;
                    req.session.subject = user.subject;
                    code_alert = "subject code added"
                    await Flipr.findOneAndUpdate(
                        {
                            "email": tempmail,
                        },
                        {
                            "$addToSet":
                                { "studentCode": { "code": req.body.subjectCode, "email": req.session.teachemail, "subject": req.session.subject, "username": req.session.username, "assignment": user.assignment, } }
                        },
                       
                    )
                    console.log("Found");
                    var beg = "";
                    res.render("student", { tempmail, code_alert,beg });
                }
                else {
                    var beg=""
                    code_alert = "teacher code not found"
                    console.log("teacher code notfound");
                    res.render("student", { tempmail, code_alert,beg });
                }
            }
        )
    } catch (error) {
        // print('errorrrrrrr');
    }
    }
)
app.get("/subject_code",(req,res)=>{
    res.render("subject_code");
})
app.get("/notice", (req, res) => {
    var tempmail = req.session.email;
    res.render("notice",{tempmail});
})
app.get("/notice_edit", (req, res) => {
    app.get("/teacher_api",(req,res)=>{
        console.log("button1: "+req.session.email);
    const database = client1.db("FliprX");
    database.collection('fliprxes').
    find({email:req.session.email}).toArray((err,result)=>{
        if(err) throw error
        // console.log(result[0].email);
        res.send(result)
    })
})
    var tempmail = req.session.email;
    res.render("notice_edit",{tempmail});
})

app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})