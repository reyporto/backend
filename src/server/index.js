const express = require('express');
const bodyparse = require('body-parser');
const data = require('../handler/data');
const app = express();
const port = 8080;
const fs = require('fs');


app.use(bodyparse.urlencoded({ 
    extended: false 
}));

app.use(bodyparse.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

app.use('/api', (req, res, next) => {
    data.read(next);
});

app.post('/api/all', (req, res, next) => {
    data.getAllData(res);
});

app.post('/api/filter/data', (req, res, next) => {
    data.filterData(req, res);
});

app.post('/api/cities', (req, res, next) => {
    data.getCitiesOrTypes(res, 'cities');
});

app.post('/api/types', (req, res, next) => {
    data.getCitiesOrTypes(res, 'types');
});

app.listen(port, () => {
    console.log('Node Server is running on port: ', port);
});