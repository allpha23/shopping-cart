function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', requestProductById);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestProduct() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$QUERY');
  const products = await response.json();
  products.results.forEach(({ id, title, thumbnail }) => {
    const product = { sku: id, name: title, image: thumbnail };
    const productList = document.querySelector('.items');
    const createProduct = createProductItemElement(product);
    productList.appendChild(createProduct);
  });
}

async function requestProductById() {
  const id = getSkuFromProductItem(this);
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const productsById = await response.json();
  const { title, price } = productsById;
  const product = { sku: id, name: title, salePrice: price };
  const productList = document.querySelector('.cart__items');
  const createProduct = createCartItemElement(product);
  productList.appendChild(createProduct);
}

window.onload = () => { 
  requestProduct();
};
