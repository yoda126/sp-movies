// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
var app=require('./controller/app.js');
var port=8081;

var server=app.listen(port,function(){

    console.log(`Backend server has started listening on port ${port}`);

});