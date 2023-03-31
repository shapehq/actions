import Foundation

public struct LocoAPIError:  Decodable {
    public let status: Int
    public let error: String
}
