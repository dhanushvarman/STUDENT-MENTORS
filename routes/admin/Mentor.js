var express = require('express');
const mongodb  = require('mongodb');
const { connectDb, closeConnection } = require('../../config');
var router = express.Router();

// Creating Mentor
router.post('/create', async function (req, res, next) {

    try {

        const db = await connectDb();
        await db.collection("Mentor").insertOne(req.body)
        await closeConnection();

        res.json({ message: "Mentor Created Successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
});

//Assigning students and mentors
router.put("/addstudent/:mentorId", async function (req,res,error){

    try {
        // Assigning students to mentors
        const db = await connectDb();
        const mentor = await db.collection("Mentor").findOne({_id : mongodb.ObjectId(req.params.mentorId)})
        mentor.student = [...mentor.student,...req.body.student]
        await db.collection("Mentor").updateOne({_id: mongodb.ObjectId(req.params.mentorId)},{$set:{student : mentor.student}})

        // updating  students list
        req.body.student.forEach(async (stud) => {
            const db = await connectDb();
            const temp = await db.collection("Student").findOne({_id : mongodb.ObjectId(stud) });
            temp.mentorAssigned = req.params.mentorId;
            await db.collection("Student").updateOne({_id : mongodb.ObjectId(temp._id)},{$set : {mentorAssigned : temp.mentorAssigned}})
          });

          await closeConnection();
        
        res.json({message:"Student and Mentor Assigned Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
})

//Show All the Mentors
router.get("/showMentor", async(req,res)=>{
    
    try {
        const db = await connectDb();
        const Mentors = await db.collection("Mentor").find({}).toArray()
        await closeConnection()

        res.json(Mentors)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
})
//Show students in mentor
router.get("/getStudents/:mId", async (req,res) => {

    try {
        const db = await connectDb();
        const mentor = await db.collection("Mentor").findOne({_id : mongodb.ObjectId(req.params.mId)})
        var studentName = [];
        mentor.student.map(async (stud) => {
            const studentDetail = await db.collection("Student").findOne({_id : mongodb.ObjectId(stud)})
            studentName.push(studentDetail.name)
            if(studentName.length == mentor.student.length){
                res.json(studentName)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
})

module.exports = router;
