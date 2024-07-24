//
//  SlackAPIResponse.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation

enum SlackAPIResponse: Decodable {
    case success
    case failure(errorMessage: String)
}

extension SlackAPIResponse {
    enum CodingKeys: String, CodingKey {
        case ok
        case error
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let ok = try container.decode(Bool.self, forKey: .ok)
        
        if ok {
            self = .success
        } else {
            let error = (try? container.decode(String.self, forKey: .error)) ?? "Unknown error"
            self = .failure(errorMessage: error)
        }
    }
}
