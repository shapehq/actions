//
//  SlackerCLI.swift
//  
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import ArgumentParser
import Foundation
import SlackerCore

@main
struct SlackerCLI: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var message: String
    @Option var jobUrl: String
    
    @Option(parsing: .upToNextOption)
    var fields: [FieldArgument] = []
    
    func run() async throws {
        let slacker = Slacker(channel: channel, token: token, message: message, fields: fields.map { $0.field }, action: .viewJob(jobUrl: jobUrl))
        do {
            try await slacker.execute()
        } catch let error as SlackerError {
            switch error {
            case .missingChannel:
                SlackerCLI.exit(withError: ValidationError("💥 You must specify a Slack channel"))
            case .missingToken:
                SlackerCLI.exit(withError: ValidationError("💥 You must specify a Slack access token"))
            case .missingMessage:
                SlackerCLI.exit(withError: ValidationError("💥 You must specify a message to display in Slack"))
            case .missingJobUrl:
                SlackerCLI.exit(withError: ValidationError("💥 You must specify the GitHub Actions job url"))
            }
        } catch {
            SlackerCLI.exit(withError: ValidationError("💥 Unknown error"))
        }
    }
}
