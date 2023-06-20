//
//  Field.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation
import ArgumentParser
import SlackerCore

struct Field: ExpressibleByArgument {
    let field: SlackerCore.Field    

    init?(argument: String) {
        let comps = argument.split(separator: ":")
        assert(comps.count >= 2, "A SlackField must be composed of a title and a value separated by a colon. Example: 'Branch:main'")
        let title = String(comps[0])
        let value = comps[comps.startIndex.advanced(by: 1) ..< comps.endIndex].joined(separator: ":")
        self.field = SlackerCore.Field(title: title, value: value)
    }
}
