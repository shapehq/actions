//
//  SlackMessage.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation

struct SlackMessage: Encodable {
    let channel: String
    let blocks: [SlackBlock]
}
