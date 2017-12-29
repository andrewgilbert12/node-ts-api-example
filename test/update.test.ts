import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Update: PUT /api/v1/shops/:id', () => {

    it('should fail with 404 for invalid id', () => {
        return chai.request(app).put('/api/v1/shops/999999')
            .send({lat: 80})
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status(404);
            });
    });

    // todo: make sure this promise idiom works
    it('should fail with 404 for invalid data', () => {
        // invalid lat value
        let lat_res = chai.request(app).put('/api/v1/shops/10')
            .send({lat: 200})
            .catch(err => err.response);

        // invalid lng value
        let lng_res = chai.request(app).put('/api/v1/shops/10')
            .send({lng: 200})
            .catch(err => err.response);

        return Promise.all([
            expect(lat_res).to.have.status(400),
            expect(lng_res).to.have.status(400)
        ]);

    });

    it('should return 204 on valid request', () => {
        return chai.request(app).put('/api/v1/shops/10')
            .send({lat: 80})
            .then(res => {
                expect(res).to.have.status(204);
                chai.request(app).get('/api/v1/shops/10')
                    .then(res => {
                        expect(res.body.shop).to.have.property('lat', 80);
                    });
            });
    });

});
