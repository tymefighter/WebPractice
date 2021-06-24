import products from './product-data.js';

/** Card Creation Functionality */

const createProductCard = function (
    imgUrl, productName, price, description
) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = 
        `
        <img src="${imgUrl}" />
        <h2>${productName}</h2>
        <ul>
            <li><b>Price:</b> $${price}</li>
            <li>Description: ${description}</li>
        </ul>
        `;

    return productCard;
};

const createSpacerCard = function () {
    const spacerCard = document.createElement("div");
    spacerCard.classList.add("spacer-card");
    return spacerCard;
};

const sofaDiv = document.querySelector(".sofas");
const tableDiv = document.querySelector(".tables");
const bedDiv = document.querySelector(".beds");

products.sofas.forEach((sofa) => {
    const productCard = createProductCard(
        './assets/sofas/' + sofa.img,
        sofa.productName, sofa.price, sofa.description
    );
    sofaDiv.appendChild(productCard);
});

for(let i = 0;i < (4 - (products.sofas.length % 4)) % 4;i++)
    sofaDiv.appendChild(createSpacerCard());

products.tables.forEach((table) => {
    const productCard = createProductCard(
        './assets/tables/' + table.img,
        table.productName, table.price, table.description
    );
    tableDiv.appendChild(productCard);
});

for(let i = 0;i < (4 - (products.tables.length % 4)) % 4;i++)
    tableDiv.appendChild(createSpacerCard());

products.beds.forEach((bed) => {
    const productCard = createProductCard(
        './assets/beds/' + bed.img,
        bed.productName, bed.price, bed.description
    );
    bedDiv.appendChild(productCard);
});

for(let i = 0;i < (4 - (products.beds.length % 4)) % 4;i++)
    bedDiv.appendChild(createSpacerCard());