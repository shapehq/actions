import SemanticVersionTemplate from "./SemanticVersionTemplate"

export default interface SemanticVersionTemplateParser {
  parse(string: string): SemanticVersionTemplate
}
