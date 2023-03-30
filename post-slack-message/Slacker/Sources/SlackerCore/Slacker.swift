//
//  Slacker.swift
//
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation

public struct Slacker {
    let channel: String
    let token: String
    let message: String
    let fields: [Field]
    let action: Action?
    
    public init(channel: String, token: String, message: String, fields: [Field] = [], action: Action? = nil) {
        self.channel = channel
        self.token = token
        self.message = message
        self.fields = fields
        self.action = action
    }
    
    public func execute() async throws {
        // Validate parameters
        guard !channel.isEmpty else {
            throw SlackerError.missingChannel            
        }
        guard !token.isEmpty else {
            throw SlackerError.missingToken
        }
        guard !message.isEmpty else {
            throw SlackerError.missingMessage
        }
        
        // Prepare request
        var urlRequest = URLRequest(url: URL(string: "https://slack.com/api/chat.postMessage")!)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        // Prepare blocks
        var blocks: [SlackBlock] = [
            .sectionText(text: SlackText(type: .markdown, text: message)),
        ]
        
        if !fields.isEmpty {
            blocks.append(.sectionFields(fields: fields.map { SlackText(field: $0) }))
        }
        
        if let action {
            switch action {
            case .viewJob(let jobUrl):
                blocks.append(.actions(actions: [
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
                ]))
            }
        }
        
        // Request
        let slackRequest = SlackMessage(channel: channel, blocks: blocks)
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
