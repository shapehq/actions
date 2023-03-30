//
//  SlackBlock.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation

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
