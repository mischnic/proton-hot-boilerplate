# Hot Reloading for [proton-native](https://github.com/kusti8/proton-native)

```sh
git clone https://github.com/mischnic/proton-hot-boilerplate
cd proton-hot-boilerplate
yarn # or npm i
yarn dev # or npm run dev
```

## Caveats/Issues

- Reloading `index.js` (the main script) doesn't work (because reloading a `App` component doesn't work)
- The Windows position resets if reloaded (can't be fixed !?)
- Higher order components likely don't work
- There should really be a test for every edge case
