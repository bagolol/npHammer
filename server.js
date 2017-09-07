import request from 'request'
import * as fs from 'fs';
import getJSONFiles from './readNodeModules'
const pjson = require('./package.json');
const ACCESS_TOKEN = '57ed1327b1c176eb1326f3cdad8fc530e633e893';
const MsToDays = 86400000;
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
//we need to make a call to github api to get the repositories' metadata
const parseJson = (json) => {
    let owner, repoName;
    const versionSha = json.gitHead;
    const regex = new RegExp('com\/(.*?)\.git');
    [owner, repoName] = json.repository.url.match(regex)[1].split('/');
    const uri = `${baseURL}${owner}/${repoName}`;
    queryGithubApi(config(uri)).then(json => analyseRepo(versionSha, json));
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

const queryGithubApi = myConfig => {
    return new Promise((resolve, reject) => {
        request(myConfig, (err, res, body) => {
            if (err) return reject(err);
            resolve(JSON.parse(body))
        })
    })
}

// we pass the json containing the metadata
// and the actual release number we've installed
// this way we can calculate how old our version is
const analyseRepo = (localVersionSha, currentRepo) => {
    getCommitDate(localVersionSha, currentRepo).then(date => {
        const days = getReleaseAge(currentRepo.pushed_at, date);
        const lastUpdated = getReleaseAge(new Date(), currentRepo.pushed_at);
        const issuesRatio = (currentRepo.open_issues_count / currentRepo.size) * 100;
        const resultsObj = {
            repository: currentRepo.name,
            releaseAge: days,
            locVerReleaseDate: date,
            issues: currentRepo.open_issues_count,
            stars: currentRepo.watchers,
            size: currentRepo.size,
            issuesRatio: issuesRatio.toFixed(2),
            lastUpdated: lastUpdated
        };
        console.log(resultsObj);
    })
}
// we make a call to the releases endpoint and filter the
// relevant version. this is because the release number are
// not consistent
const getCommitDate = (commit, repo) => {
    const uri = `${baseURL}${repo.full_name}/git/commits/${commit}`;
    return new Promise ((resolve, reject) => {
        queryGithubApi(config(uri)).then(data => resolve(data.committer.date));
    })
}

// here we calculate how many days have passed
// since our version was released compared to HEAD
const getReleaseAge = (current, local) => {
    current = Date.parse(current);
    local = Date.parse(local);
    return ((current - local) / MsToDays ).toFixed();
}

