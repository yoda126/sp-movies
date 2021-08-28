// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');
const fs = require('fs')
const path = require('path');

const imagefunc = {
    //For post movie image
    postmovieimagepath: function(movieid,imagepath,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postmovieimagepathquery = `REPLACE INTO movies_image(movieid,imagepath)
            VALUES(?,?);`;
            dbConn.query(postmovieimagepathquery,[movieid,imagepath],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
    //For get movie image with movie id
    getimageofmoviewithmovieid: function(movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getimageofmoviewithmovieidquery = `SELECT imagepath FROM movies_image WHERE 
            movieid=?;`;
            dbConn.query(getimageofmoviewithmovieidquery,[movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                else if(results.length==0){
                    return callback(null,results)
                };
                return callback(null,results[0]["imagepath"]);
            });
        });
    },
    deletemovieimagebyid: function(movieid,movieimagepath,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const deletemovieimagebyidquery = `DELETE FROM movies_image WHERE 
            movieid=?;`;
            dbConn.query(deletemovieimagebyidquery,[movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                }
                if (movieimagepath.length==0){
                    return callback(null,results)
                }
                try{
                    fs.unlinkSync(path.join(__dirname, '../../Frontend/public',movieimagepath))
                }
                catch (error){
                    return callback(error,results)
                }
                return callback(null,results);
            });
        });
    },
}

module.exports=imagefunc