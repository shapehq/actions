import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

// async/await is not available to URLSession in Linux so we create an extension ourselves.
public extension URLSession {
    
    func execute(request: URLRequest) async throws -> Data {
        return try await withCheckedThrowingContinuation { continuation in
            dataTask(with: request) { data, _, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }
                guard let data = data else {
                    continuation.resume(throwing: InternalAPIError.missingResponseData)
                    return
                }
                continuation.resume(returning: data)
            }.resume()
        }
    }
}

enum InternalAPIError: Error {
    case missingResponseData
}
