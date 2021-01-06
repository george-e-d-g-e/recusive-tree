import p5, { Vector } from "p5";
import seedRandom from 'seedrandom';
import { Branch, BranchTemplate, Variation } from './types';

const radians = ( degrees: number ): number => {
  return degrees * (Math.PI / 180)
}

const getSplittingBranchAngle = ({splitAngle, splitFactor}: BranchTemplate, branchNum: number): number => {
  const angle = radians(splitAngle / splitFactor)
  return (angle * (branchNum - (splitFactor / 2)))
}

const createVariation = (num?: number, seed?: number ): Variation => {
  const scaler = seed ? seed : Math.random()
  const scaleValue = (input: number) => (scaler * input) - (input * 0.5)
  let value = num ? scaleValue(num) : 0 
  
  return {
    getValue: () => value,
    getScaler: () => scaler,
    update: (num: number) => { value = scaleValue(num) },
  }
}

const splitBranch = (b: BranchTemplate, createBranch: Function): Array<Branch> => {
  
  // don't split if max depth reached
  if(b.maxBranchDepth <= 0) return []

  const attachedBranches = []
  for (let i = 0; i <= b.splitFactor; i++) {

    // calc branch angle 
    const branchAngle = getSplittingBranchAngle(b, i)

    // clone template branch and assign new angle
    const splitBranchTemplate = {...b}
    splitBranchTemplate.angle += branchAngle
    splitBranchTemplate.iteration += i + 1 // note:(George) number of recursions helps keep seed predictabe
    
    // recursivly add branch
    const newBranch = createBranch(splitBranchTemplate) 
    attachedBranches.push(newBranch)      
  }
  return attachedBranches
}

const calcMaxBranchDepth = (maxBranchDepth: number) => maxBranchDepth - 1 
const calcLength = (b: BranchTemplate, lengthVariation: Variation) => b.length * (b.scaleFactor + lengthVariation.getValue())
const calcAngle = (angle: number, angleVariation: Variation) => angle + angleVariation.getValue()
const calcPosition = (position: p5.Vector) => position.copy()
const calcVector = (angle: number, length: number) => new Vector().set(0, -length).rotate(angle)

const updateTemplateValues = (template: BranchTemplate, updates: Record<string,any>): BranchTemplate => ({...template, ...updates}) 

const createBranch = (template: BranchTemplate): Branch => {

  // seed number
  const seed = seedRandom( template.seed + template.iteration.toString() )

  // variations
  const angleVariation = template.currentDepth ? createVariation(template.angleVariety, seed()) : createVariation(0, seed())
  const lengthVariation = createVariation(template.lengthVariety, seed())

  let maxBranchDepth = calcMaxBranchDepth(template.maxBranchDepth)

  // positions
  let length = calcLength(template, lengthVariation)
  let angle = calcAngle(template.angle, angleVariation)
  const position = calcPosition(template.position)
  const vector = calcVector(angle, length)

  // clone and update template
  const updateTemplate = (template: BranchTemplate) => {
    return updateTemplateValues(template, {
      length,
      angle,
      position: Vector.add(position, vector),
      maxBranchDepth,
      currentDepth: template.currentDepth + 1,
      seed: seed().toString()
    })
  }

  let updatedTemplate = updateTemplate(template)

  // recersivly add branches
  let attachedBranches = [...splitBranch(updatedTemplate, createBranch)]

  const getAttachedBranches = (): Array<Branch> => attachedBranches

  const update = (template: BranchTemplate) => {

    maxBranchDepth = calcMaxBranchDepth(template.maxBranchDepth)
    // update variations
    angleVariation.update(template.currentDepth ? template.angleVariety : 0)
    lengthVariation.update(template.lengthVariety)

    // update positions
    length = calcLength(template, lengthVariation)
    angle = calcAngle(template.angle, angleVariation)
    position.set(calcPosition(template.position))
    vector.set(calcVector(angle, length))

    // update template
    updatedTemplate = updateTemplate(template)
    updatedTemplate.currentDepth += 1

    // Update attached branches
    if (updatedTemplate.maxBranchDepth <= 0) {
      attachedBranches = []
      return
    }

    if (attachedBranches.length === template.splitFactor + 1){

      // update existing branches
      for (let i = 0; i < attachedBranches.length; i++) {
        const branch = attachedBranches[i]

        const splitAngle = getSplittingBranchAngle(updatedTemplate, i)
        const splitTemplate = {...updatedTemplate}
        splitTemplate.angle += splitAngle

        // recursivly update
        branch.update(splitTemplate)
      }

    } else {

      // create new ones
      attachedBranches = [...splitBranch(updatedTemplate, createBranch)]

    }
    
  }

  return {
    position, 
    vector,
    attachedBranches,
    length,
    lengthVariation,
    angleVariation,
    update,
    getAttachedBranches
  }
  
}

export default createBranch