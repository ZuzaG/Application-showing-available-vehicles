document.addEventListener("DOMContentLoaded", init);

const propotypeBox = document.querySelector(".offer__item--prototype");
const selectBtn = document.querySelector(".selection__btn");
let ulEl = document.querySelector(".panel__list");
let dataFromFetch = [];

selectBtn.addEventListener("click", sortByPrice);
selectBtn.addEventListener("click", sortByModel);

function init() {
  loadOffer();
}

function loadOffer(data) {
  const offerURL = "https://gx.pandora.caps.pl/zadania/api/offers.json";

  fetch(offerURL)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].status == "active") {
          dataFromFetch.push(data.results[i]);
        }
      }
      createOfferList(dataFromFetch);
      searchForModels(dataFromFetch);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return data;
}

function createOfferList(data) {
  createOfferInfo(data);
}

function createOfferInfo(data) {
  for (let i = 0; i < data.length; i++) {
    const createdBox = propotypeBox.cloneNode(true);
    createdBox.classList.remove("offer__item--prototype");

    createdBox.querySelector("a").setAttribute("href", data[i].url);
    createdBox.querySelector(".offer__img").src = data[i].photos[1]["1080x720"];
    if (isNaN(parseFloat(data[i].params.model))) {
      createdBox.querySelector(".offer__model").innerText =
        data[i].params.model.toUpperCase();
    }
    if (!isNaN(parseFloat(data[i].params.model))) {
      createdBox.querySelector(".offer__model").innerText =
        data[i].params.make.toUpperCase() + " " + data[i].params.model;
    }
    createdBox.querySelector(".offer__information").innerText =
      data[i].params.year +
      " • " +
      data[i].params.mileage +
      "km " +
      " • " +
      data[i].params.engine_power +
      "KM " +
      " • " +
      data[i].params.fuel_type;
    createdBox.querySelector(".offer__description").innerText = data[
      i
    ].title.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, " ");
    createdBox.querySelector(".offer__price--param").innerText =
      data[i].params.price[1].toLocaleString();
    if (data[i].params.price.gross_net === "gross") {
      createdBox.querySelector(".offer__gross-net--param").innerText = "brutto";
    }
    if (data[i].params.price.gross_net === "net") {
      createdBox.querySelector(".offer__gross-net--param").innerText = "netto";
    }

    ulEl.appendChild(createdBox);
  }
}

function eliminateDuplicates(arr) {
  let i,
    len = arr.length,
    out = [],
    obj = {};

  for (i = 0; i < len; i++) {
    obj[arr[i]] = 0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function searchForModels(data) {
  const modelsArr = [];
  let model;

  for (let i = 0; i < data.length; i++) {
    if (isNaN(parseFloat(data[i].params.model))) {
      model = data[i].params.model;
    }
    if (!isNaN(parseFloat(data[i].params.model))) {
      model = data[i].params.make.toUpperCase() + " " + data[i].params.model;
    }
    modelsArr.push(model);
  }
  const uniqueModel = eliminateDuplicates(modelsArr);

  createSelectModelList(uniqueModel);
}

function createSelectModelList(data) {
  const selectEl = document.querySelector(".selection__model");

  for (let i = 0; i < data.length; i++) {
    const propotypeOption = document.querySelector(
      ".selection__model--prototype"
    );
    const createdOption = propotypeOption.cloneNode(true);
    createdOption.removeAttribute("class");
    createdOption.setAttribute("value", data[i]);
    createdOption.innerText = data[i];

    selectEl.appendChild(createdOption);
  }
}

function sortByPrice() {
  ulEl.innerHTML = "";
  const select = document.querySelector(".selection__price");
  let data;

  const selectedValues = [].filter
    .call(select.options, (option) => option.selected)
    .map((option) => option.value);

  if (selectedValues == "decreasing") {
    data = dataFromFetch.sort((a, b) => b.params.price[1] - a.params.price[1]);
  }
  if (selectedValues == "grows") {
    data = dataFromFetch.sort((a, b) => a.params.price[1] - b.params.price[1]);
  }

  createOfferInfo(data);
}

function sortByModel() {
  ulEl.innerHTML = "";
  const select = document.querySelector(".selection__model");
  let data;

  const selectedValues = [].filter
    .call(select.options, (option) => option.selected)
    .map((option) => option.value);

  if (selectedValues == "all") {
    data = dataFromFetch;
  }
  if (selectedValues != "all") {
    data = dataFromFetch.filter(
      (item) =>
        item.params.model == selectedValues ||
        item.params.make.toUpperCase() + " " + item.params.model ==
          selectedValues
    );
  }

  createOfferInfo(data);
}
