import {Router, Request, Response} from 'express';
import * as Debug from 'debug';
const debug = Debug('server:shop-router');

import {Shop, ErrMsg} from '../models/Shop';


/**
 * Create: POST /app/v1/shops
 * Accepts the name, address, latitude, and longitude of a coffee shop, and
 * adds it to the data set, returning the id of the new coffee shop.
 */
function createShop(req: Request, res: Response): void {
    let shop : Shop = new Shop();

    let saveParams : any = {};

    saveParams.name = req.body.name;
    saveParams.address = req.body.address;
    saveParams.lat = parseFloat(req.body.lat);
    saveParams.lng = parseFloat(req.body.lng);

    let err : ErrMsg = shop.save(saveParams);

    if (err) {
        res.status(400).send(err);
    } else {
        res.status(201).send({
            message: 'success',
            shop
        });
    }
}

/**
 * Read: GET /app/v1/shops/:id
 * Accepts an id and returns the id, name, address, latitude, and longitude
 * of the coffee shop with that id, or a 404 error if it is not found.
 */
function readShop(req: Request, res: Response): void {
    let shop : Shop = Shop.findById(parseInt(req.params.id));

    if (shop) {
        res.status(200).send({
            message: 'success',
            shop
        });
    } else {
        res.status(404).send({
            message: 'Requested id not found'
        });
    }
}

/**
 * Update: PUT /app/v1/shops/:id
 * Accepts an id and new values for the name, address, latitude, or longitude fields,
 * updates the coffee shop with that id, or returns an appropriate error if it is not found.
 */
function updateShop(req: Request, res: Response): void {

    let updateParams : any = {};

    updateParams.name = req.body.name;
    updateParams.address = req.body.address;
    updateParams.lat = parseFloat(req.body.lat);
    updateParams.lng = parseFloat(req.body.lng);

    let err : ErrMsg = Shop.update(parseInt(req.params.id), updateParams);

    if (err) {
        res.status(err.status).send({
            message: err.message
        });
    } else {
        res.status(204).end();
    }
}

/**
 * Delete: DELETE /app/v1/shops/:id
 * Accepts an id and deletes the coffee shop with that id, or returns an error if it is not found
 */
function deleteShop(req: Request, res: Response): void {
    let err : ErrMsg = Shop.remove(parseInt(req.params.id));

    if (err) {
        res.status(404).send({
            message: err.message
        });
    } else {
        res.status(204).end();
    }
}

const router = Router();

// endpoints
router.get('/:id', readShop);
router.post('/', createShop);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

export default router;
