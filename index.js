const express = require("express");
const cors = require("cors");

const app = express();

const { initializeDatabase } = require('./db/db.connect')
const Students = require('./models/students.models')

const corsOpt = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOpt));

initializeDatabase();

app.get("/", async (req, res) => {
  res.send("Hello, Express!")
});

const getAllStudents = async () => {
  try {
    const student = await Students.find();
    return student
  } catch (error) {
    throw error
  }
}

app.get('/students', async (req, res) => {
  try {
    const student = await getAllStudents();

    if(student){
      res.status(200).json(student)
    } else {
      res.status(404).json({message: "Not Found."})
    }
  } catch (error) {
    res.status(500).json({error: 'Internal server error.'})
  }
})

const seedStudent = async (student) => {
  try {
    const newStudent = new Students(student)
    const saveStudent = await newStudent.save()
    return saveStudent    
  } catch (error) {
    throw error
  }
}

app.post('/students', async (req, res) => {
  try {
    const newStudent = req.body;

    const students = await seedStudent(newStudent)

    if(students){
      res.status(201).json(students)
    }
  } catch (error) {
    res.status(500).json({error: 'Internal server error.'})
  }
})


const updateStudentData = async (studentId, updatedStudentData) => {
  try {
    const student = await Students.findByIdAndUpdate(studentId, updatedStudentData, {new: true})
    return student
  } catch (err) {
    throw err
  }
}


app.put('/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudentData = req.body;

    const student = await updateStudentData(studentId, updatedStudentData)

    if(student){
      res.status(200).json({message: "Updated Successfully.", student: student})
    } else {
      res.status(404).json({message: "Student not found."})
    } 
  } catch (error) {
    res.status(500).json({error: "Internal server error."})
  }
})

const removeStudent = async (studentId) => {
  const deletedStudent = await Students.findByIdAndDelete(studentId)
  return deletedStudent
}


app.delete('/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id
    const deletedStudent = await removeStudent(studentId)

    if(deletedStudent) {
      res.status(200).json({message: "Student deleted successfully", student:deletedStudent})
    } else {
      res.status(404).json({message: 'Student not found.'})
    }
  } catch (err) {
    res.status(500).json({error: "Internal server error."})
  }
}) 


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})