const assert = require('assert');
const Investigator = require('../src/investigator');
const utils = require('../src/utils/utils');

describe('Investigator', () => {

    it('should check the heartbeat of a non existent url', async () => {
        let heartbeat = await Investigator.checkHeartbeat('https://www.www.ce-nom-de-domaine-n-existe-pas-et-ne-va-pas-exister-probablement.fr')

        assert.deepStrictEqual(heartbeat, false);
    });

    it('should check the heartbeat of a valid url and confirm status code of 404', async () => {
        let heartbeat = await Investigator.checkHeartbeat('https://www.ibragim.fr/path/to/error/404/not/found');

        assert.deepStrictEqual(heartbeat, true);

        let ping = await Investigator.ping('https://www.ibragim.fr/path/to/error/404/not/found', true);

        assert.deepStrictEqual(ping, false);
    });

    it('should resolve the allowed protocol of a website', async () => {
        let protocol = await Investigator.httpOrHttps('http://www.ibragim.fr/')

        assert.deepStrictEqual(protocol, 'https');
    });

    it('should check if website is accessible via http', async () => {
        let accessible = await Investigator.httpAccess('https://www.ibragim.fr');

        assert.deepStrictEqual(accessible, false);
    });

    it('should check if http is redirected to https', async () => {
        let redirected = await Investigator.httpToHttps('http://www.ibragim.fr/');

        assert.deepStrictEqual(redirected, true);
    });

    it('should reformat malformed http urls', async () => {
        let parsed = utils.parseUrl('ibragim.fr/profil');
        assert.deepStrictEqual(parsed.toString(), 'http://ibragim.fr/profil');

        parsed = utils.parseUrl('username:password@ibragim.fr/data');
        assert.deepStrictEqual(parsed.toString(), 'http://username:password@ibragim.fr/data');
    });


})
