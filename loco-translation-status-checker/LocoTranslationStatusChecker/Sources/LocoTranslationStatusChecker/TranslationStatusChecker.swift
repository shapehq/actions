import ArgumentParser
import Foundation
import LocoTranslations

@main
struct TranslationStatusChecker: AsyncParsableCommand {
    @Option var locoAPIKey: String
    
    func run() async throws {
        do {
            let numOfMissingTranslations = try Loco(locoAPIKey: locoAPIKey).fetchNumOfMissingTranslations()
            if numOfMissingTranslations == 0 {
                print("🟢 There are no missing translations")
            } else {
                TranslationStatusChecker.exit(withError: LocoError(message: "🔴 There are \(numOfMissingTranslations) missing translations"))
            }
        } catch {
            TranslationStatusChecker.exit(withError: error)
        }
    }
}
