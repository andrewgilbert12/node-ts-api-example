The following repository contains a simple RESTful API, implemented using node.js, Express, and TypeScript.

To setup and run the server, clone the repository and execute the following commands in the base directory:

```bash
$ npm install
$ gulp
$ export GOOGLE_API_KEY=**insert api key here** # this step is optional, but without an API key the nearest endpoint will be prone to rate limiting
$ npm start
```
To run unit tests:

```bash
$ npm test
```

The API is used for finding the nearest coffee shop relative to a given address and has the following endpoints:

(Note: All of the below request examples use httpie.)

**Create**
----
   Accepts the name, address, latitude, and longitude of a cofee shop, and adds it to the data set, returning the id of the new coffee shop.

* **Endpoint:**
POST api/v1/shop

* **Data Params**

   **Required:**
 
   * name: String
   * address: String
   * lat: float in the range [-90, 90]
   * lng: float in the range [-180, 180]

(Note: all other parameters will be ignored)

* **Success Response:**
  
  * **Code:** 201 CREATED <br />
    **Content:** shop: json representation of saved shop object - will also include the id assigned by the server.
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Cause:** Missing any of the required parameters, or lat/lng out of range.

* **Example:**

```json
$ http POST <URL>/api/v1/shop name='New Coffee Shop' address='100 Coffee St' lat=70 lng=-100.10

{
    "message": "success",
    "shop": {
        "address": "100 Coffee St",
        "id": 16,
        "lat": 70,
        "lng": -100.10,
        "name": "New Coffee Shop"
    }
}

$ http POST <URL>/api/v1/shop name='New Coffee Shop' address='100 Coffee St' lat=170 lng=-100.10

{
    "message": "lat must be between -90 and 90",
}

```

**Read**
----
   Accepts an id and returns the id, name, address, latitude, and longitude of the coffee shop with that id, or a 404 error if it is not found.

* **Endpoint:**

  GET api/v1/shop/:id

* **Success Response:**
  
  * **Code:** 200 OK <br />
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Cause:** Specified :id does not exist.

* **Example:**

```json
$ http GET <URL>/api/v1/shop/10

{
    "message": "success",
    "shop": {
        "address": "1 Ferry Building Ste 7",
        "id": 10,
        "lat": 37.79590475625579,
        "lng": -122.39393759555746,
        "name": "Blue Bottle Coffee"
    }
}

$ http GET <URL>/api/v1/shop/999999

{
    "message": "Requested id does not exist",
}

```


**Update**
----
   Accepts an id and new values for the name, address, latitude, or longitude fields, updates the coffee shop with that id, or returns an appropriate error if it is not found.


* **Endpoint:**

  PUT api/v1/shop/:id

* **Data Params**

   **Optional:**
 
   * name: String
   * address: String
   * lat: float in the range [-90, 90]
   * lng: float in the range [-180, 180]

(Note: all other parameters will be ignored)

* **Success Response:**
  
  * **Code:** 204 OK, NO CONTENT <br />
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Cause:** New lat/lng values out of range.

  * **Code:** 404 NOT FOUND <br />
    **Cause:** Specified :id does not exist.

* **Example:**

```json
$ http PUT <URL>/api/v1/shop/10 address="New Address" lat=80 lng=-100.10

204, no content

$ http PUT <URL>/api/v1/shop/999999 address="New Address" lat=80 lng=-100.10

{
    "message": "Requested id does not exist",
}

```

**Delete**
----
   Accepts an id and deletes the coffee shop with that id, or returns an error if it is not found

* **Endpoint:**

  DELETE api/v1/shop/:id

* **Success Response:**
  
  * **Code:** 204 OK, NO CONTENT <br />
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Cause:** Specified :id does not exist.

* **Example:**

```json
$ http DELETE <URL>/api/v1/shop/10

204, no content

$ http DELETE <URL>/api/v1/shop/999999

{
    "message": "Requested id does not exist",
}

```

**Find Nearest**
----
   Accepts an address and returns the closest coffee shop by straight line distance.

* **Endpoint:**

  GET api/v1/nearest

* **Query Parameters:**

  address: String

* **Success Response:**
  
  * **Code:** 200 OK <br />
    **Content:** `{ message: 'Success', address: String, shop: json representation of nearest shop object }`
 
* **Error Response:** 
  * **Code:** 400 BAD REQUEST <br />
    **Cause:** No address entered.

  * **Code:** 404 NOT FOUND <br />
    **Cause:** Address server can't find valid lat/lng coordinates for the requested address.

  * **Code:** 503 SERVICE UNAVAILABLE <br />
    **Cause:** Failed to get a response from the geocoding server. (Note: this is mostly due to Google API rate-limiting, one can avoid this error by supplying the server with a Google API key)

* **Example:**

```json
$ http GET <URL>/api/v1/nearest?address='535 Mission St., San Francisco, CA'

{
    "message": "Success",
    "requestedAddress": "535 Mission St., San Francisco, CA",
    "shop": {
        "address": "111 Minna St",
        "id": 16,
        "lat": 37.78746242830388,
        "lng": -122.39933341741562,
        "name": "Red Door Coffee"
    }
}
```

```json
$ http GET <URL>/api/v1/nearest?address='252 Guerrero St, San Francisco, CA 94103, USA'

{
    "message": "Success",
    "requestedAddress": "252 Guerrero St, San Francisco, CA 94103, USA",
    "shop": {
        "address": "375 Valencia St",
        "id": 28,
        "lat": 37.76702438676065,
        "lng": -122.42195860692624,
        "name": "Four Barrel Coffee"
    }
}

http localhost:3000/api/v1/nearest

{
    "message": "Please specify an address."
}

http localhost:3000/api/v1/nearest?address=soiejfiosejgoisjgiosjgosijgsiogjsogjisoejkafhgijdoskdb

{
    "message": "Address entered could not be found.",
    "requestedAddress": "soiejfiosejgoisjgiosjgosijgsiogjsogjisoejkafhgijdoskdb"
}
```
