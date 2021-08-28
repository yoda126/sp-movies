// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const db = require('./databaseConfig.js');
const bcrypt = require('bcrypt');

const loginfunc = {
    verifyuserpass: function(username, password, callback) {
        const dbConn=db.getConnection();
        dbConn.connect(function (err){
            if(err){
                return callback(err,null);
            };
            const passwordquery = "SELECT userid,password,type FROM users WHERE username = ? LIMIT 1";
            dbConn.query(passwordquery,[username],(err,results)=>{
                dbConn.end();
                if (err){
                    return callback(err,null);
                };
                if(!results.length){
                    return callback(null,null)
                }
                const user = results[0];
                bcrypt.compare(password, user.password, (error, compareResult) => {
                    if (error) {
                        return callback(error, null);
                    }
                    if (!compareResult) {
                        return callback(null, null);
                    }
                    return callback(null, user);
                });
            });
        });

    },
}

module.exports = loginfunc;