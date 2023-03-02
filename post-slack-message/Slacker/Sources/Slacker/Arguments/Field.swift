//
//  Field.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation
import ArgumentParser

struct Field: ExpressibleByArgument {
    let title: String
    let value: String

    init?(argument: String) {
        let components = argument.split(separator: ":")
        assert(components.count == 2, "A SlackField must be composed of a title and a value separated by a colon. Example: 'Branch:main'")
        title = String(components[0])
        value = String(components[1])
    }
}
