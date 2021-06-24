import {data} from './data.js';

const fetchData = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(data), 1000);
    });
}

const fetchImage = function(image) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve("./assets/cars/" + image), 500);
    });
}

const uploadCar = function(car) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            data.push(car);
            resolve(data);
        }, 1000);
    });
}

export {fetchData, fetchImage, uploadCar};