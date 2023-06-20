export interface CommandRunner {
  run(cmd: string): Promise<string>
}