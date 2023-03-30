//
//  SlackAction.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation

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
