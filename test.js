const Investigator = require('./src/investigator');

(async () => {
    // let res = await Investigator.ping('http://www.ibragim.fr/')
    // let res = await Investigator.ping('http://www.stackoverflow.com')

    let res = await Investigator.httpToHttps('http://www.ibragim.fr/23047230432432432423432/4324324324')

    console.log("result: ", res)
    process.exit()
})()
