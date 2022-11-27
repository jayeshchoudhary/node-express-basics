const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
    console.log(req.query);
    try {
        const data = fs.readFileSync("students.json", "utf8");
        let studentData = JSON.parse(data);

        studentData = studentData.filter((student) =>
            student.name.includes(req.query.name)
        );

        res.status(200).json(studentData);
    } catch (err) {
        res.status(500).json({ error: true, message: "something went wrong" });
    }
});

// GET students data
app.get("/students/all", (req, res) => {
    try {
        const data = fs.readFileSync("students.json", "utf8");
        const studentData = JSON.parse(data);

        res.status(200).json(studentData);
    } catch (err) {
        res.status(500).json({ error: true, message: "something went wrong" });
    }
});

// Create a student
app.post("/students", (req, res) => {
    const newStudent = {};
    let studentLength = 0;
    let currentStudentData = [];

    try {
        const data = fs.readFileSync("students.json", "utf8");
        currentStudentData = JSON.parse(data);

        studentLength = currentStudentData.length;
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "something went wrong" });
    }

    newStudent.id = studentLength + 1;
    newStudent.name = req.body.name;
    newStudent.age = req.body.age;

    const content = [...currentStudentData, newStudent];

    try {
        fs.writeFileSync("students.json", JSON.stringify(content, "", 4));
    } catch (err) {
        console.error(err);
    }

    res.status(200).json(content);
});

// edit a student with id
app.put("/students/:studentId", (req, res) => {
    const newStudent = {};
    let currentStudentData = [];

    try {
        const data = fs.readFileSync("students.json", "utf8");
        currentStudentData = JSON.parse(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "something went wrong" });
    }

    currentStudentData = currentStudentData.map((student) => {
        if (student.id == req.params.studentId) {
            const editedStudent = {
                id: student.id,
                name: req.body.name || student.name,
                age: req.body.age || student.age,
            };

            return editedStudent;
        }

        return student;
    });

    try {
        fs.writeFileSync(
            "students.json",
            JSON.stringify(currentStudentData, "", 4)
        );
    } catch (err) {
        console.error(err);
    }

    res.status(200).json(currentStudentData);
});

// Delete a student with id
app.delete("/students/:studentId", (req, res) => {
    let currentStudentData = [];

    try {
        const data = fs.readFileSync("students.json", "utf8");
        currentStudentData = JSON.parse(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "something went wrong" });
    }

    currentStudentData = currentStudentData.filter((student) => {
        if (student.id == req.params.studentId) {
            return false;
        }

        return true;
    });

    try {
        fs.writeFileSync(
            "students.json",
            JSON.stringify(currentStudentData, "", 4)
        );
    } catch (err) {
        console.error(err);
    }

    res.status(200).json(currentStudentData);
});

app.listen(9001, () => {
    console.log("server is running on port 9001");
});

// CRUD
// Create - POST
// Read - GET
// Update - PUT
// Delete - DELETE
