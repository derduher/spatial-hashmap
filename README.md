# Spatial Hashmap

[![codecov](https://codecov.io/gh/derduher/spatial-hashmap/branch/master/graph/badge.svg)](https://codecov.io/gh/derduher/spatial-hashmap)
[![CircleCI](https://circleci.com/gh/derduher/spatial-hashmap.svg?style=svg)](https://circleci.com/gh/derduher/spatial-hashmap)

Spatial Hashmap is a module for answering the question "What is near an object with these coordinates?". It was created based off the algorithm defined in ["Optimization of Large-Scale, Real-Time Simulations by Spatial Hashing"](http://www.cs.ucf.edu/~jmesit/publications/scsc%202005.pdf)

## Install

`npm i spatial-hashmap`

## Usage

```javascript
// pass in the width, height, and cell size
// cell size - use this to control how big a region is returned when asking for nearby objects
const sm = new SpatialManager(100, 100, 10)
// this can be literally anything
const yourObject = {your: 'object'}
// pass in a geometry with this shape
const geometry = {
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
}
sm.registerObject(yourObject, geometry)
sm.registerObject({your: 'otherObject'}, ...)

// returns Set of nearby objects
sm.getNearby(geometryOfOtherObject)
sm.clearMap()
```

## API

### clearMap()

Empties Spatial Hashmap and reinitializes.

### registerObject(obj, geo)

How you get your obj into the map

@param obj - what you want to register in the spatial hashmap

@param geo - a description of the objects position and bounding box

```
{
  // position of the object
  pos: {
    x: 0,
    y: 0
  },
  // bounding box relative to position
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
}
```

### getIdsForGeometry(geo)

Returns all the possible buckets an object's geometry is in as a set

### SpatialManager.idForPoint(point, cellsizeInv, numCols) (static)

Given a Point return its bucket ID

@param cellsizeInv - 1 / cellsize

@param numcols - the number of cols in the spatial map

### spatialManager.idForPoint(point) (instance)

Given a Point return its bucket ID

### getNearby(geo)

Given a geometry return the objects nearby
