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
}
