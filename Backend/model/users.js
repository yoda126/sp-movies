// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//add 0 infront if input not 2 digits
function add0fortime(time){
    if (time<10){
        time = "0" + time;
    }
    return time;
}; 

//Format the inputdate into a good datetime string
function convertdatetimeformat(inputdate){
    let datestring = `${inputdate.getFullYear()}-${add0fortime(inputdate.getMonth()+1)}-${add0fortime(inputdate.getDate())} ${inputdate.getHours()}:${add0fortime(inputdate.getMinutes())}:${add0fortime(inputdate.getSeconds())}`;
    return datestring;
};

const userfunc = {
    //For 1) Endpoint: POST /users/
    //changed for assignment 2
    postuser: function(username,email,contact,password,type,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            //hash password
            bcrypt.hash(password, saltRounds, function(err, hash) {
                const postuserquery = `INSERT INTO users(username,email,contact,password,type,profile_pic_url) 
                VALUES(?,?,?,?,?,?);`;
                dbConn.query(postuserquery,[username,email,contact,hash,type,""],(err,results)=>{
                    dbConn.end();
                    if (err){
                        return callback(err,null);
                    };
                    const answer = {"userid":results.insertId};
                    return callback(null,answer);
                });
            });

        });
    },
    //For 2) Endpoint: GET /users/
    getalluser: function(callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getalluserquery = "SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM users;";
            dbConn.query(getalluserquery,(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                else if(results.length==0){
                    return callback(err,results)
                };
                try{
                    for(i=0;i<results.length;i++){
                        results[i].created_at = convertdatetimeformat(results[i].created_at);
                    };
                }
                catch (error){
                    return callback(error,results);
                };
                return callback(null,results);
            });
        });
    },
    //For 3) Endpoint: GET /users/:id/
    getuserbyid: function(userid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getuserbyidquery = `SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM users WHERE 
            userid=?;`;
            dbConn.query(getuserbyidquery,[userid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                try{
                    results = results[0];
                    results.created_at = convertdatetimeformat(results.created_at);
                }
                catch (error){
                    return callback(error,results)
                };
                return callback(null,results);
            });
        });
    },
    //For 4) Endpoint: PUT /users/:id/
    updateuserbyid: function(userid,username,email,contact,password,type,profile_pic_url,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const updateuserbyidquery = `UPDATE users
            SET username=?,email=?,contact=?,password=?,type=?,profile_pic_url=?
            WHERE userid=?;`;
            dbConn.query(updateuserbyidquery,[username,email,contact,password,type,profile_pic_url,userid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
};

module.exports = userfunc;