//
//  SlackAPIError.swift
//  
//
//  Created by Mathias Emil Mortensen on 13/07/2023.
//

import Foundation

public struct SlackAPIError: Error, CustomStringConvertible {
    let message: String
    
    public var description: String {
        message
    }
    
    public init(message: String) {
        self.message = message
    }
}
