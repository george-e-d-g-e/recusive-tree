// TODO: refactor tree and create gui... aim to just have sketch stuff

import p5 from 'p5'
import createGui from './gui'
import { createSketch, forceUpdate } from './sketch'
import { BranchTemplate } from './types'

import { createComsForArtwork } from '../artworkComs'

console.log("V2 artwork")
const options: BranchTemplate = {
  length: 350,
  position: new p5.Vector(),
  angle: 0,
  splitAngle: 33,
  splitFactor: 1,
  scaleFactor: 0.65,
  lengthVariety: 0.23,
  angleVariety: 0.64,
  maxBranchDepth: 9,
  currentDepth: 0,
  seed: '0',
  iteration: 0,
}

const createController = (
    value: string | number,
    min?: number,
    max?: number,
    step?: number,
    label?: string,
  ) => ({ min, max, step, label, value})

const controllers = {
  length: createController(options.length, 100, 400, undefined, 'length'),
  splitAngle: createController(options.splitAngle, 0, 120, undefined, 'split angle'),
  scaleFactor:  createController(options.scaleFactor, 0.5, 0.8, undefined, 'scale factor', ),
  lengthVariety:  createController(options.lengthVariety, -1, 1, undefined, 'length variety'),
  angleVariety:  createController(options.angleVariety, -2, 2, undefined,'angle variety'),
  maxBranchDepth:  createController(options.maxBranchDepth, 2, 10, 1, 'max branch depth'),
  seed: createController(options.seed)
}

const create = () => {
  const gui = createGui(options)
  const sketch = createSketch(gui)

  // Setup comlink
  if (window.location !== window.parent.location){
    const coms = createComsForArtwork()
    
    coms.onSave(() => options)
    coms.onLoad((save: BranchTemplate) => {
      
      // HACK: casting options as any
      const O = options as any

      // HACK: force position to be a PVector
      save.position = new p5.Vector().set(save.position.x, save.position.y)

      for(const [key, value] of Object.entries(save)){
        O[key] = value
      }
      // update the tree
      if(forceUpdate) forceUpdate()
    })
    coms.onControllerUpdate(<K extends keyof BranchTemplate>(controller: {property: K; value: NonNullable<BranchTemplate[K]>}) => {
      const { property, value } = controller
      options[property] = value
      // update the tree
      if(forceUpdate) forceUpdate()
    })
    coms.start()

    // gui.listen()
    // HACK: just trigger after 3secs for now
    coms.setControllers(controllers)
    // setTimeout(() => coms.setControllers(controllers), 3000)
    // update gui on change
    
  }

  return {
    gui,
    sketch
  }
}



export default create
