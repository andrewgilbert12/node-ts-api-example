import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Nearest: GET /api/v1/nearest', () => {

    it('should fail with 400 on invalid request', () => {
        return chai.request(app).get('/api/v1/nearest') // no data
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status(400);
            });
    });

    it('should return 200, correct info in json format (1/2: 535 Mission St)', () => {
        return chai.request(app).get('/api/v1/nearest')
            .query({
                "address": "535 Mission St., San Francisco, CA",
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.shop).to.eql({
                    "id": 16,
                    "name": "Red Door Coffee",
                    "address": "111 Minna St",
                    "lat": 37.78746242830388,
                    "lng": -122.39933341741562
                });
            });
    });

    it('should return 200, correct info in json format (2/2: 252 Guerrero St)', () => {
        return chai.request(app).get('/api/v1/nearest')
            .query({
                "address": "252 Guerrero St., San Francisco, CA 94103, USA",
            })
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body.shop).to.eql({
                    "id": 28,
                    "name": "Four Barrel Coffee",
                    "address": "375 Valencia St",
                    "lat": 37.76702438676065,
                    "lng": -122.42195860692624 });
            });
    });

    // todo: geocoding service outage test?

});
