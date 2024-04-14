# Benchmark

## Prepare

```sh
yarn add leo-profanity bad-words
yarn build
```

## Run benchmark

```sh
node ./benchmark.js
```

## Results on MacBook Pro (16-inch, 2021)

### Run #1

#### Benchmark results

|Task Name|Average Time (ns)|Variance (ns)|ops/sec|
|---------|-----------------|-------------|-------|
|**BadWordsNext:check**|**45.465005467314235**|**0.32207007904319**|**21994938**|
|LeoProfanity:check|7084.83336371308|4.747408394319532|141146|
|BadWords:check|371070.2428111324|375567.9524534872|2694|
|**BadWordsNext:filter**|**5839.616385689617**|**10.852742059796013**|**171244**|
|LeoProfanity:filter|15805.115666612513|18.892307190037478|63270|
|BadWords:filter|16611483.412981033|7516.805317228207|60|

#### Check results

```js
BadWordsNext:check true
LeoProfanity:check true
BadWords:check true
```

### Run #2

#### Benchmark results

|Task Name|Average Time (ns)|Variance (ns)|ops/sec|
|---------|-----------------|-------------|-------|
|**BadWordsNext:check**|**46.22891465986769**|**0.3980587018006243**|**21631483**|
|LeoProfanity:check|5311.16220244397|2.148180425952782|188282|
|BadWords:check|351322.59736981307|323924.4036706629|2846|
|**BadWordsNext:filter**|**3025.0457902664034**|**3.918094568191229**|**330573**|
|LeoProfanity:filter|11862.303541586389|27.125437128106828|84300|
|BadWords:filter|8401191.165049871|26075.88532391753|119|

#### Check results

```js
BadWordsNext:check true
LeoProfanity:check false // this check result is wrong
BadWords:check true
```

### Run #3

#### Benchmark results

|Task Name|Average Time (ns)|Variance (ns)|ops/sec|
|---------|-----------------|-------------|-------|
|**BadWordsNext:check**|**45.026350657697115**|**0.08517293734090667**|**22209217**|
|LeoProfanity:check|146202.43614180046|254.45442800457366|6839|
|BadWords:check|1660642.7519047847|2888.4152499450784|602|
|**BadWordsNext:filter**|**47.05293836532273**|**0.10027065029917757**|**21252657**|
|LeoProfanity:filter|325971.4828252015|234.90891661782217|3067|
|BadWords:filter|289329312.49141693|889253.2382003717|3|

#### Check results

```js
BadWordsNext:check false
LeoProfanity:check false
BadWords:check false
```
