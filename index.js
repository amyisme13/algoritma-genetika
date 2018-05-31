/* eslint-disable no-fallthrough */

const { randomNumber } = require('./util');

class Genetic {
  constructor(options) {
    this.options = {
      ...Genetic.defaultOptions,
      ...options,
    };
    this.state = Genetic.state.initial;

    this.population = [];
    this.populationHistory = [];

    this.children = [];
  }

  static get defaultOptions() {
    return {
      populationSize: 10,
      crossoverRate: 0.5,
      mutationRate: 0.5,
      populationFunction: () => [1],
      crossoverFunction: (a, b) => [a, b],
      mutationFunction: a => a,
      fitnessFunction: () => 1,
      selectionFunction: (a, b) => (a.fitness > b.fitness ? a : b),
    };
  }

  static get state() {
    return {
      initial: 'INITIALIZED',
      populate: 'POPULATED',
      crossover: 'CROSSED OVER',
      mutate: 'MUTATED',
      fit: 'FITTED',
      select: 'SELECTED',
      evolve: 'EVOLVED',
    };
  }

  populate() {
    const { populationFunction, populationSize, fitnessFunction } = this.options;
    while (this.population.length < populationSize) {
      this.population.push(populationFunction());
    }

    this.populationHistory.push(this.population.map(individual => ({
      fitness: fitnessFunction(individual),
      individual,
    })));

    this.state = Genetic.state.populate;
    return this;
  }

  crossover() {
    const { crossoverFunction, crossoverRate, populationSize } = this.options;
    const rate = crossoverRate * populationSize;
    const children = [];

    while (children.length < rate) {
      const mother = this.population[randomNumber(populationSize - 1)];
      const father = this.population[randomNumber(populationSize - 1)];

      children.push(...crossoverFunction(mother, father));
    }

    this.children.push(...children.slice(0, rate));

    this.state = Genetic.state.crossover;
    return this;
  }

  mutate() {
    const { mutationFunction, mutationRate, populationSize } = this.options;
    const rate = mutationRate * populationSize;
    const children = [];

    while (children.length < rate) {
      const parent = this.population[randomNumber(populationSize - 1)];

      children.push(mutationFunction(parent));
    }

    this.children.push(...children);

    this.state = Genetic.state.mutate;
    return this;
  }

  fit() {
    const { fitnessFunction } = this.options;

    this.populationWithFitness = this.population.map(individual => ({
      fitness: fitnessFunction(individual),
      individual,
    }));

    this.childrenWithFitness = this.children.map(individual => ({
      fitness: fitnessFunction(individual),
      individual,
    }));

    this.state = Genetic.state.fitness;
    return this;
  }

  select() {
    const { populationSize, selectionFunction } = this.options;
    const population = [...this.populationWithFitness, ...this.childrenWithFitness];
    const selected = [];

    while (selected.length < populationSize) {
      const home = population[randomNumber(population.length - 1)];
      const away = population[randomNumber(population.length - 1)];

      selected.push(selectionFunction(home, away));
    }

    this.populationHistory.push(selected);
    this.population = selected.map(i => i.individual);

    this.state = Genetic.state.select;
    return this;
  }

  evolve() {
    switch (this.state) {
      case Genetic.state.initial:
        this.populate();
      case Genetic.state.evolve:
      case Genetic.state.populate:
        this.crossover();
      case Genetic.state.crossover:
        this.mutate();
      case Genetic.state.mutate:
        this.fit();
      case Genetic.state.fit:
        this.select();
      default:
        break;
    }

    this.state = Genetic.state.evolve;
    return this;
  }

  get best() {
    if (!this.populationHistory.length) {
      return 0;
    }

    return this.populationHistory
      .slice(-1)[0]
      .reduce((best, i) => (best.fitness > i.fitness ? best : i));
  }
}

module.exports = Genetic;
