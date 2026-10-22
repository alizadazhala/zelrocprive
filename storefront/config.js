// Public, non-secret storefront settings. No network requests while disconnected.
// Do not place Shopify Admin tokens, private Storefront tokens or credentials here.
export const storefrontConfig = Object.freeze({
  provider: "disconnected",
  shopify: Object.freeze({
    storeDomain: null,
    catalogEndpoint: null, // Future same-origin adapter; not a checkout endpoint.
  }),
});
