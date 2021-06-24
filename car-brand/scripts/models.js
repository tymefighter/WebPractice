import {fetchData, fetchImage, uploadCar} from "./request.js";

/** Fetching Car Data */

const models = document.querySelector(".models");

const createCarCard = function (car, imageUrl) {

    const carCard = document.createElement("div");
    carCard.innerHTML = 
    `
    <img src="${imageUrl}" />
    <h2>${car.name}</h2>
    <h3>$${car.cost}</h3>
    <p>${car.desc}</p>
    `;

    models.append(carCard);
}

fetchData()
.then((data) => {
    data.forEach((car) => {
        fetchImage(car.image)
        .then((imageUrl) => createCarCard(car, imageUrl));
    });
});

/** Adding a Car */

const modalFormHtml =
    `
        <form>
            <label id="name-label" for="name">Name: </label>
            <input type="text" name="name" id="name"/>

            <label id="img-name-label" for="img-name">Image Name: </label>
            <input type="text" name="img-name" id="img-name"/>

            <label id="cost-label" for="cost">Cost: </label>
            <input type="number" name="cost" id="cost"/>

            <label id="desc-label" for="desc">Description: </label>
            <textarea name="desc" id="desc"></textarea>

            <button type="button">Add Car</button>
        </form>
    `;

const body = document.querySelector("body");

const createModal = function() {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalFormHtml;
    modalContainer.classList.add("modal");

    const form = modalContainer.querySelector("form");
    const button = modalContainer.querySelector("button");

    form.addEventListener("click", (event) => event.stopPropagation());
    modalContainer.addEventListener("click", () => modalContainer.remove());

    const nameInput = modalContainer.querySelector("#name");
    const imgNameInput = modalContainer.querySelector("#img-name");
    const costInput = modalContainer.querySelector("#cost");
    const descInput = modalContainer.querySelector("#desc");

    button.addEventListener("click", () => {
        const car = {
            name: nameInput.value,
            image: imgNameInput.value,
            cost: costInput.value,
            desc: descInput.value
        };

        (async function() {
            await uploadCar(car);
            const imageUrl = await fetchImage(car.image);
            createCarCard(car, imageUrl);
        }) ();

        modalContainer.remove();
    });

    body.append(modalContainer);
}

document
.querySelector(".add-car-modal-button")
.addEventListener("click", createModal);
