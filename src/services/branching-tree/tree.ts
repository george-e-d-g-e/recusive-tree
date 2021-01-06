import p5 from 'p5'
import branch from './branch'
import {BranchTemplate, Branch} from './types'

// Draw List
const createDrawList = () => {
  let list: Array<Function>
  let cycle = 0
  const getItems = () => {
    return list
  }
  const add = (f: Function) => {
    list.push(f)
  }
  const reset = () => {
    list = []
    cycle = 0
  }
  const animate = () => {
    if(cycle >= list.length-50) return
    for (let i = 0; i < 50; i++) { 
      list[cycle]()
      cycle++
    }
    
  }
  
  return {
    add,
    reset,
    animate,
    getItems
  }
}

const createTree = (template: BranchTemplate, p: p5) => {

  const branches = branch(template)

  const drawList = createDrawList()
  
  const getBranchWidth = (b: Branch): number => b.vector.mag() * 0.06
  
  const getBranchNormal = (b: Branch): p5.Vector => b.vector.copy().rotate(p.radians(90)).normalize()

  const getBranchVerts = (b: Branch): Array<p5.Vector> => {

    const normal = getBranchNormal(b).mult(getBranchWidth(b))

    return [
      normal.copy().mult(-1),
      normal,
      b.vector.copy().add(normal.copy().mult(0.6)),
      b.vector.copy().add(normal.copy().mult(-0.6)),
    ]
  }

  const shadeBranch = (b: Branch, light?: p5.Vector) => {

    const lightPos = new p5.Vector()
    
    // set light pos
    light ?  lightPos.set(light) : lightPos.set(-p.windowWidth * 0.25,-p.windowHeight)

    const normal = getBranchNormal(b).mult(getBranchWidth(b))

    // calc which side shadow should be
    const lightRay = p5.Vector.sub(b.position, lightPos)
    const direction = normal.angleBetween( lightRay.copy().rotate(p.radians(-90)) )

    // light rays
    // p.push()
    //   p.translate(lightPos)
    //   p.line(0, 0, lightRay.x, lightRay.y)
    // p.pop()

    const calcVerts = (d: number) => {
      if(direction < 0){
        // shade left
        return [
          new p5.Vector(),
          normal,
          b.vector.copy().add(normal.copy().mult(0.6)),
          b.vector.copy(),
        ]
        
      } else {
        // shade right
        return [
          new p5.Vector(),
          normal.copy().mult(-1),
          b.vector.copy().add(normal.copy().mult(-0.6)),
          b.vector.copy(),
        ]
      }
    }

    const verts = calcVerts(direction)

   
    p.fill(150)
    p.push()
      p.translate(b.position)
      p.noStroke()
      p.beginShape()
      verts.forEach( vert => {
        p.vertex(vert.x, vert.y)
      })
      p.endShape(p.CLOSE)
    //p.line(0,0, normal.x, normal.y)
    p.pop()
    
  } 

  const renderBranch = (b: Branch) => {
    const verts = getBranchVerts(b)
    
    p.push()
      p.translate(b.position)

      // oultine
      p.stroke(20)
      p.strokeWeight(p.min(getBranchWidth(b)*0.5, 2.5))
      p.line(verts[0].x, verts[0].y, verts[3].x, verts[3].y)
      p.line(verts[1].x, verts[1].y, verts[2].x, verts[2].y)

      // branch body
      p.fill(230)
      p.noStroke()
      p.beginShape()
      verts.forEach( vert => {
        p.vertex(vert.x, vert.y)
      })
      p.endShape(p.CLOSE)
   
    p.pop()
  }



  const renderLeaf = (b: Branch, emitter?: p5.Vector) => {
    const leafSize = 1 + Math.random()*3
    // TODO: add leaf randomness
    const direction = b.vector.heading() + p.radians(90 + ((Math.random() * 2) - 1))
    const randomPos = new p5.Vector().set((Math.random() * 40) - 20, (Math.random() * 40) - 20)
    // const randomPos = new p5.Vector()
    const position = emitter? emitter.copy().add(randomPos) : new p5.Vector()

   
    p.fill( 20 + (Math.random() * 25), 200)
    p.push()
    
      p.translate(b.position)
      p.push()
        p.translate(position.x, position.y)
        p.rotate(direction)
       
        p.noStroke()
        p.ellipse(0,0, leafSize, leafSize * 3)
        p.stroke(120,100)
        p.strokeWeight(0.5)
        p.line(0, -leafSize, 0, leafSize)
      p.pop()
    p.pop()
  }

  const renderLeafs = (b: Branch) => {
    const emitter = new p5.Vector()
    const length = b.vector.mag()
    const spacing = 0.5
    for (let i = 0; i < 1; i+= spacing) {
      const e = emitter.copy().lerp(b.vector, i)
      renderLeaf(b, e)
    }
  }

  const display = (b: Branch, light?: p5.Vector) => {

    if(b === undefined) return  

    renderBranch(b)
    shadeBranch(b, light)

    if(b.vector.mag() < 60)
      drawList.add(() => { renderLeafs(b) })

    // recusivly display other branches
    if (b.getAttachedBranches().length){
      b.getAttachedBranches().forEach( (attachedBranch: Branch) => {
        display(attachedBranch, light)
      })
    } else {
      drawList.add(() => { renderLeaf(b) })
    }
    
  }

  const displaySkeleton = (b: Branch) => {

    // display skeleton
    p.stroke(50)
    p.push()
      p.translate(b.position)
      p.line(0, 0, b.vector.x, b.vector.y)
    p.pop()
     // recusivly display other branches
     if (b.attachedBranches.length){
      for (let i = 0; i < b.attachedBranches.length; i++) {
        displaySkeleton(b.attachedBranches[i])
      }
    }
  }

  

  return {
    branches,
    display,
    displaySkeleton,
    drawList
  }
}

export default createTree