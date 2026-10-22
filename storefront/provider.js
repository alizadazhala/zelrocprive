import { storefrontConfig } from "./config.js";

/**
 * Provider boundary for a future Shopify-backed catalog.
 * Contract: resolveProduct(mapping) -> {status, price, availableForSale, variants}.
 * Connected values must come from Shopify; preview options are never variant IDs.
 * Cart creation and checkout are deliberately outside the disconnected provider.
 */
export function createStorefrontProvider(config = storefrontConfig) {
  if (config.provider !== "disconnected") {
    throw new Error("The connected storefront provider has not been implemented.");
  }
  return Object.freeze({
    async resolveProduct() {
      return Object.freeze({
        status: "disconnected",
        price: null,
        availableForSale: false,
        variants: [],
      });
    },
  });
}
