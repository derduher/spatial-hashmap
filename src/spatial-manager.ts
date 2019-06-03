export interface PointLike {
  x: number
  y: number
}
export interface BoundingBox {
  min: PointLike
  max: PointLike
}
export interface Geometry {
  pos: PointLike
  aabb: BoundingBox
}

export default class SpatialManager<T> {
  private cellSizeInv: number
  private numCols: number
  private numRows: number
  public numBuckets: number
  public buckets: Map<number, Set<T>>
  public constructor(
    public SceneWidth: number,
    public SceneHeight: number,
    public cellSize: number
  ) {
    this.cellSizeInv = 1 / cellSize

    this.numCols = Math.ceil(SceneWidth * this.cellSizeInv)
    this.numRows = Math.ceil(SceneHeight * this.cellSizeInv)
    this.buckets = new Map()
    this.numBuckets = this.numRows * this.numCols
    this.clearMap()
  }

  /**
   * Empties Spatial Hashmap and reinitializes.
   */
  public static clearMap<U>(
    buckets: Map<number, Set<U>>,
    numBuckets: number
  ): void {
    buckets.clear()
    for (let i = 0; i < numBuckets; i++) {
      buckets.set(i, new Set())
    }
  }

  /**
   * Empties Spatial Hashmap and reinitializes.
   */
  public clearMap(): void {
    SpatialManager.clearMap(this.buckets, this.numBuckets)
  }

  /**
   * How you get your obj into the map
   * @param obj - what you want to register in the spatial hashmap
   * @param ids - the buckets within the map the object should be registered to
   * @param buckets - the Map to add the object to
   */
  public static registerObject<U>(
    obj: U,
    ids: Set<number>,
    buckets: Map<number, Set<U>>
  ): void {
    for (let id of ids) {
      const cell = buckets.get(id)
      /* istanbul ignore else */
      if (cell) {
        cell.add(obj)
      }
    }
  }

  /**
   * How you get your obj into the map
   * @param obj - what you want to register in the spatial hashmap
   * @param geo - a description of the objects position and bounding box
   */
  public registerObject(obj: T, geo: Geometry): void {
    SpatialManager.registerObject(
      obj,
      this.getIdsForGeometry(geo),
      this.buckets
    )
  }

  /**
   * Returns all the possible buckets an object's geometry is in
   * @returns - a Set of bucket ids for the passed in geometry
   */
  public static getIdsForGeometry(
    pos: PointLike,
    min: PointLike,
    max: PointLike,
    cellSize: number,
    numCols: number,
    numBuckets: number
  ): Set<number> {
    const bucketsObjIsIn: Set<number> = new Set()
    const maxX = pos.x + max.x
    const maxY = pos.y + max.y
    const cf = 1 / cellSize

    const minX = ((pos.x * cf) | 0) * cellSize
    const minY = ((pos.y * cf) | 0) * cellSize
    for (let i = ((maxX * cf) | 0) * cellSize; i >= minX; i -= cellSize) {
      for (let j = ((maxY * cf) | 0) * cellSize; j >= minY; j -= cellSize) {
        const id = SpatialManager.idForPoint({ x: i, y: j }, cf, numCols)
        // ignore collisions offscreen
        if (id >= 0 && id < numBuckets) {
          bucketsObjIsIn.add(id)
        }
      }
    }

    return bucketsObjIsIn
  }

  /**
   * Returns all the possible buckets an object's geometry is in
   * @param - geo The geometry
   * @returns - a Set of bucket ids for the passed in geometry
   */
  public getIdsForGeometry(geo: Geometry): Set<number> {
    return SpatialManager.getIdsForGeometry(
      geo.pos,
      geo.aabb.min,
      geo.aabb.max,
      this.cellSize,
      this.numCols,
      this.numBuckets
    )
  }

  /**
   * Given a Point return its bucket ID
   * @param cellSizeInv - 1 / cellsize
   * @param numCols the number of cols in the spatial map
   */
  public static idForPoint(
    point: PointLike,
    cellSizeInv: number,
    numCols: number
  ): number {
    return (
      (((point.x * cellSizeInv) | 0) +
        ((point.y * cellSizeInv) | 0) * numCols) |
      0
    )
  }

  /**
   * Given a Point return its bucket ID
   */
  public idForPoint(point: PointLike): number {
    return SpatialManager.idForPoint(point, this.cellSizeInv, this.numCols)
  }

  /**
   * Given a geometry return the objects nearby
   */
  public static getNearby<U>(
    ids: Set<number>,
    buckets: Map<number, Set<U>>
  ): Set<U> {
    const nearby: Set<U> = new Set()

    for (let id of ids) {
      let bucket = buckets.get(id)
      /* istanbul ignore else */
      if (bucket) {
        for (let obj of bucket) {
          nearby.add(obj)
        }
      }
    }
    return nearby
  }

  /**
   * Given a geometry return the objects nearby
   */
  public getNearby(geo: Geometry): Set<T> {
    return SpatialManager.getNearby(
      SpatialManager.getIdsForGeometry(
        geo.pos,
        geo.aabb.min,
        geo.aabb.max,
        this.cellSize,
        this.numCols,
        this.numBuckets
      ),
      this.buckets
    )
  }
}
