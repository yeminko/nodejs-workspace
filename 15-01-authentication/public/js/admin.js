const deleteProduct = (btn) => {
  const crsfToken = btn.parentNode.querySelector('input[name="_csrf"]').value;
  const productId = btn.parentNode.querySelector(
    'input[name="productId"]',
  ).value;

  const productElement = btn.closest("article");

  fetch("/admin/product" + "/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": crsfToken,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => console.log(err));
};
