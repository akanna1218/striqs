# Striqs poster shop

Responsive poster-shopping demo built with React 19, Vite, MUI 7, React Router, Axios, Context/useReducer, and JSON Server. Product and category data, layout definitions, FAQs, offer rules, and demo orders are served from the local JSON Server. The black, white, and red visual identity follows the supplied STRIQS Collective Instagram profile; two locally stored images from that profile are used in the homepage campaign. Other catalogue product images and prices remain illustrative sample data.

## Run locally

```sh
npm install
npm start
```

`npm start` runs both processes:

- Vite storefront: http://localhost:5173
- JSON Server API: http://localhost:3001

You can also start them separately with `npm run dev` and `npm run server`. The API URL can be changed with `VITE_API_URL` (for example, `VITE_API_URL=http://localhost:3001`).

## Store features

- Home, shop/collection, product detail, wall builder, custom print, cart, checkout, and order confirmation routes.
- Search, category and print-type filters, sort order, and load-more pagination.
- Variant-aware cart lines persisted in browser local storage.
- Data-driven wall layouts with selectable catalogue prints and local image previews.
- Custom prints use temporary browser object URLs. Uploaded files are not sent to JSON Server and are not persistent uploads.
- Checkout creates a demo order in `db.json`; no payment is collected and no order is fulfilled.
- Offer rules, prices, and delivery copy are sample values for the demo.

## Validation

```sh
npm run lint
npm run build
```
