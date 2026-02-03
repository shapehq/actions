import SemanticVersionTemplate from "./SemanticVersionTemplate.js"

export default interface ISemanticVersionTemplateParser {
  parse(string: string): SemanticVersionTemplate
}
