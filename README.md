# Hot Reloading for [proton-native](https://github.com/kusti8/proton-native)

Components imported from other files reload automagically without restarting the app or having to change any code.

```sh
git clone https://github.com/mischnic/proton-hot-boilerplate
cd proton-hot-boilerplate
yarn # or npm i
yarn dev # or npm run dev
```

## Caveats/Issues

- Hot reloading `index.js` (the main script) doesn't work (because reloading a `App` component doesn't work)
- The Windows position resets if reloaded (can't be fixed ?)
- Higher order components likely don't work
- There should really be a test for every edge case of the babel transform

**Nevertheless, please open an issue with any code that isn't working as expected (e.g. not working at all or not hot reloading).**
