import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public extension URLSession {
    
    func execute(request: URLRequest) throws -> Data {
        // Uses semaphore to halt execution until request has finished to ensure command line tool doesn't finish instantly.
        let semaphore = DispatchSemaphore(value: 0)
        
        var data: Data?
        var error: Error?
        let task = dataTask(with: request) { responseData, _, responseError in
            data = responseData
            error = responseError
            
            // Signal request completed to continue
            semaphore.signal()
        }
        
        // Resumes the request
        task.resume()
        
        // Halts execution until semaphore receives signal that we are done
        semaphore.wait()
        
        if let data {
            return data
        } else if let error {
            throw error
        } else {
            throw InternalAPIError.unknownError
        }
    }
}

enum InternalAPIError: Error {
    case unknownError
}
