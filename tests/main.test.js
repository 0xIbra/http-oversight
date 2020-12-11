const assert = require('assert');
const Investigator = require('../src/investigator');

function terminate() {
    process.exit()
}

describe('Investigator', () => {
    it('should ping domain and return result', async () => {
        let result = await Investigator.ping('https://www.ibragim.fr/askfjaslkfjlasjflaskjfkasfjasf/asfkalfjsjkdfhsdjkghskjgh')
        console.log(result)

        terminate()
    })
})
