export default interface ICommandRunner {
  run(cmd: string | string[]): Promise<string>
}
