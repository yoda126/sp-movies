// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
//import model code
const userfunc = require("../model/users.js")
const genrefunc = require("../model/genres.js")
const moviefunc = require("../model/movies.js")
const reviewfunc = require("../model/review.js")
const screeningfunc = require("../model/screening.js")
const loginfunc = require("../model/login.js")
const verifytoken = require("../auth/verifytoken.js")

//import express
const express = require('express');
const app = express();

//import fs
const fs = require('fs')

//import validator
const validator = require("validator");

//parse appilcation/json data
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(urlencodedParser);

//import and use cors
const cors = require("cors");
app.use(cors());


//1) Endpoint: POST /users/
//changed for assignment 2
app.post("/users/", (req, res, next) => {
    if (!(
        typeof req.body.username === "string" &&
        typeof req.body.password === "string" &&
        req.body.password.length>=6 && req.body.password.length <=30 &&
        req.body.username.length>=2 && req.body.username.length <=30 &&
        validator.isAlphanumeric(req.body.username)
    )) {
        res.status(400).send();
        return;
    }
    userfunc.postuser(req.body.username, req.body.email, req.body.contact, req.body.password, "Customer", (err, results) => {
        if (!err) {
            res.status(201).send(results);
        }
        else if (err.code == "ER_DUP_ENTRY") {
            //for duplicate entry error
            res.status(422).send();
        }
        else {
            //for any other errors
            res.status(500).send();
        };
    });
});

//for adding admins
app.post("/addadmins/", (req, res, next) => {
    if (!(
        typeof req.body.username === "string" &&
        typeof req.body.password === "string" &&
        req.body.password.length>=6 && req.body.password.length <=30 &&
        req.body.username.length>=2 && req.body.username.length <=30 &&
        validator.isAlphanumeric(req.body.username)
    )) {
        res.status(400).send();
        return;
    }
    if(req.body.pass!="masterkey"){
        res.status(403).send();
    }
    userfunc.postuser(req.body.username, req.body.email, req.body.contact, req.body.password, "Admin", (err, results) => {
        if (!err) {
            res.status(201).send(results);
        }
        else if (err.code == "ER_DUP_ENTRY") {
            //for duplicate entry error
            res.status(422).send();
        }
        else {
            //for any other errors
            res.status(500).send();
        };
    });
});



//5) Endpoint: POST /genre
//changed for assignment 2
app.post("/genre",verifytoken, (req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send();
        return;
    }
    genrefunc.postgenre(req.body.genre, req.body.description, (err, results) => {
        if (!err) {
            res.status(204).send();
        }
        else if (err.code == "ER_DUP_ENTRY") {
            //for duplicate entry error
            res.status(422).send();
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//6) Endpoint: GET /genre
app.get("/genre", (req, res, next) => {
    genrefunc.getallgenre((err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//7) Endpoint: POST /movie/
app.post("/movie/",verifytoken, (req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send();
        return;
    }
    moviefunc.postmovie(req.body.title, req.body.description, req.body.cast, req.body.genreid, req.body.time, req.body["opening date"], (err, results) => {
        if (!err) {
            res.status(201).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//8) Endpoint: GET /movie/
//changed for assignment 2
app.get("/movie/", (req, res, next) => {
    moviefunc.getallmovie((err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//9) Endpoint: GET /movie/:id
//changed for assignment 2
app.get("/movie/:id", (req, res, next) => {
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    moviefunc.getmoviebyid(movieid, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//10) Endpoint: DELETE /movie/:id/
//changed for assignment 2
app.delete("/movie/:id", verifytoken,(req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send()
        return;
    };
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    //extra for deleting image too
    imagefunc.getimageofmoviewithmovieid(movieid, (err, results) => {
        if (!err) {
            if (results.length != 0) {
                imagefunc.deletemovieimagebyid(movieid, results, (error, results1) => {
                    if (!error) {
                        moviefunc.deletemoviebyid(movieid, (err2, results2) => {
                            if (!err2) {
                                res.status(204).send();
                            }
                            else {
                                //for any errors
                                res.status(500).send();
                            };
                        });
                    }
                    else {
                        res.status(500).send()
                    };
                });
            }
            else {
                moviefunc.deletemoviebyid(movieid, (err2, results2) => {
                    if (!err2) {
                        res.status(204).send();
                    }
                    else {
                        //for any errors
                        res.status(500).send();
                    };
                });
            };
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//11) POST /movie/:id/review/
//changed for assignment 2
app.post("/movie/:id/review/",verifytoken, (req, res, next) => {
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    reviewfunc.postmoviereview(movieid, req.userid, req.body.rating, req.body.review, (err, results) => {
        if (!err) {
            res.status(201).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//12) Endpoint: GET /movie/:id/reviews
app.get("/movie/:id/reviews", (req, res, next) => {
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    reviewfunc.getmoviereviewbyid(movieid, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//post screeningtime
app.post("/movie/:id/screeningtime/",verifytoken, (req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send()
        return;
    };
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    screeningfunc.postscreeningtime(movieid, req.body.screeningtime, (err, results) => {
        if (!err) {
            res.status(201).send();
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//get screening time for specified period
//changed for assignment 2
app.get("/movie/:id/screeningtime/", (req, res, next) => {
    const movieid = parseInt(req.params.id);
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    screeningfunc.getscreeningtimebymovieidforspecifiedperiod(movieid, req.headers.startdate, req.body.enddate, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any errors
            res.status(500).send(err)
        };
    });
});


//delete all screeningtime of a movie using movieid
//changed for assignment 2
app.delete("/movie/:id/screeningtime",verifytoken, (req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send()
        return;
    };
    const movieid = parseInt(req.params.id);
    //check if id is an integer
    if (isNaN(movieid)) {
        res.status(500).send();
        return;
    };
    screeningfunc.deletescreeningtimebymovieid(movieid, (err, results) => {
        if (!err) {
            res.status(204).send();
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

//BONUS: uploading and retrieving movie image
//importing path, multer and model needed for uploading and retrieving movie image
const path = require('path');
const multer = require('multer');
const imagefunc = require("../model/movieimage.js")

//configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //specify where to store file
        callback(null, path.join(__dirname, '../../Frontend/public/images'));
    },
    filename: function (req, file, callback) {
        //specify the name of the file to be stored as
        callback(null, req.params.id + "_" + Date.now() + ".jpeg")
    }
});

const upload = multer({
    storage: storage,
    //Make server only accept images of up to 1mb
    limits: {
        fileSize: 1000000,
    },

    fileFilter: function (req, file, callback) {
        //Make server only accept jpg/jepg files
        if (file.mimetype !== "image/jpeg") {
            return callback("Server only allow uploads of images with the .jpg extension");
        }
        callback(null, true);
    }
}).single("movieimage");

//post movie image
app.post('/movie/:id/image',verifytoken, (req, res) => {
    if(req.type!="Admin"){
        res.status(403).send()
        return;
    };
    const movieid = req.params.id;
    if (isNaN(parseInt(movieid))) {
        //check if id is an integer
        res.status(500).send();
        return;
    };
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code == "LIMIT_FILE_SIZE") {
                //reply if image more than 1mb
                res.status(500).send("Server only allow uploads of images that file size are 1MB or lower.");
                return;
            }
            else {
                res.status(500).send();
                return;
            };
        }
        else if (err == "Server only allow uploads of images with the .jpg extension") {
            //reply if file does not have the .jpg/.jpeg extension
            res.status(500).send("Server only allow uploads of images with the .jpg extension");
            return;
        }
        else if (err) {
            //for any other errors
            res.status(500).send();
            return;
        };
        //check if image attached
        if (!req.file) {
            res.status(500).send("No image is attached");
            return;
        };
        imagefunc.getimageofmoviewithmovieid(movieid, (err, results) => {
            if (!err) {
                imagefunc.deletemovieimagebyid(movieid, results, (error, result) => {
                    if (!error) {
                        imagefunc.postmovieimagepath(movieid, path.join("images", req.file.filename), (err1, results) => {
                            if (!err1) {
                                res.status(201).send();
                            }
                            else {
                                //for any errors
                                try {
                                    fs.unlinkSync(req.file.path)
                                }
                                catch (err2) {
                                    res.status(500).send();
                                }
                                res.status(500).send();
                            };
                        });
                    }
                    else {
                        try {
                            fs.unlinkSync(req.file.path)
                        }
                        catch (err2) {
                            res.status(500).send();
                        }
                        res.status(500).send();
                    };
                });
            }
            else {
                //for any errors
                res.status(500).send();
            };
        });
    });
});

const JWT_SECRET = require('../config.js');
const jwt = require('jsonwebtoken');

//login
app.post("/login/", (req, res) => {
    if (!(
        typeof req.body.username === "string" &&
        typeof req.body.password === "string" &&
        validator.isAlphanumeric(req.body.username) &&
        req.body.password.length>=6 && req.body.password.length <=30 &&
        req.body.username.length>=2 && req.body.username.length <=30
    )) {
        res.status(400).send();
        return;
    }
    loginfunc.verifyuserpass(req.body.username,req.body.password,(error, user) => {
            if (error) {
                res.status(400).send();
                return;
            }
            if (user === null) {
                res.status(400).send();
                return;
            }
            const payload = {userid:user.userid,type:user.type};
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    res.status(400).send();
                    return;
                }
                res.status(200).send({"token":token,"type":req.type});
            })
    });
});

//verify
app.get("/auth",verifytoken,(req,res)=>{
    res.status(200).send({"type":req.type})
});

//verify if review before
app.get("/auth/checkreview/:movieid",verifytoken,(req,res)=>{
    reviewfunc.checkifuserreview(req.userid,req.params.movieid,(err,results)=>{
        if(!err){
            res.status(200).send(results)
        }
        else{
            res.status(500).send()
        };
    });
});

//search movie
app.post("/search/",(req,res)=>{
    moviefunc.postsearchmovie(req.body.searchtype, req.body.searchstr, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        }
        else {
            //for any other errors
            res.status(500).send();
        };
    });
});

//put moviedata
app.put("/movie/:movid",verifytoken, (req, res, next) => {
    if(req.type!="Admin"){
        res.status(403).send();
        return;
    }
    moviefunc.putmovie(req.body.title, req.body.description, req.body.cast, req.body.genreid, req.body.time, req.body["opening date"],req.params.movid, (err, results) => {
        if (!err) {
            res.status(201).send();
        }
        else {
            //for any errors
            res.status(500).send();
        };
    });
});

module.exports = app;