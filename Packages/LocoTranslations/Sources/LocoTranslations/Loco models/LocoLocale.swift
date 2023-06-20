import Foundation

public struct LocoLocale: Decodable {
    public let code: String
    public let name: String
    public let progress: LocoTranslationProgress
}
