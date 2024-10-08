const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const cors = require("cors")

require('./config/passport')(passport);

const app = express();


app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname+'/public/uploads'));


app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.listen(9000);

const db = require('./config/keys').mongoURI;
// mongoose.connect(db, {  useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true, });
//   mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
//   mongoose.connection.on("error", (err) => {
//     console.error(`🚫 Error → : ${err.message}`);
//   });


mongoose.connect(db, {  useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true, })
    .then(() =>
        console.log('MongoDB successfully connected.')
    ).catch(err => console.log(err));


app.use(passport.initialize());

app.use('/api', users);

// app.use(express.static(path.join(__dirname, 'client/build')));

// app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
const port = process.env.PORT || 8000;

app.listen(3001, () => {
  console.log(`Server up and running on port ${3001}!`);
});
