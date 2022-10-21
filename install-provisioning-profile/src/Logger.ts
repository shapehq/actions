export interface LogDestination {
  info(message: string)
}

export class Logger {
  destination: LogDestination
  
  constructor(destination: LogDestination) {
    this.destination = destination
  }
  
  info(message: string) {
    this.destination.info(message)
  }
}