const express = require('express');
const bodyParser = require('body-parser');

const Blog = require('./models/blog');

let app = express();

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// express config 
app.use(express.static('public'));

let xhrOnly = (req, res, next) => {
    if(req.xhr){
        next();
        return;
    }
    res.status(200).sendFile('index.html', {root: __dirname+'/public/'});
};

app.use(['/show', '/index'], xhrOnly);

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.get('/index', (req, res) => {
    res.set({'Content-type':'application/json'});
    Blog.find(null, 'id title name', (err, docs) => {
        res.status(200).send({
            'links': docs
        });
        res.end();
    });
});

app.post('/add', (req, res) => {
    let newBlog = new Blog(req.body);
    newBlog.save();
    res.redirect('index.html');
});

app.get('/show/:id', (req, res) => {
    res.set({'Content-type': 'application/json'});
    if(req.params.id){
        Blog.findById(req.params.id, 'name title blog', (err, blog) => {
            if(err != null){
                res.status(404).json({
                    error: 'No such document'
                });
            }
            else{
                res.status(200).json({
                    blog: blog
                });
            }
        });
    }
});

app.listen(8080, () => {
    global.console.log('Magic happening at localhost:8080...');
});
