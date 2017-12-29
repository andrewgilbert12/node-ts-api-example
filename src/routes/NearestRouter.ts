import {Router, Request, Response, NextFunction} from 'express';
import * as request from 'request';

import Shop from '../models/Shop';

/**
 * Find Nearest: GET /app/v1/nearest-shop
 * Accepts an address and returns the closest coffee shop by straight line distance.
 */
function findNearestShop(req: Request, res: Response, next: NextFunction): void {
    let address = req.query.address;

    if (!address) {
        res.status(400)
            .send({
                message: 'Please specify an address.',
                status: res.status
            });
        return;
    }

    request('https://maps.googleapis.com/maps/api/geocode/json?address=' + address, (err, addrRes, body) => {
        let bodyJSON = JSON.parse(body);

        // Fail on Geolocation API error
        if (err || ! bodyJSON.results || ! bodyJSON.results[0] || ! bodyJSON.results[0].geometry ||
            ! bodyJSON.results[0].geometry.location || ! bodyJSON.results[0].geometry.location.lat ||
        ! bodyJSON.results[0].geometry.location.lng) {
            res.status(500)
                .send({
                    message: 'Address search service failure.',
                    requestedAddress: address
                });
        } else {
            let lat = bodyJSON.results[0].geometry.location.lat;
            let lng = bodyJSON.results[0].geometry.location.lng;

            let shop = Shop.nearest(lat, lng);

            res.status(200)
                .send({
                    message: 'Success',
                    requestedAddress: address,
                    shop
                });
        }
    });

}

const router = Router();

// endpoints
router.get('/', findNearestShop);

export default router;
