const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors');
const archiver = require('archiver');

const port = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');

app.use('/images', cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
    // Assuming file is automatically saved to 'uploads/' with multer
    res.json({ url: `/uploads/${req.file.filename}` });
});

app.get('/images', (req, res) => {
    const imageDir = path.join(__dirname, 'uploads');
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            console.error('Failed to list images:', err);
            return res.status(500).send('Failed to list images');
        }
        // Just return the file names, not the full URLs
        const imageFiles = files.map(file => ({ url: `/uploads/${file}` }));
        res.json(imageFiles);
    });
});






// Ensure express can parse JSON bodies
app.use(express.json());

app.post('/save', (req, res) => {
    const filename = req.body.filename || `state-${Date.now()}`;
    const content = req.body.content;  // This should include your HTML directly
    const filepath = path.join(__dirname, 'savedStates', `${filename}.html`); // Note the extension change to .html

    fs.writeFile(filepath, content, 'utf8', (err) => { // Note no JSON.stringify
        if (err) {
            console.error('Failed to save the state:', err);
            return res.status(500).send('Failed to save');
        }
        res.send(`State saved successfully as ${filename}.html`);
    });
});



app.get('/list-saves', (req, res) => {
    const dirPath = path.join(__dirname, 'savedStates');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Failed to list files:', err);
            return res.status(500).send('Failed to list files');
        }
        // Filter out .DS_Store and other unwanted files
        const filteredFiles = files.filter(file => !file.startsWith('.') && file.endsWith('.html'));
        res.json(filteredFiles);
    });
});


app.get('/load', (req, res) => {
    const filename = req.query.filename;
    const filepath = path.join(__dirname, 'savedStates', filename);
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to load the file:', err);
            return res.status(500).send('Failed to load file');
        }
        res.send(data);
    });
});





// Assuming a simple array to hold component data for demonstration purposes
let components = [];

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

function updateComponentRemoveImage(componentId, columnIndex) {
    const component = components.find(c => c.id === componentId);
    if (component && component.columns && columnIndex < component.columns.length) {
        console.log(`Updating component to remove image at index ${columnIndex}`); // Log for debugging
        component.columns[columnIndex].imgUrl = "";
        component.columns[columnIndex].imgStyle = "";
    } else {
        console.log("Failed to find component or column to update."); // Check for failure
    }
}

app.get('/download', (req, res) => {
    const indexHtmlPath = path.join(__dirname, 'index.html');
    const uploadsFolderPath = path.join(__dirname, 'uploads');

    // Create a zip file
    const zip = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    // Set proper headers for the zip file
    res.attachment('packaged-html.zip');
    zip.pipe(res);

    // Append index.html to the zip
    zip.append(fs.createReadStream(indexHtmlPath), { name: 'index.html' });

    // Append each image in the uploads folder to the zip
    fs.readdir(uploadsFolderPath, (err, files) => {
        if (err) {
            console.error('Failed to list images:', err);
            res.status(500).send('Failed to list images');
            return;
        }

        files.forEach(file => {
            zip.append(fs.createReadStream(path.join(uploadsFolderPath, file)), { name: `uploads/${file}` });
        });

        // Finalize the zip and send the response
        zip.finalize();
    });
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('add component', (data) => {
        data.id = Date.now(); // Assign a unique ID
        components.push(data); // Add new component to the array
        io.emit('component added', data);
    });

    socket.on('delete component', (id) => {
        components = components.filter(c => c.id !== id); // Remove component from the array
        io.emit('component deleted', id);
    });

    socket.on('delete image', function(data) {
        console.log(`Received delete image request for component ${data.componentId}, column ${data.columnIndex}`);
        updateComponentRemoveImage(data.componentId, data.columnIndex);
        io.emit('update component', { componentId: data.componentId, columnIndex: data.columnIndex });
    });    

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
