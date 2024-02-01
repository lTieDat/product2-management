// gán express vào project
const express = require('express');
const app = express();

//gan body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//gán thư viện popup thông báo cookie-parser và session cho thuw vieen express-flash
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//gan method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//nhung file env
require('dotenv').config();
const port = process.env.PORT ;

//gan database
const database = require('./config/database.js');
database.connect();

//app local variable
const systemConfig = require('./config/system.js');
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// nhung folder public / __dirname 
// local:
// app.use(express.static('public'));
//deploy
app.use(express.static(`${__dirname}/public`));  

//gán view 
//local:
// app.set('views', './views');

// deploy:
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//nhúng client index.router.js vào project
const router = require('./router/client/index.js');
router(app);

//nhúng admin index.router.js vào project (để cuối sau các thư viện)
const adminRouter = require('./router/admin/index.router.js');
adminRouter(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





