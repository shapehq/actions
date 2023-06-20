//
//  SlackText.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation

struct SlackText: Encodable {
    enum TextType: String, Encodable {
        case plain = "plain_text"
        case markdown = "mrkdwn"
    }
    
    let type: TextType
    let text: String
}

extension SlackText {
    init(field: Field) {
        type = .markdown
        text = "*\(field.title)*:\n\(field.value)"
    }
}
