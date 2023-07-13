//
//  Slacker.swift
//
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

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
    
    public func execute(completionHandler: @escaping ((SlackerError) -> Void)) {
        // Validate parameters
        guard !channel.isEmpty else {
            completionHandler(SlackerError.missingChannel)
            return
        }
        guard !token.isEmpty else {
            completionHandler(SlackerError.missingToken)
            return
        }
        guard !message.isEmpty else {
            completionHandler(SlackerError.missingMessage)
            return
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
            case .custom(let id, let name, let url):
                blocks.append(.actions(actions: [
                    SlackAction(
                        type: .button,
                        text: SlackAction.ActionText(
                            type: .plain,
                            text: name,
                            emoji: true
                        ),
                        value: id,
                        url: url,
                        actionId: id
                    )
                ]))
            }
        }
        
        // Request
        let slackRequest = SlackMessage(channel: channel, blocks: blocks)
        urlRequest.httpBody = try! JSONEncoder().encode(slackRequest)
        
        // Uses semaphore to halt execution until request has finished to ensure command line tool doesn't finish instantly.
        let semaphore = DispatchSemaphore(value: 0)
        
        // Fire request and print result
        let task = URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            if let error {
                let error = SlackAPIError(message: "💥 Request failed: \(error)")
                completionHandler(SlackerError.apiError(error: error))
            } else if let data, let response {
                do {
                    let slackResponse = try JSONDecoder().decode(SlackAPIResponse.self, from: data)
                    switch slackResponse {
                    case .success:
                        print("🟢 [\(response.httpStatusCode)] Succesfully sent Slack message")
                    case .failure(let errorMessage):
                        let error = SlackAPIError(message: "🔴 [\(response.httpStatusCode)] Failed to sent Slack message with error: \(errorMessage)")
                        completionHandler(SlackerError.apiError(error: error))
                    }
                } catch {
                    let error = SlackAPIError(message: "⁉️ [\(response.httpStatusCode)] Failed to deserialize Slack response with error: \(error)")
                    completionHandler(SlackerError.apiError(error: error))
                }
            } else {
                let error = SlackAPIError(message: "💥 Request failed with unknown error 🫠")
                completionHandler(SlackerError.apiError(error: error))
            }
            
            // Signal request completed to continue
            semaphore.signal()
        }
        
        // Resumes the request
        task.resume()
        
        // Halts execution until semaphore receives signal that we are done
        semaphore.wait()
    }
}
