import mongoose from "mongoose";
import bcryptjs from "bcryptjs";


const userSchema = new mongoose.Schema({
     
    //createdAt,Updated 
       fullName:{
          type:String,
          required:true,

       },
       email:{
         type:String,
         required:true,
         unique:true
       },
       password:{
         type:String,
         required:true,
         minlength:6
       },
       bio:{
         type:String,
         default:"",
       },
       profilePic:{
         type:String,
         default:" ",
       },
       nativeLanguage:{
         type:String,
         default:"English",
         required:true
       },
      
         learningLanguage:{
              type:String,
              default:"English",
              required:true
         },
         location:{
            type:String,
            default:""
         },
       
       isOnboarded:{
           type:Boolean,
           default:false,
       },
       friends:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"


       }
    ]
       
        
       

    //member since createdAt

      
},{timestamps:true})



//pre hook
//priya -pass->123123=> hash it 




     // Hash password before saving
      userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User",userSchema);

export default User;

