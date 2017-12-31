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
            .catch(err => expect(err).to.have.status(404));
    });

    it('should fail with 400 for invalid data', () => {
        // invalid lat value
        let lat_res = chai.request(app).put('/api/v1/shops/10')
            .send({lat: 100})
            .catch(err => err);

        // invalid lng value
        let lng_res = chai.request(app).put('/api/v1/shops/10')
            .send({lng: 200})
            .catch(err => err);

        return Promise.all([
            lat_res,
            lng_res
        ])
            .then(responses => {
                responses.forEach(res => {
                    expect(res).to.have.status(400);
                });
            });
    });

    it('should return 204 on valid request, data should be updated', (done) => {
        chai.request(app).put('/api/v1/shops/10')
            .send({
                lat: 80,
                lng: -80
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204);

                chai.request(app).get('/api/v1/shops/10')
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res.body.shop).to.have.property('lat', 80);
                        expect(res.body.shop).to.have.property('lng', -80);

                        done();
                    });
            });
    });

});
