// TODO: refactor tree and create gui... aim to just have sketch stuff

import p5 from 'p5'
import createGui from './gui'
import { createSketch, forceUpdate, insertUser } from './sketch'
import { BranchTemplate } from './types'
import * as Comlink from 'comlink'

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

const create = () => {
  const gui = createGui(options)
  const sketch = createSketch(gui)

  // Setup comlink
  if (window.location !== window.parent.location){
    const createExposedOptions = (options: any, onUpdate: any) => {
      type ValueOf<T> = T[keyof T];

      const getOptions = () => {
        return options
      }

      const updateOption = (option: keyof typeof options, value: ValueOf<typeof options>) => {
        if(options[option] !== undefined){
          options[option] = value
          onUpdate()
        }
      }

      const injectUserInfo = (user: any) => {
        // console.log("from iframe", user.name)
        insertUser(user.name)
      }

      return {
        getOptions,
        updateOption,
        injectUserInfo
      }
    }

    const exposedOptions = createExposedOptions(options, forceUpdate)
    Comlink.expose(exposedOptions, Comlink.windowEndpoint(window.parent))
    // update gui on change
    gui.listen()
  }

  return {
    gui,
    sketch
  }
}



export default create
