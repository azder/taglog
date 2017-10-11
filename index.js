/** Created by azder on 2017-10-10. */

const {nil, df, ident, objof, curry, fob$} = require('@azhder/nfun');

const rc = require('./rc')('taglog.json');

const conf = objof(rc ? require(rc) : {});

const enable = df(false, conf.enable);
const sep = df(':', conf.separator);
const tpref = df('[', conf.tagpref);
const tsuf = df(']', conf.tagsuf);
const upcase = df(true, conf.uppercase);


const TAGS = Symbol('TAGS');
const TAGLINE = Symbol('TAGLINE');
const SEVERITY = Symbol('SEVERITY');


const concat = Function.prototype.call.bind(Array.prototype.concat);

const dummy = () => ident;

const array = (
    tags => nil(tags) ? [] : (Array.isArray(tags) ? tags : [tags])
);

const def = curry(
    (severity, tags) => {

        const tarray = array(tags);
        const tagline = (
            `${tpref}${tarray.join(sep)}${tsuf}`[upcase ? 'toUpperCase' : 'toString']()
        );

        const logger = enable
            ? (
                message => {
                    // eslint-disable-next-line no-console
                    console[severity](tagline, message);
                    return message;
                }
            )
            : dummy;

        return fob$(logger, {
            child:      subtags => def(severity, concat([], tarray, array(subtags))),
            [TAGLINE]:  tagline,
            [TAGS]:     tarray,
            [SEVERITY]: severity,
        });

    }
);


module.exports = {
    child:  (subtags, log) => log.child(subtags),
    deblog: def('log'),
    inflog: def('info'),
    warlog: def('warn'),
    errlog: def('error'),
    TAGS,
    TAGLINE,
    SEVERITY,
};

// TODO: make export function a configuring one
// module.exports = zfob$(configure, exported);
