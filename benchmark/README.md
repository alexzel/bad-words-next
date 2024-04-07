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

|Task Name|Average Time (ps)|Variance (ps)|
|---------|-----------------|-------------|
|**BadWordsNext:check**|**0.06638201297733286**|**0.004539486163132269**|
|LeoProfanity:check|7.222238607662132|0.020526526087941182|
|BadWords:check|369.0270471396922|652.80899558365|
|**BadWordsNext:filter**|**6.369680796459222**|**0.07329345018353091**|
|LeoProfanity:filter|16.473531133946743|0.07108016436329749|
|BadWords:filter|13935.916721820831|1550.203777424369|

#### Check results

```js
BadWordsNext:check true
LeoProfanity:check true
BadWords:check true
```

### Run #2

#### Benchmark results

|Task Name|Average Time (ps)|Variance (ps)|
|---------|-----------------|-------------|
|**BadWordsNext:check**|**0.06945916290377001**|**0.004652467607761704**|
|LeoProfanity:check|5.216321750684845|0.00838680288150679|
|BadWords:check|271.1025447380252|1.792571563179542|
|**BadWordsNext:filter**|**3.208444776965852**|**0.024105265604765492**|
|LeoProfanity:filter|12.008501547786848|0.028839924213570994|
|BadWords:filter|6917.233117421469|501.0235655967264|

#### Check results

```js
BadWordsNext:check true
LeoProfanity:check false // this check result is wrong
BadWords:check true
```

### Run #3

#### Benchmark results

|Task Name|Average Time (ps)|Variance (ps)|
|---------|-----------------|-------------|
|**BadWordsNext:check**|**0.0684184871491811**|**0.0005664190186490255**|
|LeoProfanity:check|145.54107934236526|0.41215264071434377|
|BadWords:check|1716.5473154035665|227.85273467455897|
|**BadWordsNext:filter**|**0.07221527299207924**|**0.0004734945680949354**|
|LeoProfanity:filter|329.1995580259122|1.6238536398754997|
|BadWords:filter|245295.5917954445|41091.74011662451|

#### Check results

```js
BadWordsNext:check false
LeoProfanity:check false
BadWords:check false
```
