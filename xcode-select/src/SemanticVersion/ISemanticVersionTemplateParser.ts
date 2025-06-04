import SemanticVersionTemplate from "./SemanticVersionTemplate"

export default interface ISemanticVersionTemplateParser {
  parse(string: string): SemanticVersionTemplate
}
