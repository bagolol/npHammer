import Express from 'express';
import bodyParser from 'body-parser';
import request from 'request'

const app = Express();
const PORT = 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

const config = {
    method: 'GET',
    uri: 'https://api.github.com/search/repositories?q=connect-favicons+in%3Aname&access_token=57ed1327b1c176eb1326f3cdad8fc530e633e893',
    headers: {
        'User-Agent': 'request',
        'Accept': 'application/vnd.github.v3+json'
    }
}
const getRepo = myConfig => request(myConfig, (err, res, body) => JSON.parse(body).total_count);

app.get('/', (req, res) => getRepo(config));


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));



