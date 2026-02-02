import SemanticVersionTemplate, {
  SemanticVersionTemplatePlaceholder,
  SemanticVersionTemplateMinor,
  SemanticVersionTemplatePatch
} from "./SemanticVersionTemplate.js"
import ISemanticVersionTemplateParser from "./ISemanticVersionTemplateParser.js"

export default class SemanticVersionTemplateParser implements ISemanticVersionTemplateParser {
  parse(string: string): SemanticVersionTemplate {
    const components = string.split(".")
    if (components.length !== 3) {
      throw new Error("Version template must contain major, minor, and patch values, e.g. 14.3.1, 14.3.x, or 14.x.x.")
    }
    const major = parseInt(components[0])
    if (isNaN(major)) {
      throw new Error("Version template contains invalid major \"" + components[0] + "\". The major must be an integer.")
    }
    const rawMinor = components[1]
    let minor: SemanticVersionTemplateMinor
    if (rawMinor.toLowerCase() === SemanticVersionTemplatePlaceholder.toLowerCase()) {
      minor = SemanticVersionTemplatePlaceholder
    } else {
      minor = parseInt(rawMinor)
      if (isNaN(minor)) {
        throw new Error("Version template contains invalid minor \"" + components[1] + "\". The minor must be an integer or a placeholder (\"" + SemanticVersionTemplatePlaceholder + "\")")
      }
    }
    let patch: SemanticVersionTemplatePatch = 0
    let rawPatch = components[2]
    if (rawPatch.toLowerCase() === SemanticVersionTemplatePlaceholder.toLowerCase()) {
      patch = SemanticVersionTemplatePlaceholder
    } else {
      patch = parseInt(rawPatch)
      if (isNaN(patch)) {
        throw new Error("Version template contains invalid patch \"" + components[1] + "\". The patch must be an integer, a placeholder (\"" + SemanticVersionTemplatePlaceholder + "\"), or absent.")
      }
    }
    if (minor === SemanticVersionTemplatePlaceholder && patch !== SemanticVersionTemplatePlaceholder) {
      throw new Error("Version template \"" + string + "\" is invalid. Cannot use a placeholder for the minor value without specifying a placeholder for the patch.")
    }
    return new SemanticVersionTemplate(major, minor, patch)
  }
}