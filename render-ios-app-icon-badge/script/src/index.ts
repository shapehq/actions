import * as core from "@actions/core"
import Action from "./Action"
// import { getOptions } from "./get-options"

const action = new Action({ logger: core })
// action.run(getOptions()).catch(err => {
//   core.setFailed(err.toString())
// })

action.run({
  searchDir: "/Users/simonbs/Developer/allerplay-ios",
  style: "beta"
}).catch(err => {
  core.setFailed(err.toString())
})
