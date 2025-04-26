const express = require('express');
const path = require('path');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const Util = require('./domain/util');
require('dotenv').config();
const upload = multer({ 
    dest: 'uploads/', 
    fileFilter: Util.fileFilter,
    limits: { fileSize: 1024 * 1024 * 2}, // 2MB limit
});
const app = express();

//routing
let apiRouter =  require('./routes/api');
app.use('/api', apiRouter);


// Middleware for serving static files
app.use(express.static(path.resolve(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

//handlebars stuff
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
const hbs = require('hbs');
const partialsDir = __dirname + '/views/partials';
let readmeContent = null;
let filenames = fs.readdirSync(partialsDir);
for (let i = 0; i < filenames.length; i++) {
    let matches = /^([^.]+).hbs$/.exec(filenames[i]);
    if (!matches) {
      return;
    }
    let name = matches[1];
    let template = fs.readFileSync(partialsDir + '/' + filenames[i], 'utf8');
    hbs.registerPartial(name, template);
}


//Controllers
const TransacionController = require('./controllers/transactionController');
const AdminController = require('./controllers/adminController');

//FileParserFactory
const FileParserFactory = require('./domain/fileParserFactory');
const fileParserFactory = new FileParserFactory();

// Serve the main index page
app.get('/', (req, res) => {
    if( !readmeContent) {
        try {
            let readme =path.resolve(__dirname, '../README.md');
            // const readme = __dirname + '..//views/partials';
            readmeContent = fs.readFileSync( readme, 'utf8');
            console.log("readmeContent", readmeContent);
        } catch (error) {
            console.error('Error reading README.md:', error);
            
        }
    }
    res.render('index', {
        readme: readmeContent
    });
});

app.get('/upload', (req, res) => {
    res.render('upload', {});
});


app.get('/transactions', (req, res) => {
    res.render('transactions', {});
});
app.get('/errors', (req, res) => {
    res.render('errors', {});
});

app.get('/aggregates', (req, res) => {
    res.render('aggregates', {});
});

app.get('/upload', (req, res) => {
    res.render('upload', {});
});

app.post('/upload', function (req, res) {
    upload.single('file')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        res.render('upload', {
            error: 'Error occurred while uploading file: ' + err.message
        });
      } else if (err) {
        res.render('upload', {
            error: 'Error occurred while uploading file: ' + err.message
        });
      }else{
        const filePath = req.file.path;
        const fileName = req.file.originalname;
        let results = null;
        try {
            let parser = fileParserFactory.getParser(fileName);
            results = await parser.parse(filePath);
            const transacionController = new TransacionController();
            stats = await transacionController.processFileTransactional(req.file.originalname, results);
            res.render('transactions', {currentFile: req.file.originalname});
        } catch (error) {
            res.render('upload', {
                error: 'Error occurred while parsing file: ' + error.message
            });
        }
       
    }
    })
})

bootstrapDB = async () => {
    const controller = new AdminController();
    try {
        await controller.createTables();
        console.log("Database initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}
// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try{
        await bootstrapDB();
    }catch (error) {
        console.error("Error bootstrapping DB:", error);
    }
});