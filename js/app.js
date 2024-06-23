require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Puerto definido en variables de entorno o por defecto 3000

// Conexión a MongoDB usando la variable de entorno MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Middleware para analizar datos de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Modelo de Usuario
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    interestArea: String,
    knowledgeLevel: String,
    availabilityDays: String,
    availabilityTurn: String,
    availabilityMode: String
});
const User = mongoose.model('User', userSchema);

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { name, email, age, interestArea, knowledgeLevel, availabilityDays, availabilityTurn, availabilityMode } = req.body;
    const user = new User({ name, email, age, interestArea, knowledgeLevel, availabilityDays, availabilityTurn, availabilityMode });
    try {
        await user.save();
        res.status(200).send('User registered successfully');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Error registering user');
    }
});
// Ruta para exportar datos a CSV
app.get('/export-csv', async (req, res) => {
    try {
        const users = await User.find({});
        const csv = csvWriter({
            path: 'users.csv',
            header: [
                { id: 'name', title: 'Name' },
                { id: 'age', title: 'Age' },
                { id: 'email', title: 'Email' },
                { id: 'interestArea', title: 'Interest Area' },
                { id: 'knowledgeLevel', title: 'Knowledge Level' },
                { id: 'availability', title: 'Availability' }
            ]
        });
    
        await csv.writeRecords(users);
        res.download('users.csv');
    } catch (err) {
        console.error('Error exporting CSV:', err);
        res.status(500).send('Error exporting CSV');
    }
});

// Servir archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, '..')));

// Ruta de confirmación después del registro
app.get('/confirmation', (req, res) => {
    res.send('<h1>Registro exitoso</h1><br><a href="/">Regresar a la página principal</a>');
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
