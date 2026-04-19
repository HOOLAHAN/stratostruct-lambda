# StratoStruct Backend

StratoStruct Backend is an Express API deployed to AWS Lambda with the Serverless Framework. It provides authentication, product and supplier management, Mapbox-backed distance/route lookups, and aggregate supplier search for the StratoStruct frontend.

Frontend: [https://www.stratostruct.com](https://www.stratostruct.com)

## Features

- JWT authentication for users.
- Admin authorization for product and supplier mutation routes.
- Product CRUD endpoints.
- Supplier CRUD endpoints.
- Aggregate supplier search by site postcode and selected product IDs.
- Mapbox geocoding, driving distance, and route geometry endpoints.
- Lambda-safe MongoDB connection handling with controlled `503` responses when the database is unavailable.

## Tech Stack

- Node.js 20 on AWS Lambda
- Express
- MongoDB Atlas
- Mongoose
- Serverless Framework v3
- serverless-http
- Mapbox APIs

## Project Structure

```text
controllers/      Route handler logic
middleware/       Authentication and admin authorization
models/           Mongoose models
routes/           Express route definitions
db.js             Reusable MongoDB connection helper
handler.js        Lambda/serverless-http entry point
server.js         Express app setup
serverless.yml    AWS Lambda deployment config
```

## Environment Variables

The backend requires:

```bash
export MONGO_URI='mongodb+srv://...'
export SECRET='your_jwt_secret'
export MAPBOX_API_KEY='your_mapbox_token'
```

These variables are read by `serverless.yml` during package/deploy and by the app at runtime.

## Local Setup

Install dependencies:

```bash
npm ci
```

Validate that the Lambda handler loads:

```bash
node -e "require('./handler'); console.log('handler loaded')"
```

Package locally with placeholder values:

```bash
MONGO_URI=mongodb://localhost/test SECRET=test MAPBOX_API_KEY=test npx serverless package --stage dev
```

## Deployment

Deploy with real environment variables exported:

```bash
source .env
npx serverless deploy --stage dev
```

The current deployment target is configured in [serverless.yml](serverless.yml):

- Runtime: `nodejs20.x`
- Region: `eu-west-2`
- Timeout: `15`
- Service: `stratostruct-lambda`

## API Overview

All product, supplier, and Mapbox routes require authentication.

### User

- `POST /api/user/signup`
- `POST /api/user/login`
- `DELETE /api/user/delete`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin only
- `PATCH /api/products/:id` admin only
- `DELETE /api/products/:id` admin only

### Suppliers

- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `GET /api/suppliers/product/:id`
- `POST /api/suppliers` admin only
- `PATCH /api/suppliers/:id` admin only
- `DELETE /api/suppliers/:id` admin only
- `POST /api/suppliers/search`
- `POST /api/suppliers/suppliers-by-products`

`POST /api/suppliers/search` accepts:

```json
{
  "sitePostcode": "SE15 4BT",
  "productIds": ["product-id-1", "product-id-2"]
}
```

It returns the site coordinates, matching products, ranked suppliers, supplier coordinates, component match counts, driving distances, and drive durations.

### Mapbox

- `GET /api/mapbox/getDistance?postcode1=&postcode2=`
- `POST /api/mapbox/getRoute`
- `GET /api/mapbox/getCoordinates?postcode=`

## Operational Notes

- If Atlas is paused or the MongoDB SRV record is unavailable, search/login routes can fail. The app now returns a controlled `503` instead of hanging until Lambda timeout.
- Rotate `MONGO_URI` credentials and `SECRET` if they are exposed in logs, screenshots, or shared text.
- The backend currently uses Mapbox directly per lookup; caching postcode coordinates and route summaries would reduce latency and API usage in a future pass.
