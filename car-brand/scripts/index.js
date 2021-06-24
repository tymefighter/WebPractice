import {fetchData, fetchImage} from "./request.js";

const CAROUSEL_TIME = 2000;

(async function() {
    const headingElement = document.querySelector(".carousel > h2");
    const imgElement = document.querySelector(".carousel > img");
    headingElement.innerText = "Extreme Motors";
    imgElement.setAttribute("src", "./assets/logo.jpeg");

    const data = await fetchData();

    const carNameAndImgList = [];
    let currIdx = 0;
    setInterval(() => {
        if(carNameAndImgList.length === 0) {
            headingElement.innerText = "Extreme Motors";
            imgElement.setAttribute("src", "./assets/logo.jpeg");
        }
        else {
            currIdx = currIdx === carNameAndImgList.length ? 0 : currIdx + 1;
            headingElement.innerText = carNameAndImgList[currIdx].name;
            imgElement.setAttribute("src", carNameAndImgList[currIdx].imageUrl);
        }
    }, CAROUSEL_TIME);

    data.forEach(async (car) => {
        const imageUrl = await fetchImage(car.image);
        carNameAndImgList.push({name: car.name, imageUrl: imageUrl});
    });
}) ();