import {CompositionRoot} from "./CompositionRoot"
import {getOptions} from "./getOptions"

const action = CompositionRoot.getAction()
const logger = CompositionRoot.getLogger()
action.run(getOptions()).catch(err => {
  logger.error(err)
})
