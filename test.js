const Investigator = require('./src/investigator');

(async () => {
    // let res = await Investigator.ping('http://www.ibragim.fr/')
    // let res = await Investigator.ping('http://www.stackoverflow.com')

    console.log('Http redirected to Https ?: ', await Investigator.httpToHttps('http://www.ibragim.fr/23047230432432432423432/4324324324'))
    // console.log('Access protocol: ', await Investigator.httpOrHttps('https://www.publi-car.fr'))
    console.log('Access protocol: ', await Investigator.httpOrHttps('https://www.ibragim.fr/'))
    console.log('SSL data: ', await Investigator.getSSLData('https://www.publi-car.fr'))
    process.exit()
})()
