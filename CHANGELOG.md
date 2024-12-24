# Changelog

## [3.1.0](https://github.com/alexzel/bad-words-next/compare/v3.0.0...v3.1.0) (2024-12-24)


### Features

* update dictionaries ([3dd1e3a](https://github.com/alexzel/bad-words-next/commit/3dd1e3a46573a07e8e92b82734050c7af38c0b81))

## [3.0.0](https://github.com/alexzel/bad-words-next/compare/v2.3.2...v3.0.0) (2024-12-13)


### ⚠ BREAKING CHANGES

* remove json files and encode dictionaries b/c of sensitivity

### Features

* remove json files and encode dictionaries b/c of sensitivity ([e7a4758](https://github.com/alexzel/bad-words-next/commit/e7a475880d9e1632ebd1e1a6ef185063b0976130))
* use decoder in benchmarks ([e650dea](https://github.com/alexzel/bad-words-next/commit/e650deacdce0add31e60decad314b985f854045d))


### Bug Fixes

* add rollup cache to .gitignore file ([95d1d51](https://github.com/alexzel/bad-words-next/commit/95d1d5167a9bb882777ed434e598bac707dc5166))
* fix dictionary data import in benchmark script ([c6f50ae](https://github.com/alexzel/bad-words-next/commit/c6f50ae3cc4b9c6ffd6cf8a50b17a0f95d4fce92))
* fix some types and props visibility for docs wiki ([9b8bc8f](https://github.com/alexzel/bad-words-next/commit/9b8bc8f37295a1b79fec4b0421f422cec0a3318c))
* remove resolveJsonModule from typescript config ([65278e1](https://github.com/alexzel/bad-words-next/commit/65278e14fb5e7c4fc2c87b8bdb33de96e1a5baf2))

## [2.3.2](https://github.com/alexzel/bad-words-next/compare/v2.3.1...v2.3.2) (2024-12-11)


### Bug Fixes

* update libs usage to their latest interfaces ([d96238b](https://github.com/alexzel/bad-words-next/commit/d96238bebe8bffc160f7e248325654d26f69aa3b))
* update lookalikes in en.json to treat 3 as E ([#19](https://github.com/alexzel/bad-words-next/issues/19)) ([6f78bbd](https://github.com/alexzel/bad-words-next/commit/6f78bbd5010a62622353a15496038d35d1870568))

## [2.3.1](https://github.com/alexzel/bad-words-next/compare/v2.3.0...v2.3.1) (2024-04-07)


### Bug Fixes

* add build command into benchmarks readme file ([42d84f7](https://github.com/alexzel/bad-words-next/commit/42d84f71c3a986c1d8cb0170c2bd0db8a0d4573e))
* use lookalike instead of the actual bad word in the readme ([71668ae](https://github.com/alexzel/bad-words-next/commit/71668aeb8f2c6030b26467ab7969cd4a0cbefb49))

## [2.3.0](https://github.com/alexzel/bad-words-next/compare/v2.2.1...v2.3.0) (2024-04-07)


### Features

* a test for exclusions ([6efc106](https://github.com/alexzel/bad-words-next/commit/6efc1066577064c2cef384535dad520db1d22b4f))
* ability to add exclusions ([97c08b9](https://github.com/alexzel/bad-words-next/commit/97c08b9086ca7185271c82470bb06874c9597a4c))
* example how to use exclusions ([5893721](https://github.com/alexzel/bad-words-next/commit/589372104179e4847347dac06634a20ee16cc550))


### Bug Fixes

* compile exclusions regexps only once ([8184425](https://github.com/alexzel/bad-words-next/commit/8184425fb6ee85a802f817475e167273d6387222))
* improve exclusions performance by employing internal cache ([b798d8a](https://github.com/alexzel/bad-words-next/commit/b798d8a2529b5b5cf9c0df980284168a77c53d88))
* readme example was fixed ([09dcf02](https://github.com/alexzel/bad-words-next/commit/09dcf02c77803db3d820dd5adcf551d39ed09672))

## [2.2.1](https://github.com/alexzel/bad-words-next/compare/v2.2.0...v2.2.1) (2023-06-21)


### Performance Improvements

* move string comparison out of map ([99bc141](https://github.com/alexzel/bad-words-next/commit/99bc141d81fc2994622a83e93b489a763fc875db))

## [2.2.0](https://github.com/alexzel/bad-words-next/compare/v2.1.0...v2.2.0) (2023-06-21)


### Features

* implement placeholderMode to address the feature request ([5aa1b76](https://github.com/alexzel/bad-words-next/commit/5aa1b763a0940383c3fa8676d5250050b13812d4))

## [2.1.0](https://github.com/alexzel/bad-words-next/compare/v2.0.1...v2.1.0) (2023-06-04)


### Features

* **data:** improve en.json dictionary ([98d0d11](https://github.com/alexzel/bad-words-next/commit/98d0d115292a123f75f499384cd04b7b171ab50a))
* **data:** improve ru.json and ru_lat.json dictionaries ([71c19b4](https://github.com/alexzel/bad-words-next/commit/71c19b4d0565e1755b7c2e043bd4f26a5e6be112))

## [2.0.1](https://github.com/alexzel/bad-words-next/compare/v2.0.0...v2.0.1) (2023-06-02)


### Bug Fixes

* fix typedoc missing plugins ([a85a9ee](https://github.com/alexzel/bad-words-next/commit/a85a9ee30296feb594ce88ebb7fca1bd7cfc5133))

## [2.0.0](https://github.com/alexzel/bad-words-next/compare/v1.6.8...v2.0.0) (2023-06-02)


### ⚠ BREAKING CHANGES

* convert benchmark to esm
* fix rollup build
* fix ts warnings and use different types
* convert package to esm and bump latest dependencies

### Features

* convert package to esm and bump latest dependencies ([479824a](https://github.com/alexzel/bad-words-next/commit/479824a6e3ecaef467443b6b57a488ea9a4d394f))


### Bug Fixes

* convert benchmark to esm ([28ea0f3](https://github.com/alexzel/bad-words-next/commit/28ea0f3164df538de124fb993e44edfcf7ecd87a))
* fix rollup build ([d73190e](https://github.com/alexzel/bad-words-next/commit/d73190ee4dcc12a2a451f88f218706a2755fc0e0))
* fix ts warnings and use different types ([1044011](https://github.com/alexzel/bad-words-next/commit/1044011d103a8163dcd422770c98783a82fa9a26))

## [1.6.8](https://github.com/alexzel/bad-words-next/compare/v1.6.7...v1.6.8) (2023-06-02)


### Features

* **data:** update dictionaries ([62fe324](https://github.com/alexzel/bad-words-next/commit/62fe32455902b118c25048fa8fb4dd8f1f0176e2))


### Miscellaneous Chores

* release 1.6.8 ([3c16736](https://github.com/alexzel/bad-words-next/commit/3c1673684da4cf4652d9c7e12c687feff4753dfc))

## [1.6.7](https://github.com/alexzel/bad-words-next/compare/v1.6.6...v1.6.7) (2023-04-03)


### Features

* **data:** update dictionaries ([f685c6e](https://github.com/alexzel/bad-words-next/commit/f685c6e0e67c8edb2da9e9389c7c99a3a95e00a5))


### Miscellaneous Chores

* release 1.6.7 ([e239169](https://github.com/alexzel/bad-words-next/commit/e239169e7b441eb1635780ef7fa5f9966a9cffba))

## [1.6.6](https://github.com/alexzel/bad-words-next/compare/v1.6.5...v1.6.6) (2023-04-03)


### Bug Fixes

* remove wiki workflow badge ([6625662](https://github.com/alexzel/bad-words-next/commit/6625662514814b483efacfe9f84d932f55d68747))

## [1.6.5](https://github.com/alexzel/bad-words-next/compare/v1.6.4...v1.6.5) (2023-04-03)


### Bug Fixes

* add missing prepare husky script ([dc40aa0](https://github.com/alexzel/bad-words-next/commit/dc40aa0beeccc31aa6045281cda67295fc35a3d6))

## [1.6.4](https://github.com/alexzel/bad-words-next/compare/v1.6.3...v1.6.4) (2023-04-03)


### Bug Fixes

* fix release script ([9650142](https://github.com/alexzel/bad-words-next/commit/96501421fe4ea8c3ba1e16c85c02773571efd80f))

## [1.6.3](https://github.com/alexzel/bad-words-next/compare/v1.6.2...v1.6.3) (2023-04-03)


### Bug Fixes

* wiki ([0402727](https://github.com/alexzel/bad-words-next/commit/04027273221b4932eedd351d3bb0e16edbf0971d))

## [1.6.2](https://github.com/alexzel/bad-words-next/compare/v1.6.1...v1.6.2) (2023-04-03)


### Bug Fixes

* fix release script ([2a4e970](https://github.com/alexzel/bad-words-next/commit/2a4e970e6b3fdc576bb03f6a8b658aea524fd9ac))

## [1.6.1](https://github.com/alexzel/bad-words-next/compare/v1.6.0...v1.6.1) (2023-04-03)


### Miscellaneous Chores

* release 1.6.1 ([5976ab5](https://github.com/alexzel/bad-words-next/commit/5976ab51d2ada16bb4bf3200361527a7953a68f7))


## [1.6.0](https://github.com/alexzel/bad-words-next/compare/v1.5.3...v1.6.0) (2023-04-03)


### Features

* added optional onBadword callback to the filter method ([0065215](https://github.com/alexzel/bad-words-next/commit/0065215d95570c4be04e669231e773432d4e464e))
