const express = require('express')
const mysql = require('mysql');
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

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

// 我的--注册
app.post('/api/regist',(req,res)=>{
    connection.query("INSERT  into test.user VALUES("+null+",'"+req.body.password+"','"+req.body.username+"',"+null+",'"+req.body.phone+"' )" 
    , function (error, results, fields) {
        if (error) throw error;
        res.send('注册成功')
      });
})

// 我的--登录
app.post('/api/login',(req,res)=>{
    connection.query("SELECT * from user where phone =  '"+ req.body.phone+"'", function (error, results, fields) {
        if (error) throw error;
        if(req.body.password == results[0].password ){
            let data ={}
            data.username = results[0].username
            data.phone = results[0].phone
            res.send(data)
        }else{
            res.send('登录失败')
        }
      });
})

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

// 酒店详情-房间列表
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

// 酒店详情-房间列表
app.get('/api/orderRoom',(req,res)=>{
    let data = {}
    connection.query("SELECT * from hotel where id =  '"+ req.query.hotelId+"'", function (error, results, fields) {
        if (error) throw error;
        data.hotel = results[0]
        connection.query("SELECT * from room where id =  '"+ req.query.id+"'", function (error, results, fields) {
            if (error) throw error;
            data.room = results[0]
            res.send(data)
        });
      });
})


// 创建支付订单
app.post('/api/creatOrder',(req,res)=>{
    connection.query("INSERT  into test.order VALUES("+null+",'"+req.body.data.hotelId+"','"+req.body.data.roomId+"','"+req.body.data.status+"','"+req.body.data.price+"','"+req.body.data.startDate+"','"+req.body.data.endDate+"','"+req.body.data.dayNum+"','"+req.body.data.roomNum+"','"+req.body.data.phone+"','"+req.body.data.people+"','"+null+"' )" 
    , function (error, results, fields) {
        if (error) throw error;
        connection.query('select @@IDENTITY', function (error, results, fields) {
            if (error) throw error;
            console.log('aa',results)
            res.send(results[0])
        });
      });
})

// 支付订单
app.get('/api/payOrder',(req,res)=>{
    connection.query("update test.order set status='待入住', payType = '"+ req.query.payType+"'  where id =  '"+ req.query.id+"'", function (error, results, fields) {
        if (error) throw error;
        res.send('success')
      });
})

// 查询订单
app.get('/api/searchOrder',(req,res)=>{
    connection.query("SELECT * from test.order where id =  '"+ req.query.id+"'", function (error, results, fields) {
        if (error) throw error;
        res.send(results[0])
      });
})

// 订单列表
app.get('/api/searchOrderList',(req,res)=>{
    let str = 
    "SELECT  order.id,order.hotelId,status,order.price, startDate,endDate,dayNum,roomNum,people,hotel.name,room.name as rName,picture,room.price as rPrice,room.type from test.order   INNER JOIN test.hotel ON hotel.id = test.order.hotelId  INNER JOIN test.room ON room.id = test.order.roomId  and test.order.phone = " + req.query.phone
    connection.query( str , function (error, results, fields) {
        if (error) throw error;
        res.send(results)
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