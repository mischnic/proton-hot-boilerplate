# Hot Reloading for [proton-native](https://github.com/kusti8/proton-native)

Components imported from other files reload automagically without restarting the app or having to change any code.

```sh
git clone https://github.com/mischnic/proton-hot-boilerplate
cd proton-hot-boilerplate
yarn # or npm i
yarn dev # or npm run dev
```

## Caveats/Issues

- **WIP**: Hot reloading `index.js` (the main script) doesn't work
- The Windows position resets if reloaded ~(can't be fixed ?)~
- Higher order components aren't hot reloaded (yet?)

**Nevertheless, please open an issue with any code that isn't working as expected (e.g. not working at all (crashing) or not hot reloading).**
