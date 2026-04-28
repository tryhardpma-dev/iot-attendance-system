import express from 'express';
import { getPairs, addPair, updatePair, deletePair } from './services/CvikService.js';
import {
    getStudents,
    addStudent,
    deleteStudent,
    updateStudentPresence,
    deleteAllStudents, updatedStudents, getAttendanceByStudentId, updateAttendance,
} from './services/StudentsService.js';
import cors from "cors";
import bodyParser from 'body-parser';
import { findUserByLogin, verifyPassword } from './services/UserService.js';


const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'], 
};
app.options('/students/status/stream', cors({ origin: '*' }));
app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Server is running!');
});


app.get('/cviky', async (req, res) => {
    console.log('Gained response on /cviky');
    try {
        const pairs = await getPairs();
        res.status(200).json(pairs);
    } catch (err) {
        console.error('Error retrieving pairs:', err);
        res.status(500).send('Error from server');
    }
});


app.post('/cviky', async (req, res) => {
    const { day_name, time_start, time_end } = req.body;
    try {
        const newPair = await addPair(day_name, time_start, time_end);
        res.status(201).json(newPair);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});

app.put('/cviky/:id', async (req, res) => {
    const { id } = req.params;
    const { day_name, time_start, time_end } = req.body;
    try {
        const updatedPair = await updatePair(id, day_name, time_start, time_end);
        res.status(200).json(updatedPair);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});


app.delete('/cviky/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deletePair(id);
        res.status(204).send(); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});



app.get('/students', async (req, res) => {
    try {
        const students = await getStudents();
        res.status(200).json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});

app.post("/students", async (req, res) => {
    const { isic, first_name, last_name, cviky_id } = req.body;

    try {
        const newStudent = await addStudent(isic, first_name, last_name, cviky_id);
        res.status(201).json(newStudent);
    } catch (error) {
        console.error("Error adding student:", error.message);
        res.status(500).send("Error from server");
    }
});


// Удалить студента
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteStudent(id);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});


app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { present } = req.body;
    try {
        const updatedStudent = await updateStudentPresence(id, present);
        res.status(200).json(updatedStudent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error from server');
    }
});

app.delete("/students/cviky/:cvikyId", async (req, res) => {
    const { cvikyId } = req.params;

    try {
        await deleteAllStudents(cvikyId);
        res.status(204).send(); // Успешно, без содержимого
    } catch (error) {
        console.error("Error deleting students:", error.message);
        res.status(500).send("Error from server");
    }
});

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    console.log('Тело запроса:', req.body);
    try {
        const user = await findUserByLogin(login);

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await verifyPassword(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Welcome!', user: { login: user.login, role: user.role_server } });
    } catch (error) {
        console.error('Invalid login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/students/cviky/:cvikyId', async (req, res) => {
    const { cvikyId } = req.params;
    try {
        const students = await updatedStudents(cvikyId);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students for pair:', error.message);
        res.status(500).send('Error from server');
    }
});

app.get('/attendance/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const attendance = await getAttendanceByStudentId(studentId);

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance data:', error.message);
        res.status(500).send('Error from server');
    }
});

app.put('/attendance', async (req, res) => {
    const { studentIsic, weekNumber, attended } = req.body;
    try {
        const updatedAttendance = await updateAttendance(studentIsic, weekNumber, attended);
        res.status(200).json(updatedAttendance);
    } catch (error) {
        console.error('Error updating attendance:', error.message);
        res.status(500).json({ error: 'Failed to update attendance data.' });
    }
});





