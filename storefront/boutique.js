import { createStorefrontProvider } from "./provider.js";

// These controls explore the intended design. They do not select sellable variants.
for (const product of document.querySelectorAll("[data-product]")) {
  const summary = product.querySelector("[data-selection-summary]");
  const updateSelection = () => {
    const selection = [...product.querySelectorAll("fieldset[data-option]")].map(group => {
      const selected = group.querySelector("input:checked");
      return `${group.dataset.option}: ${selected ? selected.value : "not selected"}`;
    });
    const mediaElement = product.querySelector("[data-concept-media]");
    if (mediaElement) {
      const media = JSON.parse(mediaElement.textContent);
      const colour = product.querySelector('[data-option="Colour"] input:checked')?.value;
      const view = product.querySelector('input[name="view"]:checked')?.value || "front";
      const image = product.querySelector("[data-concept-image]");
      if (media[`${colour}|${view}`]) {
        image.src = media[`${colour}|${view}`];
        image.alt = `${product.querySelector("h1").textContent} — ${colour}, ${view} concept study; not a manufactured product`;
      }
    }
    if (summary) summary.textContent = `Design preview — ${selection.join(" · ")}. Purchasing remains unavailable.`;
  };
  product.querySelectorAll("input[type=radio]").forEach(input => input.addEventListener("change", updateSelection));
  if (product.querySelector("fieldset")) updateSelection();
}

// Fail closed: a changed config or failed adapter never enables purchasing.
try {
  const provider = createStorefrontProvider();
  await Promise.all([...document.querySelectorAll("[data-product]")].map(async product => {
    const state = await provider.resolveProduct({ key: product.dataset.product });
    product.dataset.storefrontStatus = state.status;
  }));
} catch {
  document.querySelectorAll("[data-storefront-message]").forEach(message => {
    message.textContent = "Purchasing is unavailable. Please return for release details.";
  });
}
