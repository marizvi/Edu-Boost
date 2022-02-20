const mongoose = require('mongoose');

const MySchema = new mongoose.Schema({
    email:{
      type:String,
      // unique:true
    },
   password:{
      type:String,
      // required:[true,"length should be min 6"],
      // minLength:[6,"minimum password length should be 6"],
   },
   isStudent:{
      type:Boolean,
   },
   isTeacher:{
      type:Boolean,
   },
   subject:{
      type:String,
   },
   username:{
      type:String,
   },
   teacherCode:{
      type:String,
   },
   studentCode:[
      {
         code:{type:String},
         email:{type:String},
         subject:{type:String},
         username:{type:String},
         assignment:[
            {
             assign_id:{type:String},
             title:{type:String},
             content:{type:String},
             deadline:{type:Date},
             isSubmitted:{type:Boolean},
            }]
      }
   ],
   notice: [
      {
         notice_id:{type:String},
         title: { type: String },
         content: { type: String },
         date:{type:String},
      }    
   ],
   assignment:[
      {
       assign_id:{type:String},
       title:{type:String},
       content:{type:String},
       deadline:{type:Date},
       isSubmitted:{type:Boolean},
       submission:[
                     {
                     subemail:{type:String},
                     }
                  ]
      }
   ]
 
    // product:[
    // {
    //   item:{type:String},
    //   quantity:{type:Number},
    //   price:{type:Number},
    // }
        // ]
  });
  //collection will be created as plural of 'Cart'(name provided here)
  //nothing related to LHS Cart it is our own variable
  //collection name in database will depeng on model('Cart').
  const Flipr = mongoose.model('FliprX', MySchema);
  module.exports= Flipr;