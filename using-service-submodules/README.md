# Example including service definition as submodule

Submodule `__unmock__/petstore.swagger.io` was added with

```bash
git submodule add git@github.com:ksaaskil/petstore.swagger.io.git __unmock__/petstore.swagger.io
```

See [index.test.ts](./index.test.ts) for an example how to use the service pulled as a submodule.

## Instructions

Install dependencies:

```
npm i
yarn // If using yarn
```

Run tests:

```
npm run test
yarn test
```
