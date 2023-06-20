import {CompositionRoot} from "./CompositionRoot"
import {getOptions} from "./getOptions"

const action = CompositionRoot.getAction()
action.run(getOptions()).catch(err => {
  console.log(err)
})
