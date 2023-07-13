//
//  URLResponse+Extensions.swift
//  
//
//  Created by Mathias Emil Mortensen on 02/03/2023.
//

import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

extension URLResponse {
    var httpStatusCode: Int {
        let httpResponse = self as! HTTPURLResponse // Should never crash 🤞🏼
        return httpResponse.statusCode
    }
}
