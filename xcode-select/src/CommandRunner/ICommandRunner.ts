export default interface ICommandRunner {
  run(cmd: string): Promise<string>
}