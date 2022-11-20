var express = require('express');
const mongodb  = require('mongodb');
const { connectDb, closeConnection } = require('../../config');
var router = express.Router();

//Creating a Student
router.post('/create', async function (req, res, next) {

    try {

        const db = await connectDb();
        await db.collection("Student").insertOne(req.body)
        await closeConnection();

        res.json({ message: "Student Created Successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
});

//Modify Mentor for a Student
router.put("/:sId", async (req,res)=>{

    try {
        const db = await  connectDb();
        const student = await db.collection("Student").findOne({_id : mongodb.ObjectId(req.params.sId) })
        const oldMentor = student.mentorAssigned;
        student.mentorAssigned = req.body.newMentorId;
        await db.collection("Student").updateOne({_id : mongodb.ObjectId(req.params.sId)},{$set : {mentorAssigned : student.mentorAssigned}})

        const mentor = await db.collection("Mentor").findOne({_id : mongodb.ObjectId(oldMentor)})
        const index = mentor.student.indexOf(req.params.sId)
        mentor.student.splice(index,1)
        mentor.student.push(req.body.newMentorId)
        await db.collection("Mentor").updateOne({_id : mongodb.ObjectId(oldMentor)},{$set:{student : mentor.student}})

        const newMentor = await db.collection("Mentor").findOne({_id : mongodb.ObjectId(req.body.newMentorId)})
        newMentor.student.unshift(req.params.sId)
        await db.collection("Mentor").updateOne({_id: mongodb.ObjectId(req.body.newMentorId)},{$set:{student : newMentor.student}})

        await closeConnection();
        
        res.json({message:"Mentor Changed Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
})

module.exports = router;
