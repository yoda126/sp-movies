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

const screeningfunc = {
    //For post screening time of movie
    //changed for assignment 2
    postscreeningtime:function(movieid,screeningtime,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postscreeningtimequery = `INSERT INTO movies_screening(movieid,screeningtime)
            VALUES(?,?);`;
            dbConn.query(postscreeningtimequery,[movieid,screeningtime],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
    //For get screening time by movieid for a specified period(startdate,enddate) 
    getscreeningtimebymovieidforspecifiedperiod: function(movieid,startdate,enddate,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            //checking if startdate or enddate is undefined and changeing the query and query list to fit
            if (typeof startdate=="undefined" && typeof enddate=="undefined"){
                var getscreeningtimeofmoviequery = "SELECT screeningtime FROM movies_screening WHERE movieid=?";
                var querylist = [movieid];
            }
            else if(typeof startdate=="undefined"){
                var getscreeningtimeofmoviequery = `SELECT screeningtime FROM movies_screening WHERE movieid=? AND
                screeningtime<=CAST(? AS datetime)`
                var querylist = [movieid,enddate]
            }
            else if(typeof enddate=="undefined"){
                var getscreeningtimeofmoviequery = `SELECT screeningtime FROM movies_screening WHERE movieid=? AND
                screeningtime>=CAST(? AS datetime)`;
                var querylist = [movieid,startdate]
            }
            else{
                var getscreeningtimeofmoviequery = `SELECT screeningtime FROM movies_screening WHERE movieid=? AND
                screeningtime>=CAST(? AS datetime) AND screeningtime<=CAST(? AS datetime);`;
                var querylist = [movieid,startdate,enddate];
            }
            dbConn.query(getscreeningtimeofmoviequery,querylist,(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                else if(results.length==0){
                    return callback(err,[]);
                };
                let screeninglist = []
                try{
                    for(let i=0;i<results.length;i++){
                        screeninglist.push(convertdatetimeformat(results[i]["screeningtime"]));
                    };
                    return callback(null,screeninglist);
                }
                catch(error){
                    return(error,null)
                }
            });
        });
    },
    //For delete screening time of movie by movie id
    deletescreeningtimebymovieid:function(movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const deletscreeningtimebyemoviebyidquery = `DELETE FROM movies_screening
            WHERE movieid=?`;
            dbConn.query(deletscreeningtimebyemoviebyidquery,[movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                return callback(null,results);
            });
        });
    },
    //For delete screening time of movie using screening id
    deletescreeningtimebyscreeningid:function(screeningid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const deletescreeningtimebyscreeningidquery = `DELETE FROM movies_screening
            WHERE screeningid=?`;
            dbConn.query(deletescreeningtimebyscreeningidquery,[screeningid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
};

module.exports=screeningfunc;
