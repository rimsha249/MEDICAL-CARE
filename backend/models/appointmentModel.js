import mongoos from "mongoose";


const appointmentSchema = new mongoos.Schema({
    userId:{type:String, required:true},
    docId:{type:String, required:true},
    slotDate:{type:String, required:true},
    slotTime:{type:String, required:true},
    userData:{type:Object, required:true},
    docData:{type:Object, required:true},
    amount:{type:Number, required:true},
   
    cancelled:{type:Boolean, default:false},
    payment:{type:Boolean, default:false},
    isCompleted:{type:Boolean, default:false}


})

const appointmentModel=mongoos.model.appointmentModel
 || mongoos.model("appointment", appointmentSchema)

export default appointmentModel