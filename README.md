# Spatial Hashmap JS
[![codecov](https://codecov.io/gh/derduher/spatial-hashmap-js/branch/master/graph/badge.svg)](https://codecov.io/gh/derduher/spatial-hashmap-js)
[![CircleCI](https://circleci.com/gh/derduher/spatial-hashmap-js.svg?style=svg)](https://circleci.com/gh/derduher/spatial-hashmap-js)
Spatial Hashmap JS is a module for answering the question "What is near an object with these coordinates?". It was created based off the algorithm defined in [this paper](http://www.cs.ucf.edu/~jmesit/publications/scsc%202005.pdf)

## Install

`npm i spatial-hashmap-js`

## Usage

```javascript
const sm = new SpatialManager(100, 100, 10)
sm.registerObject({your: 'object'}, {
  pos: {
    x: 0,
    y: 0
  },
  aabb: {
    min: {
      x: 0,
      y: 0
    }
    max: {
      x: 12,
      y: 10
    }
  }
})
sm.registerObject({your: 'otherObject'}, ...)
sm.getNearby(geometryOfOtherObject)
// returns Set of nearby objects
```
