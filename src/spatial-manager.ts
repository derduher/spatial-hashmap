export interface PointLike {
  x: number;
  y: number;
}
export interface BoundingBox {
  min: PointLike;
  max: PointLike;
}
export interface Geometry {
  pos: PointLike;
  aabb: BoundingBox;
}

export default class SpatialManager<T> {
  private cf: number
  private cols: number
  private rows: number
  public numbuckets: number
  public buckets: Map<number,Set<T>>
  public constructor (
    public SceneWidth: number,
    public SceneHeight: number,
    public cellsize: number
  ) {
    this.cf = 1 / cellsize

    this.cols = Math.ceil(SceneWidth * this.cf)
    this.rows = Math.ceil(SceneHeight * this.cf)
    this.buckets = new Map()
    this.numbuckets = this.rows * this.cols
    this.clearMap()
  }

  /**
   * Empties Spatial Hashmap and reinitializes.
   */
  public clearMap (): void {
    this.buckets.clear()
    for (let i = 0; i < this.numbuckets; i++) {
      this.buckets.set(i, new Set())
    }
  }

  /**
   * How you get your obj into the map
   * @param obj - what you want to register in the spatial hashmap
   * @param geo - a description of the objects position and bounding box
   */
  public registerObject (obj: T, geo: Geometry): void {
    for (let id of this.getIdsForGeometry(geo)) {
      let cell = this.buckets.get(id)
      /* istanbul ignore else */
      if (cell) {
        cell.add(obj)
      }
    }
  }

  /**
   * Returns all the possible buckets an object's geometry is in
   * @param - geo The geometry
   * @returns - a Set of bucket ids for the passed in geometry
   */
  public getIdsForGeometry (geo: Geometry): Set<number> {
    const bucketsObjIsIn: Set<number> = new Set()
    const maxX = geo.pos.x + geo.aabb.max.x
    const maxY = geo.pos.y + geo.aabb.max.y
    const cf = this.cf
    const cols = this.cols

    const minX = (geo.pos.x / this.cellsize | 0) * this.cellsize
    const minY = (geo.pos.y / this.cellsize | 0) * this.cellsize
    for (let i = (maxX / this.cellsize | 0) * this.cellsize; i >= minX; i -= this.cellsize) {
      for (let j = (maxY / this.cellsize | 0) * this.cellsize; j >= minY; j -= this.cellsize) {
        const id = SpatialManager.idForPoint({x: i, y: j}, cf, cols)
        // ignore collisions offscreen
        if (id >= 0 && id < this.numbuckets) {
          bucketsObjIsIn.add(id)
        }
      }
    }

    return bucketsObjIsIn
  }

  /**
   * Given a Point return its bucket ID
   * @param cf - 1 / cellsize
   * @param cols the number of cols in the spatial map
   */
  public static idForPoint (point: PointLike, cf: number, cols: number): number {
    return (point.x * cf | 0) + (point.y * cf | 0) * cols | 0
  }

  /**
   * Given a Point return its bucket ID
   */
  public idForPoint (point: PointLike): number {
    return SpatialManager.idForPoint(point, this.cf, this.cols)
  }

  /**
   * Given a geometry return the objects nearby
   */
  public getNearby (geo: Geometry): Set<T> {
    const nearby: Set<T> = new Set()
    const ids = this.getIdsForGeometry(geo)

    for (let id of ids) {
      let bucketI = this.buckets.get(id)
      /* istanbul ignore else */
      if (bucketI) {
        const bucket = bucketI.values()
        for (let b of bucket) {
          nearby.add(b)
        }
      }
    }
    return nearby
  }
}
