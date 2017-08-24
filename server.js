import request from 'request'
import * as fs from 'fs';
import getJSONFiles from './readNodeModules'
const pjson = require('./package.json');
const ACCESS_TOKEN = '57ed1327b1c176eb1326f3cdad8fc530e633e893';
const baseURL = 'https://api.github.com/repos/'
// require the project's package.json
// get all the dependencies
const packageNames = Object.keys(pjson.dependencies);

// get the location only of the package.json files we need to
// parse to get the full_name and owner
const isRelevantPackage = filename => {
    filename = filename.match(/.\/node_modules\/(.*?)\/package.json/)[1];
    return packageNames.indexOf(filename) > -1;
}


getJSONFiles().then(files => files.filter(isRelevantPackage)).
        then(locations => locations.map(location => parseJson(require(location))));



const parseJson = (json) => {
    let owner, repoName;
    const version = json._id.match(/[^@]+$/g);;
    const regex = new RegExp('com\/(.*?)\.git');
    [owner, repoName] = json.repository.url.match(regex)[1].split('/');
    const uri = `${baseURL}${owner}/${repoName}`;
    getRepo(config(uri)).then(json => analyseRepo(version, json));
}

const getReleaseDate = (release, json) => {
    const uri = `${baseURL}${json.full_name}/releases/tags/${release}`;
    return new Promise ((resolve, reject) => {
        getRepo(config(uri)).then(result => {
            resolve(result.published_at);
        }).catch(err => reject(err))
    })
}

const analyseRepo = (release, json) => {
    getReleaseDate(release, json).then(date => {
        const days = getReleaseAge(json.pushed_at, date);
    })
}
const getReleaseAge = (current, local) => {
    current = Date.parse(current);
    local = Date.parse(local);
    return (current - local) / 86400000;
}

const config = uri => ({
    method: 'GET',
    uri: `${uri}?access_token=${ACCESS_TOKEN}`,
    headers: {
        'User-Agent': 'request',
        'Accept': 'application/vnd.github.v3+json'
    }
});

const getRepo = myConfig => {
    return new Promise((resolve, reject) => {
        request(myConfig, (err, res, body) => {
            if (err) return reject(err);
            resolve(JSON.parse(body))
        })
    })
}



