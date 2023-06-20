import Foundation

public struct LocoProject: Decodable {
    let project: Project
    
    public var name: String {
        project.name
    }
    
    public var url: String {
        project.url
    }
}

extension LocoProject {
    struct Project: Decodable {
        let name: String
        let url: String
    }
}
