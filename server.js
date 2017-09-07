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

// here we filter all modules to get only the ones in our package.json
getJSONFiles().then(files => files.filter(isRelevantPackage)).
        then(locations => locations.map(location => parseJson(require(location))));

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

//we need to make a call to github api to get the repositories' metadata
const parseJson = (json) => {
    let owner, repoName;
    const version = json._id.match(/[^@]+$/g);;
    const regex = new RegExp('com\/(.*?)\.git');
    [owner, repoName] = json.repository.url.match(regex)[1].split('/');
    const uri = `${baseURL}${owner}/${repoName}`;
    getRepo(config(uri)).then(json => analyseRepo(version, json)).catch(err => console.log(err));
}
// we pass the json containing the metadata
// and the actual release number we've installed
// this way we can calculate how old our version is
const analyseRepo = (release, json) => {
    getReleaseDate(release, json).then(date => {
        const days = getReleaseAge(json.pushed_at, date);
        const issuesRatio = (json.open_issues_count / json.size) * 100;
        const resultsObj = {
            repository: json.name,
            releaseAge: days,
            issues: json.open_issues_count,
            stars: json.watchers,
            size: json.size,
            issuesRatio: issuesRatio.toFixed(2)
        };
        console.log(resultsObj);
    }).catch(err => console.log(err))
}
// we make a call to the releases endpoint and filter the
// relevant version. this is because the release number are
// not consistent
const getReleaseDate = (version, json) => {
    const uri = `${baseURL}${json.full_name}/releases`;
    return new Promise ((resolve, reject) => {
        getRepo(config(uri)).then(releases => {
            console.log('URI', uri)
            const release = getRelease(releases, version);
            console.log('RELEASE', release)
            if (release.length > 0) {
                const releaseDate = release[0].published_at;
                resolve(releaseDate);
            }
        })
    })
}

const getRelease = (releases, version) => releases
    .filter(rel => rel.tag_name.includes(version));

// here we calculate how many days have passed
// since our version was released compared to HEAD
const getReleaseAge = (current, local) => {
    current = Date.parse(current);
    local = Date.parse(local);
    return ((current - local) / 86400000).toFixed();
}

