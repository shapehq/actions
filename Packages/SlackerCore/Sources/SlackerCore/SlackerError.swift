//
//  SlackerError.swift
//  
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation

public enum SlackerError: Error {
    case missingChannel
    case missingToken
    case missingMessage
    case missingJobUrl
    case apiError(error: SlackAPIError)
}

public struct SlackAPIError: Error, CustomStringConvertible {
    let message: String
    
    public var description: String {
        message
    }
    
    public init(message: String) {
        self.message = message
    }
}
