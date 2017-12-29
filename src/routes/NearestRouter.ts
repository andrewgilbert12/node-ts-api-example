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

    let geocodeReqURL : string = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address;

    if (process.env.GOOGLE_API_KEY) {
        geocodeReqURL += '&key=' + process.env.GOOGLE_API_KEY;
    }

    request(geocodeReqURL, (err, addrRes, body) => {
        let bodyJSON = JSON.parse(body);

        if (err || bodyJSON.error_message) {
            // Service unavailable - usually caused by reaching API quota
            res.status(500)
                .send({
                    message: 'Address search service failure.',
                    requestedAddress: address
                });
        } else if (! bodyJSON.results || ! bodyJSON.results[0] || ! bodyJSON.results[0].geometry ||
            ! bodyJSON.results[0].geometry.location || ! bodyJSON.results[0].geometry.location.lat ||
            ! bodyJSON.results[0].geometry.location.lng) {
            // No results
            res.status(404)
                .send({
                    message: 'Address entered could not be found.',
                    requestedAddress: address
                });
        } else {
            // Completed successfully - there will always be a closest point so no more errors possible
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
