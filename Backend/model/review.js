// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');

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

const reviewfunc = {
    //For 11) POST /movie/:id/review/
    postmoviereview: function(movieid,userid,rating,review,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postmoviereviewquery = `INSERT INTO movies_review(movieid,userid,rating,review)
            VALUES(?,?,?,?);`;
            dbConn.query(postmoviereviewquery,[movieid,userid,rating,review],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                let answer = {"reviewid":results.insertId}
                return callback(null,answer);
            });
        });
    },
    //12)For Endpoint: GET /movie/:id/reviews
    getmoviereviewbyid: function(movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getmoviereviewbyidquery = `SELECT movies.movieid,users.userid,username,rating,review,movies_review.created_at FROM movies
            INNER JOIN movies_review on movies.movieid=movies_review.movieid 
            INNER JOIN users on movies_review.userid=users.userid
            WHERE movies.movieid=?;`;
            dbConn.query(getmoviereviewbyidquery,[movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                else if(results.length==0){
                    return callback(err,results);
                };
                for(i=0;i<results.length;i++){
                    try{
                        results[i].created_at = convertdatetimeformat(results[i].created_at)
                    }
                    catch(error){
                        return(error,null)
                    }
                };
                return callback(null,results);
            });
        });
    },
    //check if review before
    checkifuserreview: function(userid,movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getmoviereviewbyidquery = `SELECT * FROM movies_review
            WHERE userid=? AND movieid=?;`;
            dbConn.query(getmoviereviewbyidquery,[userid,movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                else if(results.length==0){
                    return callback(null,"no");
                };
                return callback(null,"yes");
            });
        });
    },
};

module.exports = reviewfunc;