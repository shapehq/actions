export const SemanticVersionTemplatePlaceholder = "x"

export type SemanticVersionTemplateMajor = number
export type SemanticVersionTemplateMinor = number | "x"
export type SemanticVersionTemplatePatch = number | "x"

export class SemanticVersionTemplate {
  private _major: SemanticVersionTemplateMajor
  private _minor: SemanticVersionTemplateMinor
  private _patch: SemanticVersionTemplatePatch
  
  constructor(
    major: SemanticVersionTemplateMajor, 
    minor: SemanticVersionTemplateMinor, 
    patch: SemanticVersionTemplatePatch
  ) {
    this._major = major
    this._minor = minor
    this._patch = patch
  }
  
  get major(): SemanticVersionTemplateMajor {
    return this._major
  }
  
  get minor(): SemanticVersionTemplateMinor {
    return this._minor
  }
  
  get patch(): SemanticVersionTemplatePatch {
    return this._patch
  }
  
  get displayString(): string {
    let str = this.major + "." + this.minor
    if (this.patch != null) {
      str += "." + this.patch
    }
    return str
  }
}
