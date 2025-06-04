export default interface CommandRunner {
  run(cmd: string): Promise<string>
}