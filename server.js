import Express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import request from 'request'
import * as fs from 'fs';
import getJSONFiles from './readNodeModules'
const pjson = require('./package.json');

// require the project's package.json
// get all the dependencies
const packageNames = Object.keys(pjson.dependencies);

const isRelevantPackage = filename => {
    filename = filename.match(/.\/node_modules\/(.*?)\/package.json/)[1];
    return packageNames.indexOf(filename) > -1;
}


getJSONFiles().then(files => files.filter(isRelevantPackage)).
    then(filteredFiles => console.log(filteredFiles))



const app = Express();
const PORT = 5000;
const ACCESS_TOKEN = '57ed1327b1c176eb1326f3cdad8fc530e633e893';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const config = query => ({
    method: 'GET',
    uri: `https://api.github.com/search/repositories?q=${query}+in%3Aname&access_token=${ACCESS_TOKEN}`,
    headers: {
        'User-Agent': 'request',
        'Accept': 'application/vnd.github.v3+json'
    }
});

const getRepo = myConfig => {
    return new Promise((resolve, reject) => {
        request(myConfig, (err, res, body) => {
            if (err) return reject(err);
            resolve(JSON.parse(body).total_count)
        })
    })
}

app.get('/', (req, res) => getRepo(config));

// const promises = packageNames.map( name => getRepo(config(name)));

// Promise.all(promises).then(values => {
//     console.log(values);
// }).catch(reason => {
//     console.log(reason)
// });

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));



