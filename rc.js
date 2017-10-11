/** Created by azder on 2017-10-10. */

const {existsSync} = require('fs');
const {join} = require('path');

module.exports = (

    name => {

        let file;
        let exists;
        let prev;
        let dir = __dirname;

        // eslint-disable-next-line no-constant-condition
        do {

            file = join(dir, name);
            exists = existsSync(file);
            prev = dir;

            dir = join(dir, '..');

        } while (!exists && '/' !== prev);

        return exists ? file : null;

    }

);


