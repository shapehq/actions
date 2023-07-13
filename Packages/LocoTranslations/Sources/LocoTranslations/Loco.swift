import Foundation
import SHPUtilities

public struct Loco {
    let locoAPIKey: String
    
    public init(locoAPIKey: String) {
        self.locoAPIKey = locoAPIKey
    }
    
    public func fetchNumOfMissingTranslations() throws -> Int {
        let locales = try fetchLocales()
        
        // Sum up missing translations
        return locales.reduce(into: Int()) { partialResult, locale in
            partialResult += locale.progress.untranslated
        }
    }
    
    public func fetchLocales() throws -> [LocoLocale] {
        var urlRequest = URLRequest(url: URL(string: "https://localise.biz/api/locales?key=\(locoAPIKey)")!)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let data = try URLSession.shared.execute(request: urlRequest)
        do {
            return try JSONDecoder().decode([LocoLocale].self, from: data)
        } catch {
            let error = try JSONDecoder().decode(LocoAPIError.self, from: data)
            throw LocoError(message: "💥 [\(error.status)] \(error.error)")
        }
    }
    
    public func fetchProject() throws -> LocoProject {
        var urlRequest = URLRequest(url: URL(string: "https://localise.biz/api/auth/verify?key=\(locoAPIKey)")!)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let data = try URLSession.shared.execute(request: urlRequest)
        do {
            return try JSONDecoder().decode(LocoProject.self, from: data)
        } catch {
            let error = try JSONDecoder().decode(LocoAPIError.self, from: data)
            throw LocoError(message: "💥 [\(error.status)] \(error.error)")
        }
    }
}
