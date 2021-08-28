// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');

const moviefunc ={
    //For 7) Endpoint: POST /movie/
    postmovie: function(title,description,cast,genreids,time,opendate,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postmoviequery = "INSERT INTO movies(title,description,cast,time,`opening date`)VALUES(?,?,?,?,?);";
            dbConn.query(postmoviequery,[title,description,cast,time,opendate],(err,results)=>{
                if (err){
                    return callback(err,null);
                };
                genreidlist = genreids.split(",")
                const postmovie_genrequery = `INSERT INTO movies_genres(movieid,genreid)
                VALUES(?,?)`;
                for (i=0;i<genreidlist.length;i++){
                    dbConn.query(postmovie_genrequery,[results.insertId,genreidlist[i]],(error,response)=>{
                        if (error){
                            return callback(error,null);
                        };
                    });
                }
                const answer = {"movieid":results.insertId}
                return callback(null,answer);
            });
        });
    },
    //For 8) Endpoint: GET /movie/
    //changed to fit assignment 2
    getallmovie: function(callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getallmoviequery = "SELECT movies.movieid,title,time,imagepath FROM movies LEFT JOIN movies_image ON movies.movieid = movies_image.movieid;";
            dbConn.query(getallmoviequery,(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
    //For 9) Endpoint: GET /movie/:id
    //changed for assignment2
    getmoviebyid: function(movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const getmoviesgenrebyidquery = `SELECT genres.genre FROM movies
            INNER JOIN movies_genres on movies.movieid = movies_genres.movieid
            INNER JOIN genres on movies_genres.genreid = genres.genreid
            WHERE movies.movieid = ?;`;
            dbConn.query(getmoviesgenrebyidquery,[movieid],(err,results)=>{
                if (err){
                    return callback(err,null);
                }
                else{
                    try{
                        let genreslist =[]
                        for(i=0;i<results.length;i++){
                            genreslist.push(results[i].genre);
                        };
                        var genres_string = genreslist.join(",");
                    }
                    catch(error){
                        return callback(error,null)
                    }
                    const getmovieinfobyidquery = `SELECT movies.movieid,title,description,cast,time,\`opening date\`,imagepath FROM movies
                    LEFT JOIN movies_image ON movies.movieid = movies_image.movieid
                    WHERE movies.movieid=?`;
                    dbConn.query(getmovieinfobyidquery,[movieid],(err,results2)=>{
                        if (err){
                            return callback(err,null);
                        }
                        else if ((results2.length) == 0){
                            return callback(null,results);
                        }
                        else{
                            try{
                                let answer = JSON.parse(JSON.stringify(results2[0]));
                                answer["genre"]=genres_string;
                                return callback(null,answer);
                            }
                            catch(error){
                                return callback(error,null)
                            }
                        };
                    });
                };
            });
        });
    },
    //For 10) Endpoint: DELETE /movie/:id/
    deletemoviebyid:function(movieid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const deletemoviebyidquery = `DELETE FROM movies
            WHERE movieid=?`;
            dbConn.query(deletemoviebyidquery,[movieid],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                return callback(null,results);
            });
        });
    },
    postsearchmovie:function(searchtype,searchstr,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            let searchmoviequery = ""
            if(searchtype=="Title"){
                searchmoviequery = `SELECT movies.movieid,title,time,imagepath 
                FROM movies LEFT JOIN movies_image ON movies.movieid = movies_image.movieid
                WHERE title LIKE ?;`;
                searchstr = "%" + searchstr + "%"
            }
            else if(searchtype=="Genre"){
                searchmoviequery = `SELECT movies.movieid,movies.title,movies.time,imagepath FROM movies
                LEFT JOIN movies_image ON movies.movieid = movies_image.movieid
                INNER JOIN movies_genres on movies.movieid = movies_genres.movieid
                INNER JOIN genres on movies_genres.genreid = genres.genreid
                WHERE genres.genre LIKE ?;`
                searchstr = "%" + searchstr + "%"
            }
            else if(searchtype=="Genreid"){
                searchmoviequery = `SELECT movies.movieid,movies.title,movies.time,imagepath FROM movies
                LEFT JOIN movies_image ON movies.movieid = movies_image.movieid
                INNER JOIN movies_genres on movies.movieid = movies_genres.movieid
                INNER JOIN genres on movies_genres.genreid = genres.genreid
                WHERE genres.genreid = ?;`
            }
            else{
                return callback("searchtype not Title, Genre or Genreid",null)
            };
            dbConn.query(searchmoviequery,[searchstr],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                if(searchtype=="Title"){
                    return callback(null,results);
                }
                let response = JSON.stringify([...new Map(results.map(item => [item["movieid"], item])).values()]);
                return callback(null,response);
            });
        });
    },
    putmovie: function(title,description,cast,genreids,time,opendate,movid,callback){
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const postmoviequery = "UPDATE movies SET title=?,description=?,cast=?,time=?,`opening date`=? WHERE movieid=?;";
            dbConn.query(postmoviequery,[title,description,cast,time,opendate,movid],(err,results)=>{
                if (err){
                    return callback(err,null);
                };
                deletegenrequery = `DELETE FROM movies_genres WHERE movieid=?`
                dbConn.query(deletegenrequery,[movid],(error,response)=>{
                    if (error){
                        return callback(error,null);
                    };
                });
                if(genreids){
                genreidlist = genreids.split(",")
                }
                else{
                    genreidlist = ""
                }
                const postmovie_genrequery = `INSERT INTO movies_genres(movieid,genreid)
                VALUES(?,?)`;
                for (i=0;i<genreidlist.length;i++){
                    dbConn.query(postmovie_genrequery,[movid,genreidlist[i]],(error,response)=>{
                        if (error){
                            return callback(error,null);
                        };
                    });
                }
                const answer = {"movieid":movid}
                return callback(null,answer);
            });
        });
    },
    //For Search movie endpoint
};

module.exports = moviefunc;