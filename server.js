const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

     // DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB Connection Successful");
});

//  DATABASE SCHEMA 

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    message: String,
    
    //   CODE FOR DATE & TIME STAMP IN DATABASE 
    date: { 
        type: String, 
        default: () => {
            const now = new Date();
            return now.toLocaleString('en-GB', { 
                hour12: false, 
                timeZone: 'Asia/Kolkata', 
                weekday: 'short', 
                year: 'numeric', 
                month: '2-digit',   
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }).replace(',', ''); 
        }
    }

});





const Contact = mongoose.model("Contact", contactSchema);


app.use(express.static(path.join(__dirname, "public")));



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "VIEWS", "portfolio.html"));
});

app.get("/thank.html", (req, res) => {
  res.sendFile(path.join(__dirname, "VIEWS", "thank.html"));
});

app.get("/calculator", (req, res) => {
    res.sendFile(path.join(__dirname, "VIEWS", "Calculator.html"));
  });

app.post('/', async (req, res) => {
    const { name, email, mobile, message } = req.body;
    const newContact = new Contact({
        name,
        email,
        mobile,
        message

    });

    try {
        await newContact.save();
  console.log(newContact); 
  res.redirect('/thank.html'); 


    } catch (error) {
        console.error("Error saving data: ", error);
        res.status(500).send("Error saving data.");
    }
});

app.listen(8080, () => {
    console.log("App is working on http://localhost:8080");

});


// Start the server  for acessble in phone via pc ip --------------<<

app.get('/', (req, res) => {
    res.send('Hello! Your Node.js server is running at http://172.16.1.89:8080');
});


const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://172.16.1.89:${PORT}`);
});






