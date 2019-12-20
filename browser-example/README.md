# Example running Unmock in browser

Example web app showing Pokemon stats from [PokéAPI](https://pokeapi.co/).

Uses Unmock for fetching data when `NODE_ENV===development`, otherwise uses PokéAPI.

## Instructions

Install dependencies:

```bash
yarn
```

Start development server:

```bash
yarn dev
```

Build for production:

```bash
yarn build
```

## TODO

- Browser tests (Puppeteer? Karma?)
- Component with a button for switching Unmock on and off
