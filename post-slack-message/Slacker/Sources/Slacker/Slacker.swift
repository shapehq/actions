import ArgumentParser
import Foundation

@main
struct Slacker: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var message: String
    @Option var jobUrl: String
    
    @Option(parsing: .upToNextOption)
    var fields: [Field]
    
    func run() async throws {      
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

// MARK: Arguments

struct Field: ExpressibleByArgument {
    let title: String
    let value: String

    init?(argument: String) {
        let components = argument.split(separator: ":")
        assert(components.count == 2, "A SlackField must be composed of a title and a value separated by a colon. Example: 'Branch:main'")
        title = String(components[0])
        value = String(components[1])
    }
}

// MARK: Slack API Models

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

extension SlackText {
    init(field: Field) {
        type = .markdown
        text = "*\(field.title)*:\n\(field.value)"
    }
}
