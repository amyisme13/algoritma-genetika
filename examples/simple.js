const Genetic = require('../index');
const { randomNumber } = require('../util');

const [minX, maxX] = [-50, 50];
const [minY, maxY] = [-50, 50];

const genetic = new Genetic({
  populationSize: 1,
  populationFunction: () => ({
    x: randomNumber(minX, maxX, true),
    y: randomNumber(minY, maxY, true),
  }),
  crossoverFunction: (a, b) => [
    {
      x: randomNumber(a.x, maxX, true),
      y: randomNumber(minY, a.y, true),
    },
    {
      x: randomNumber(b.x, maxX, true),
      y: randomNumber(minY, b.y, true),
    },
  ],
  mutationFunction: a => ({
    x: randomNumber(a.x, maxX, true),
    y: randomNumber(minY, a.y, true),
  }),
  fitnessFunction: i => i.x ** 2 - i.y,
});

genetic.evolve();
