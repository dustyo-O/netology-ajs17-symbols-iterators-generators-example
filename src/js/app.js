/* eslint-disable no-mixed-operators */
/* eslint-disable class-methods-use-this */
// TODO: write your code here

// [1, 5)

// 1 2 3 4
class AsymptoticRange {
  constructor(from, to, speed, delta) {
    this.from = from;
    this.to = to;
    this.speed = speed;
    this.delta = delta;
  }

  [Symbol.iterator]() {
    let current = this.from;
    const { to, speed, delta } = this;

    return {
      next() {
        const done = current >= to - delta;
        if (done) {
          return { done };
        }

        const result = {
          done,
          value: current,
        };

        current += (to - current) / 100 * speed;

        return result;
      },
    };
  }
}

window.range = new AsymptoticRange(1, 100, 10, 0.00000001);

const cities = [];

function* generateCitiesList() {
  let city;

  // eslint-disable-next-line no-cond-assign
  while (city = cities.shift()) {
    yield city;
  }
}

function getCitiesNames(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => json.map((city) => city.name))
    .then((cityNames) => {
      cityNames.forEach((name) => cities.push(name));
    });
}

const fetchForeignCities = getCitiesNames(
  'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json',
);

const fetchRussianCities = getCitiesNames(
  'https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json',
);

const citiesContainer = document.querySelector('.cities');

function renderCity(cityName) {
  const div = document.createElement('div');

  div.innerText = cityName;

  citiesContainer.appendChild(div);
}

Promise.race([fetchForeignCities, fetchRussianCities]).then(() => {
  console.log('first in!');

  const citiesGen = generateCitiesList();

  function generate100Cities() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 100; i++) {
      const city = citiesGen.next().value;

      renderCity(city);
    }
  }

  generate100Cities();

  window.addEventListener('scroll', (event) => {
    const { body } = document;
    const html = document.documentElement;

    const height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    const viewportHeight = window.innerHeight;

    if (height - window.scrollY < 2 * viewportHeight) {
      generate100Cities();
    }
  });
});
