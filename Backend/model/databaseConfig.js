// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const mysql=require('mysql');

const dbConnect={
    getConnection:function(){
        var conn=mysql.createConnection({
            //change to the settings for the mysql set up
            host:"localhost",
            user:"root",
            password:"1qwer$#@!",
            database:"spmovies"
        });
        return conn;
    }
};
module.exports=dbConnect;