// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');

const genrefunc = {
    //For 5) Endpoint: POST /genre
    postgenre: function(genre,descrip,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postgenrequery = `INSERT INTO genres(genre,description)
            VALUES(?,?);`;
            dbConn.query(postgenrequery,[genre,descrip],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
    //For 6) Endpoint: GET /genre
    getallgenre: function(callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getallgenreinfoquery = "SELECT * FROM genres;";
            dbConn.query(getallgenreinfoquery,(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
};

module.exports = genrefunc;