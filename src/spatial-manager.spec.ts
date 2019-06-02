import SpatialManager, {Geometry} from './spatial-manager'

class Point2 {
  constructor (public x = 0, public y = 0) {}
}

const obj: {foo: string} = {foo: 'bar'}

function generateObj (): typeof obj {
  return {foo: 'baz'}
}

function generateGeometry (): Geometry {
  return {
    pos: new Point2(),
    aabb: {
      min: new Point2(),
      max: new Point2()
    }
  }
}

describe('SpatialManager', () => {
  let spatial: SpatialManager<typeof obj>
  beforeEach(() => {
    spatial = new SpatialManager(1000, 1000, 10)
  })

  describe('clearBuckets', () => {
    it('empties all buckets', () => {
      spyOn(spatial, 'getIdsForGeometry').and.returnValue([0, 1])
      const foo = generateObj()
      spatial.registerObject(foo, generateGeometry())
      // @ts-ignore next
      expect(spatial.buckets.get(0).has(foo)).toBeTruthy()
      spatial.clearMap()
      // @ts-ignore next
      expect(spatial.buckets.get(0).has(foo)).toBeFalsy()
    })
  })
  
  describe('registerObject', () => {
    it('adds the passed in obj to its matching buckets', () => {
      spyOn(spatial, 'getIdsForGeometry').and.returnValue([0, 1])
      const foo = generateObj()
      spatial.registerObject(foo, generateGeometry())
      // @ts-ignore next
      expect(spatial.buckets.get(0).has(foo)).toBeTruthy()
      // @ts-ignore next
      expect(spatial.buckets.get(1).has(foo)).toBeTruthy()
    })
  })

  describe('getIdForObject', () => {
    it('returns an array of ids', () => {
      const geo = {
        pos: new Point2,
        aabb: {
          min: new Point2(),
          max: new Point2(11, 11)
        }
      }
      expect(spatial.getIdsForGeometry(geo).has(101)).toBe(true)
      expect(spatial.getIdsForGeometry(geo).has(1)).toBe(true)
      expect(spatial.getIdsForGeometry(geo).has(100)).toBe(true)
      expect(spatial.getIdsForGeometry(geo).has(0)).toBe(true)
      expect(spatial.getIdsForGeometry(geo).size).toBe(4)
    })
  })

  describe('idForPoint', () => {
    it('translates the given coordinates into an id', () => {
    // return (x * this.cf | 0) + (y * this.cf | 0) * this.cols | 0
      expect(spatial.idForPoint(new Point2(100, 50))).toBe(510)
      expect(spatial.idForPoint(new Point2(0, 0))).toBe(0)
      expect(spatial.idForPoint(new Point2(11, 0))).toBe(1)
    })
  })

  describe('getNearby', () => {
    it('returns a set of object near the passed in obj', () => {
      spyOn(spatial, 'getIdsForGeometry').and.returnValue([0, 1])
      const foo = generateObj()
      const bar = generateObj()
      const baz = generateObj()
      spatial.registerObject(foo, generateGeometry())
      spatial.registerObject(bar, generateGeometry())
      const nearby = spatial.getNearby(generateGeometry())
      expect(nearby.has(foo)).toBeTruthy()
      expect(nearby.has(bar)).toBeTruthy()
      expect(nearby.has(baz)).toBeFalsy()
    })
  })
})
