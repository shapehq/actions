import Foundation

public struct LocoError: Error, CustomStringConvertible {
    let message: String
    
    public var description: String {
        message
    }
    
    public init(message: String) {
        self.message = message
    }
}
