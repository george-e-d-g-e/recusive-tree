import * as dat from 'dat.gui'
import { BranchTemplate } from './types'
// TODO: types
const createGui = (branchTemplate: BranchTemplate ): any => {
  const gui = new dat.GUI()

  const controllers = [
    gui.add(branchTemplate, 'length', 100, 400),
    gui.add(branchTemplate, 'splitAngle', 0, 180),
    gui.add(branchTemplate, 'splitFactor', 0, 5, 1),
    gui.add(branchTemplate, 'scaleFactor', 0.1, 0.8),
    gui.add(branchTemplate, 'lengthVariety', -1, 1),
    gui.add(branchTemplate, 'angleVariety', -2, 2),
    gui.add(branchTemplate, 'maxBranchDepth', 2, 10, 1),
    gui.add(branchTemplate, 'seed')
  ]

  const control: any = {}
  controllers.forEach( c => {
    control[c.property] = c
  })

  const listen = () => {
    controllers.forEach( c => {
      c.listen()
    })
  }

  const onChange = ( onChangeHandler: Function) => {
    controllers.forEach( controller => {
      controller.onChange( () => {
        onChangeHandler()
      })
    })
  }

  const getBranchTemplate = () => branchTemplate
        
  const remove = () => { gui.destroy() }
  
  return {
    gui,
    controllers,
    control,
    onChange,
    getBranchTemplate,
    remove,
    listen,
  }
}

export default createGui