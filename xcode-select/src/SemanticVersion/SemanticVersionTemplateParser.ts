import {SemanticVersionTemplate} from "./SemanticVersionTemplate"

export interface SemanticVersionTemplateParser {
  parse(string: string): SemanticVersionTemplate
}
