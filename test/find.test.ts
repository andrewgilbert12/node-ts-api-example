import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Find: GET /api/v1/shops/:id', () => {

    it('should fail with 404 for invalid shop id', () => {
        return chai.request(app).get('/api/v1/shops/999999')
            .catch(err => expect(err).to.have.status(404));
    });

    it('should return 200 and shop info for valid shop id', () => {
        return chai.request(app).get('/api/v1/shops/16')
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

});
