# Benchmarks

## Prepare

```sh
yarn add leo-profanity bad-words
```

## Run

```sh
node ./benchmark.js
```

## Results on MacBook Pro (16-inch, 2021)

|Task Name|Average Time (ps)|Variance (ps)|
|---------|-----------------|-------------|
|**BadWordsNext:check**|**0.06812153359276872**|**0.017196433033053415**|
|LeoProfanity:check|5.292628132561964|0.006905092296305512|
|BadWords:check|341.4517864839209|547.9307879398782|
|**BadWordsNext:filter**|**3.393507880793036**|**0.03768847281324516**|
|LeoProfanity:filter|12.32597279251834|0.04510877200234826|
|BadWords:filter|7082.269469896953|534.5598664437144|
