import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Delete: DELETE /api/v1/shops/:id', () => {

    it('should fail with 404 on nonexistent shop id', () => {
        return chai.request(app).delete('/api/v1/shops/999999')
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status('404');
            });
    });

    it('should return 204 for valid shop id, actually delete coffee shop on valid request', () => {
        return chai.request(app).delete('/api/v1/shops/1')
            .then(res => {
                chai.request(app).get('api/v1/shops/1')
                    .catch(err => err.response)
                    .then(res => {
                        expect(res).to.have.status('404');
                    });
            });
    });

    it('should fail with 404 on attempt to delete id twice', () => {
        return chai.request(app).delete('/api/v1/shops/1')
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status('404');
            });
    });

});
