import ArgumentParser
import Foundation

@main
struct Slacker: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var message: String
    @Option var jobUrl: String
    
    @Option(parsing: .upToNextOption)
    var fields: [Field] = []
    
    func run() async throws {
        // Validate parameters
        guard !channel.isEmpty else {
            Slacker.exit(withError: ValidationError("💥 You must specify a Slack channel"))
        }
        guard !token.isEmpty else {
            Slacker.exit(withError: ValidationError("💥 You must specify a Slack access token"))
        }
        guard !message.isEmpty else {
            Slacker.exit(withError: ValidationError("💥 You must specify a message to display in Slack"))
        }
        guard !jobUrl.isEmpty else {
            Slacker.exit(withError: ValidationError("💥 You must specify the GitHub Actions job url"))
        }
        
        // Prepare request
        var urlRequest = URLRequest(url: URL(string: "https://slack.com/api/chat.postMessage")!)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        // Prepare body
        let slackRequest = SlackMessage(
            channel: channel,
            blocks: [
                .sectionText(text: SlackText(type: .markdown, text: message)),
                .sectionFields(fields: fields.map { SlackText(field: $0) }),
                .actions(actions: [
                    SlackAction(
                        type: .button,
                        text: SlackAction.ActionText(
                            type: .plain,
                            text: "View Logs",
                            emoji: true
                        ),
                        value: "view_logs",
                        url: jobUrl,
                        actionId: "view_logs"
                    )
                ])
            ]
        )
        urlRequest.httpBody = try JSONEncoder().encode(slackRequest)
        
        // Fire request and print result
        do {
            let (data, response) = try await URLSession.shared.data(for: urlRequest)
            do {
                let slackResponse = try JSONDecoder().decode(SlackAPIResponse.self, from: data)
                switch slackResponse {
                case .success:
                    print("🟢 [\(response.httpStatusCode)] Succesfully sent Slack message")
                case .failure(let errorMessage):
                    print("🔴 [\(response.httpStatusCode)] Failed to sent Slack message with error: \(errorMessage)")
                }
            } catch {
                print("⁉️ [\(response.httpStatusCode)] Failed to deserialize Slack response with error: \(error)")
            }
        } catch {
            print("💥 Request failed: \(error)")
        }
    }
}
