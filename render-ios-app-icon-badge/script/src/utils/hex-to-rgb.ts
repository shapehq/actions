export default function (hex: string): { r: number, g: number, b: number } {
  const comps = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (comps && comps.length == 4) {
    return {
      r: parseInt(comps[1], 16),
      g: parseInt(comps[2], 16),
      b: parseInt(comps[3], 16)
    }
  } else {
    throw new Error(`${hex} is not a valid hex color. It may optionally begin with # and must be exactly six characters.`)
  }
}
