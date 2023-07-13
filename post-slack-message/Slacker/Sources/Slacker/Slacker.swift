import ArgumentParser
import Foundation
import SlackerCore

@main
struct Slacker: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var message: String
    @Option var jobUrl: String
    
    @Option(parsing: .upToNextOption)
    var fields: [Field] = []
    
    func run() async throws {
        let slacker = SlackerCore.Slacker(channel: channel, token: token, message: message, fields: fields.map { $0.field }, action: .viewJob(jobUrl: jobUrl))
        do {
            try slacker.execute()
        } catch let error as SlackerError {
            switch error {
            case .missingChannel:
                Slacker.exit(withError: ValidationError("💥 You must specify a Slack channel"))
            case .missingToken:
                Slacker.exit(withError: ValidationError("💥 You must specify a Slack access token"))
            case .missingMessage:
                Slacker.exit(withError: ValidationError("💥 You must specify a message to display in Slack"))
            case .missingJobUrl:
                Slacker.exit(withError: ValidationError("💥 You must specify the GitHub Actions job url"))
            }
        } catch {
            Slacker.exit(withError: error)
        }
    }
}
