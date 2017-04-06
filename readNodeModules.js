import glob from 'glob';

export default () => {
    return new Promise ((resolve, reject) => {
        glob('./node_modules/**/package.json', {}, (err, files) =>  {
            if (err) return reject(err);
            resolve(files);
        })
    })
}

