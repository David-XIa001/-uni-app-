const express = require('express')
const mysql = require('mysql');
const app = express()

// 静态资源
app.use('/public/', express.static('./public/'))
app.use('/static/', express.static('./static/'))

// //设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

// 链接数据库
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'test'
  });

connection.connect();
 
 
// connection.end();


// 首页--获取所有酒店
app.get('/api/hotelList',(req,res)=>{
    connection.query('SELECT * from hotel', function (error, results, fields) {
        if (error) throw error;
        res.send(results)
      });
})

// 根据城市查询酒店
app.get('/api/searchHotel',(req,res)=>{
    connection.query("SELECT * from hotel where city =  '"+ req.query.city+"'", function (error, results, fields) {
        if (error) throw error;
        res.send(results)
      });
})

// 酒店详情
app.get('/api/searcRoom',(req,res)=>{
    let data = {}
    connection.query("SELECT * from hotel where id =  '"+ req.query.id+"'", function (error, results, fields) {
        if (error) throw error;
        data.hotel = results[0]
        connection.query("SELECT * from room where hotelId =  '"+ req.query.id+"'", function (error, results, fields) {
            if (error) throw error;
            data.room = results
            res.send(data)
        });
      });


})


app.get('/update',(req,res)=>{
    connection.query('  update user set password=666666 where username = 123456', function (error, results, fields) {
        if (error) throw error;
        res.send(results[0])
      });
})


app.listen(3001,()=>{
    console.log('服务启动')
})