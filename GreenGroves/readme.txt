AI setup:
.env - GITHUB_TOKEN
npm install express dotenv cors @azure-rest/ai-inference @azure/core-auth
npm list @azure/core-util @azure/core-auth -for verification

Server dependency installation
npm install express dotenv cors path body-parser mongoose multer

MongoDB Atlas
Step1: Create db in Atlas
Step2: .env - MONGO_URI(add/dbname in conn string)
Step3: Server code modification for connectivity
        dotenv.config({ path: path.join('D:/IASF proj/GreenGroves/.env') });
        const mongoURI = process.env.MONGO_URI;
        mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('MongoDB Atlas connected'))
            .catch(err => console.log('MongoDB connection error:', err));

Render Hosting
Step1: Upload all project pages to your Github Repo(including server.mjs, packgae.json and package-lock.json) - need not add .env file
Step2: Follow steps given in https://render.com/docs/free
        1) sign-up using google account
        2) create new web service
        3) select github repo
        4) check if run and build commands are correct
        5) add .env file, select yes for automatic deploy commits
        6) add custom domains if needed
        7) deploy
        8) if any further changes are made in github codes, clear cache and deploy
        9) once build and deploy is complete, your service is live message shows
        10) Open the link provided below project name which is your domain URL (eg:https://iasf2025.onrender.com)
Step3: Navigate through app and check if backend works
NOTE: Render may take time to open domain after inacivity of more than 15 minutes

Codes to change from localhost to render hosting:

a) For 1-7 => http://localhost:3000 to https://iasf2025.onrender.com

1) app1.js
2) appp.js
3) login.js
4) reghome.html
5) registration.js
6) Volunteering.html
7) volunteering.js

b) For server.mjs
1) Add these lines
	import { fileURLToPath } from 'url';

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

2) Remove path in dotenv.config() line => dotenv.config();

3) Change to app.use(cors({ origin: '*' }));

4) Modify path:
	app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
	app.use(express.static(path.join(__dirname, 'public')));

	app.get('/', (req, res) => {
   		res.sendFile(path.join(__dirname, 'public', 'reghome.html'));
	});

c) For package.json - add these lines at the end
,
  "engines": {
    "node": ">=18"
  }
