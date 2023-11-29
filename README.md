# Advent of Code 2023

This repository has some boilerplate, utils and setup for running Advent of Code easily.

It has built in support for Typescript, Ruby and Python.

## Setup

Copy `.env.example` to `.env`, and set LANGUAGE to your desired value.
Log in on advent of code, and copy the `session` cookie to your the `SESSION` env var.
Now run `nvm use` and `yarn install`.

## Running

To run your code, simply run `yarn [your-language]`, e.g. `yarn typescript`.
This will run tests (if provided), execute your code, and send the solution.
Solutoons will be deduped before sending.

## Utils (typescript)

Typescript has some special utils in the `utils/typescript` folder. There are:

- `.last` as an extension method on Array. Let's be honest, it should always have been there.
- `printGrid(grid: string[][])` to display a grid.
- `visualisePoints(points: Record<string, Point[]>)`: creates a visual grid with marks at the specified points.
  - For example: `visualisePoints({a: [0, 0], b: [0, 1]})` prints `ab`
- `aStar` is the [A\* algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
