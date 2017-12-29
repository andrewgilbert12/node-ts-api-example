import * as Debug from 'debug';
const debug = Debug('server:shop-loader');

// Simple error message that some functions in Shop return
class ErrMsg {
    message: string;
}

// initialize Shop with data from CSV
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const input = fs.readFileSync(__dirname + '/../data/locations.csv', { encoding: 'utf8' });

let defaultShopsFromCSV : Array<Shop> = parse(input, {
    columns: ['id', 'name', 'address', 'lat', 'lng'],
    auto_parse: true, // auto-converts id, lat, lng to number
    trim: true
});

let nextIdFromCSV : number = defaultShopsFromCSV.reduce((a, b) =>
    a.id > b.id ?
    a :
    b).id + 1; // nextId is max + 1

debug('CSV loaded. next id: ' + nextIdFromCSV);

// Class for representing a concrete shop object, with static utility functions for search
// In production environment would probably want to use a mongoose schema, etc.
class Shop {
    // Used in lieu of a database to store shop info
    private static shopList: Array<Shop> = defaultShopsFromCSV;
    private static nextId : number = nextIdFromCSV;

    // All other fields are optional
    private static requiredFields : Array<string> = ['name', 'address', 'lat', 'lng'];

    // Fields
    public id: number;
    public name: string;
    public address: string;
    public lat: number;
    public lng: number;

    // Saves the shop, returning null, or returns object describing error on failure
    public save(): ErrMsg {
        if (!Shop.requiredFields.every(f => this[f])) {
            return {
                message: 'A new shop must have name, address, lat, long specified'
            };
        }

        if (!Shop.latValidation(this.lat)) {
            return {
                message: 'lat must be a number between -90 and 90'
            };

        }

        if (!Shop.lngValidation(this.lng)) {
            return {
                message: 'lng must be a number between -180 and 180'
            };

        }

        this.id = Shop.nextId;
        Shop.nextId++;
        Shop.shopList.push(this);

        return null;
    }


    // static methods

    // Updates the shop with the given id number,
    // replacing all properties of shop defined in opts
    // Ignores all properties of opts that don't correspond to a property on shop
    // Returns an error if there is no shop with the given id number,
    // or if new values of lat/lng specified in opts are ill-defined
    public static update(id: number, opts: {name: string, address: string, lat: number, lng: number}): ErrMsg {
        let toUpdate : Shop = {};

        let shop: Shop = Shop.findById(id);

        if (!shop) {
            return {
                message: 'Requested id not found',
                status: 404
            };
        }

        // todo refactor using iterator over Shop properties
        if (opts.lat) {
            toUpdate.lat = opts.lat;
            if (!Shop.latValidation(toUpdate.lat)) {
                return {
                    message: 'lat must be a number between -90 and 90',
                    status: 400
                };
            }
        }

        if (opts.lng) {
            toUpdate.lng = opts.lng;
            if (!Shop.lngValidation(toUpdate.lng)) {
                return {
                    message: 'lng must be a number between -180 and 180',
                    status: 400
                };
            }
        }

        if (opts.name) {
            toUpdate.name = opts.name;
        }

        if (opts.address) {
            toUpdate.address = opts.address;
        }

        Object.keys(toUpdate).forEach(k => {
            shop[k] = toUpdate[k];
        });

        return null;
    }

    // Removes the shop with the given id number
    // Returns an error if there is no shop with the given id number
    public static remove(id: number) : ErrMsg {
        let newShopList = Shop.shopList.filter(shop => shop.id !== id);
        if (newShopList.length === Shop.shopList.length) {
            return {
                message: 'Requested id not found'
            };
        }

        Shop.shopList = newShopList;

        return null;
    }

    // Finds the shop with the given id number, or undefined if there is no such shop
    public static findById(id: number) : Shop {
        return Shop.shopList.find(shop => shop.id === id);
    }

    // Returns the shop closest to the given lat and lng coordinates
    // todo: is the precision on float good enough for this approach?
    public static nearest(lat: number, lng: number) : Shop {
        return Shop.shopList.reduce((a, b) =>
            ((a.lat - lat) ** 2 + (a.lng - lng) ** 2) <
            ((b.lat - lat) ** 2 + (b.lng - lng) ** 2) ?
            a :
            b
        );
    }

    // validations
    // note these also catch when 'NaN' is passed in to lat or lng

    private static latValidation(lat: number) : boolean {
        return lat >= -90 && lat <= 90;
    }

    private static lngValidation(lng: number) : boolean {
        return lng >= -180 && lng <= 180;
    }
}

export default Shop;
