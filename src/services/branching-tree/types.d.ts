import p5 from "p5"

interface Variation {
  getScaler: Function,
  getValue: Function,
  update: Function,
}

interface BranchTemplate {
  length: number,
  position: p5.Vector,
  angle: number,
  splitAngle: number,
  splitFactor: number,
  scaleFactor: number,
  lengthVariety: number,
  angleVariety: number,
  maxBranchDepth: number,
  currentDepth: number,
  // TODO:make number
  seed: string, 
  iteration: number

}

interface Branch {
  position: p5.Vector,
  vector: p5.Vector,
  attachedBranches: Array<Branch>,
  getAttachedBranches: Function,
  length: number,
  angleVariation: Variation,
  lengthVariation: Variation,
  update: Function
}



export {
  BranchTemplate,
  Branch,
  Variation,
}