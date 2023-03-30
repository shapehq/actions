//
//  LocoProject.swift
//  
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation

struct LocoProject: Decodable {
    let project: Project
    
    var name: String {
        project.name
    }
    
    var url: String {
        project.url
    }
}

extension LocoProject {
    struct Project: Decodable {
        let name: String
        let url: String
    }
}
