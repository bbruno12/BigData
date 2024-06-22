const express = require('express');
const mongoose = require('mongoose');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const app = express();
const port = 3000;

// Conexión a MongoDB
mongoose.connect('mongodb+srv://bbustamante1:admin1234@conexionbd.9yoivbt.mongodb.net/ConexionBD', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Middleware para analizar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Modelo de Usuario
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    interestArea: String,
    knowledgeLevel: String,
    availability: String
});
const User = mongoose.model('User', userSchema);

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { name, email, interestArea, knowledgeLevel, availability } = req.body;
    const user = new User({ name, email, interestArea, knowledgeLevel, availability });
    try {
        await user.save();
        // Redireccionar a una página de confirmación después del registro
        res.redirect('/confirmation');
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
