/**
 * This test file requires {@link module:./config/launcher} and
 * {@link module:./models}.
 * @requires module:./config/launcher
 * @requires module:./models
 */
const { request, url} = require("./config/launcher")
const { rateLimiterConfig } = require('../Tools/rateLimiter');

/**
 * @todo Make lot of tests, to test each possible situation
 */
describe('Server', () => {

    /**
     * @test {getPost}
     * Try to get post more than the request limit.
     * It test our request limiter, if it respond with a 429 status.
     * It also test if we get result at each request (seems that sometimes
     * a request could return nothing).
     */
    it('should return that user launch to many request', async () => {
        let arrBool = []
        for (let nbReq = 0; nbReq<rateLimiterConfig.max+5; nbReq++){
            if (nbReq>rateLimiterConfig.max){
                let resp = await request.get(url + 'post?search=test(int){int, ?} "function to multiply" #test#')
                expect(resp.status).toBe(429)
            }
            else{
                let resp =await request.get(url + 'post?search=test(int){int, ?} "function to multiply" #test#')
                arrBool.push(Object.keys(resp.body))
            }
        }
        console.log(arrBool)
    });

});
