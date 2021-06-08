export const createComsForPlatform = (targetRef: any, targetOrigin: any) => {
  // TODO: get target origin from metadata
  const save = () => {
    targetRef.postMessage({
      type: 'save'
    }, targetOrigin)
  }
  const load = (load: any) => {
    targetRef.postMessage({
      type: 'load',
      load
    }, targetOrigin)
  }
  const controllerUpdate = ({property, value}: {property: string; value: string | number}) => {
    targetRef.postMessage({
      type: 'updateController',
      property,
      value
    }, targetOrigin)
  }
  let setControllersHandler = (data: any) => console.log('no set controller handler set')
  let getSaveHandler = (data: any) => console.log('no get save handler set')
  const onSetControllers = (handler: any) => setControllersHandler = handler
  const onGetSave = (handler: any) => getSaveHandler = handler


  const start = () => {
    if(!targetRef)
      return

    window.addEventListener('message', (event) => {
      if(event.origin !== targetOrigin)
        return

      if(!event.data.type)
        return

      switch(event.data.type){
        case 'controllers':
          setControllersHandler(event.data.controllers)
          break
        case 'save':
          getSaveHandler(event.data.save)
          break
      }
    }, false)
  }

  return {
    start,
    controllerUpdate,
    onSetControllers,
    onGetSave,
    save,
    load,
  }
}

export const createComsForArtwork = () => {

  const targetWindow = window.parent
  const targetOrigin = (location.hostname === 'localhost') ? 'http://localhost:8080' : 'https://olta.art'

  let saveHandler = (data: any) => console.log('no save handler set', data)
  let loadHandler =  (data: any) => console.log('no load handler set', data)
  let controllerUpdateHandler =  (data: any) => console.log('no controller update handler set', data)

  const onSave = (handler: any) => saveHandler = handler
  const onLoad = (handler: any) => loadHandler = handler
  const onControllerUpdate = (handler: any) => controllerUpdateHandler = handler

  let controllers: any = null
  const setControllers = (newControllers: any) => controllers = newControllers

  const start = () => {
    if(!window.parent)
      return

    window.addEventListener('message', (event) => {
      if(event.origin !== targetOrigin)
        return

      if(!event.data.type)
        return

      switch(event.data.type) {
        case 'load':
          loadHandler(event.data.load)
          break
        case 'controllerUpdate':
          controllerUpdateHandler(event.data)
          break
        case 'controllers':
          targetWindow.postMessage({
            type: 'controllers',
            controllers
          }, targetOrigin)
          break
        case 'save':
          // postMessage with save
          targetWindow.postMessage({
            type: 'save',
            save: saveHandler(event.data)
          }, targetOrigin)
          break
      }
    }, false)
  }

  return {
    onSave,
    onLoad,
    onControllerUpdate,
    setControllers,
    start
  }

}