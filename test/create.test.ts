import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Create: POST /api/v1/shops', () => {

    it('should fail with 400 on request with missing parameters', () => {
        let empty_res = chai.request(app).post('/api/v1/shops')
            .send({}) // no data
            .catch(err => err.response);

        let no_lat_lng_res = chai.request(app).post('/api/v1/shops')
            .send({
                "name": "New Coffee Shop",
                "address": "100 Coffee St"
            })
            .catch(err => err.response);

        return Promise.all([
            expect(lat_res).to.have.status(400),
            expect(lng_res).to.have.status(400)
        ]);
    });

    it('should fail with 400 on request with out of range lat/lng parameters', () => {
        // invalid lat value
        let lat_res = chai.request(app).post('/api/v1/shops')
            .send({
                "name": "New Coffee Shop 3",
                "address": "300 Coffee St",
                "lat": 200,
                "lng": 0
            })
            .catch(err => err.response);

        // invalid lng value
        let lng_res = chai.request(app).put('/api/v1/shops/10')
            .send({
                "name": "New Coffee Shop 3",
                "address": "300 Coffee St",
                "lat": 0,
                "lng": 200
            })
            .catch(err => err.response);

        return Promise.all([
            expect(lat_res).to.have.status(400),
            expect(lng_res).to.have.status(400)
        ]);
    });

    it('should return 201 and id of coffee shop on valid request, id can then be used to look up coffee shop', (done) => {
        chai.request(app).post('/api/v1/shops')
            .send({
                "name": "New Coffee Shop 3",
                "address": "300 Coffee St",
                "lat": 80.30,
                "lng": -100.30
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status('201');
                expect(res.body).to.have.property('shop');

                let id = res.body.shop.id;
                chai.request(app).get('/api/v1/shops/' + id)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status('200');
                        expect(res.body.shop).to.eql({
                            "name": "New Coffee Shop 3",
                            "address": "300 Coffee St",
                            "lat": 100.30,
                            "lng": -100.30
                        })
                        done();
                    });
            });
    });

    it('should succeed on repeated request (no checking for unique names, addresses, etc.)', () => {
        return chai.request(app).post('/api/v1/shops')
            .send({
                "name": "New Coffee Shop",
                "address": "100 Coffee St",
                "lat": 100.10,
                "lng": -100.10
            })
            .then(res => {
                expect(res).to.have.status('201');
            });
    });

});
