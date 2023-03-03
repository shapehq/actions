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
        let comps = argument.split(separator: ":")
        assert(comps.count >= 2, "A SlackField must be composed of a title and a value separated by a colon. Example: 'Branch:main'")
        title = String(comps[0])
        value = comps[comps.startIndex.advanced(by: 1) ..< comps.endIndex].joined(separator: ":")
    }
}
