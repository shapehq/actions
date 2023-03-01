import ArgumentParser
import Foundation

@main
struct Slacker: AsyncParsableCommand {
    @Argument(help: "Slack channel")
    var slackChannel: String
    
    @Argument(help: "Message")
    var message: String
    
    @Argument(help: "Workflow")
    var workflow: String
    
    @Argument(help: "Runner")
    var runner: String
    
    @Argument(help: "GitHub ref name")
    var refName: String
    
    @Argument(help: "GitHub ref type")
    var refType: String

    @Argument(help: "Started by")
    var startedBy: String
    
    @Argument(help: "Job URL")
    var jobUrl: String
    
    @Argument(help: "Slack Access Token")
    var slackAccessToken: String
    
    func run() async throws {
        // Prepare request
        var urlRequest = URLRequest(url: URL(string: "https://slack.com/api/chat.postMessage")!)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(slackAccessToken)", forHTTPHeaderField: "Authorization")
        
        // Prepare body
        let slackRequest = SlackMessage(
            channel: slackChannel,
            blocks: [
                .sectionText(text: SlackText(type: .markdown, text: message)),
                .sectionFields(fields: [
                    SlackText(type: .markdown, text: "*Workflow:*\n\(workflow)"),
                    SlackText(type: .markdown, text: "*Runner:*\n\(runner)"),
                    SlackText(type: .markdown, text: "*\(refType.capitalized):*\n\(refName)"),
                    SlackText(type: .markdown, text: "*Started by:*\n\(startedBy)"),
                ]),
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
        
        do {
            let (_, response) = try await URLSession.shared.data(for: urlRequest)
            if let httpResponse = response as? HTTPURLResponse {
                print("HTTP Status: \(httpResponse.statusCode)")
            } else {
                print("Request succeeded? Unknown response")
            }
        } catch {
            print("Request failed: \(error)")
        }
    }
}

struct SlackMessage: Encodable {
    let channel: String
    let blocks: [SlackBlock]
}

enum SlackBlock {
    case sectionText(text: SlackText)
    case sectionFields(fields: [SlackText])
    case actions(actions: [SlackAction])
}

extension SlackBlock: Encodable {
    enum CodingKeys: CodingKey {
        case type
        case text
        case fields
        case elements
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .sectionText(let text):
            try container.encode("section", forKey: .type)
            try container.encode(text, forKey: .text)
        case .sectionFields(let fields):
            try container.encode("section", forKey: .type)
            try container.encode(fields, forKey: .fields)
        case .actions(let actions):
            try container.encode("actions", forKey: .type)
            try container.encode(actions, forKey: .elements)
        }
    }
}

struct SlackText: Encodable {
    enum TextType: String, Encodable {
        case plain = "plain_text"
        case markdown = "mrkdwn"
    }
    
    let type: TextType
    let text: String
}

struct SlackAction: Encodable {
    enum ActionType: String, Encodable {
        case button
    }
    
    struct ActionText: Encodable {
        enum TextType: String, Encodable {
            case plain = "plain_text"
            case markdown = "mrkdwn"
        }
        
        let type: TextType
        let text: String
        let emoji: Bool
    }
    
    let type: ActionType
    let text: ActionText
    let value: String
    let url: String
    let actionId: String
    
    enum CodingKeys: String, CodingKey {
        case type
        case text
        case value
        case url
        case actionId = "action_id"
    }
}
