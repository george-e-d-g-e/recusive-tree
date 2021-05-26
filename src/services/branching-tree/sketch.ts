import p5 from 'p5'
import branch from './branch'
import createTree from './tree'

// allow external updates
type Update = {
  (): void;
}
let forceUpdate: undefined | Update = undefined
let insertUser: any = undefined

const createSketch = (gui: any): p5 => {

  const sketch = (p: p5) => {

    const background = p.color(190)
    const lightPos = new p5.Vector().set(-p.windowWidth, -p.windowHeight)
    const tree = createTree(gui.getBranchTemplate(), p)

    const render = () => {
      tree.drawList.reset()
      p.background(background)
      p.push()
        p.translate(p.width / 2, p.height - 10)

        tree.display(tree.branches, lightPos)
        // tree.displaySkeleton(tree.branches)
        // console.log(tree.drawList.getItems())
        
        // display light
        p.noStroke()
        p.fill(255)
        p.ellipse(lightPos.x, lightPos.y, 10,10)
      p.pop()
    }

    const updateSeed = () => {
      const num = Math.random() * 150
      const newSeed = num.toFixed().toString()

      gui.getBranchTemplate().seed = newSeed
      gui.control['seed'].setValue(newSeed)
    }

    const generateNewTree = () => {
      tree.branches = branch(gui.getBranchTemplate())
      render()
    }

    const updateTree = () => {
      tree.branches.update(gui.getBranchTemplate())
      generateNewTree()
      render()
    }

    // forceUpdate
    forceUpdate = () => { updateTree() }

    let userAccount: any = null
    insertUser = (account: any) => {
      userAccount = account
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)

      // on change
      gui.onChange(updateTree)
      gui.control['seed'].onChange( generateNewTree )
      gui.control['splitFactor'].onChange( generateNewTree )

      // custom gui
      gui.gui.add({ updateSeed }, 'updateSeed')
        .name("Generate")

      // environment gui  
      const environment = gui.gui.addFolder('Environment')
      environment.add(lightPos, 'x', -p.windowWidth, p.windowWidth).name('lightX').onChange(updateTree)
      environment.add(lightPos, 'y', -p.windowHeight, p.windowHeight).name('lightY').onChange(updateTree)

      generateNewTree()
    }

    p.draw = () => {
      // p.text("user: " + userAccount, 10, 10)
      p.push()
        p.translate(p.width / 2, p.height - 10)
        tree.drawList.animate()
      p.pop()
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      generateNewTree()
    }
  }

  return new p5(sketch)
}

export { createSketch, forceUpdate, insertUser }