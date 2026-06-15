import jwt from 'jsonwebtoken'

//doctor authentication middleware

const authDoctor=async (req,res,next)=>{
try {
const {token}=req.headers
if(!token){
    return res.json({success:false,message:"Not authorized login Again"})
}

const token_decode= jwt.verify(token,process.env.JWT_SECRET)

console.log(token_decode)

req.docId=token_decode.id



next()
    
} catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
    
}
}



export default authDoctor
