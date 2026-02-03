import IPlistReader from "../../src/PlistReader/IPlistReader"

export default class MockPlistReader implements IPlistReader {
  private readonly values: Map<string, string>

  constructor(values: Record<string, string> = {}) {
    this.values = new Map(Object.entries(values))
  }

  async getValue(filePath: string, key: string): Promise<string | null> {
    return this.values.get(`${filePath}:${key}`) ?? null
  }
}
