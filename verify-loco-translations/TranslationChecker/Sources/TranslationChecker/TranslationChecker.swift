import ArgumentParser
import Foundation
import SlackerCore

@main
struct TranslationChecker: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var locoAPIKey: String
    @Option var locales: String
    @Option var appName: String
    @Option var appVersion: String
    @Option var workflow: String
    @Option var jobUrl: String
    
    func run() async throws {
        do {
            let locales = locales.components(separatedBy: ", ")
            let localesMissingTranslations = try await verifyTranslationProgress(for: locales)
            
            if !localesMissingTranslations.isEmpty {
                let totalMissingTranslations = localesMissingTranslations.reduce(into: Int()) { partialResult, status in
                    partialResult += status.untranslated
                }
                print("🔴 There are \(totalMissingTranslations) missing translations")
                
                let slacker = Slacker(
                    channel: channel,
                    token: token,
                    message: "*⚠️ Detected \(totalMissingTranslations) missing translations in build started on GitHub Actions ⚠️*",
                    fields: [
                        Field(title: "App", value: appName),
                        Field(title: "Version", value: appVersion),
                        Field(title: "Workflow", value: workflow),
                        Field(title: "Locales", value: localesMissingTranslations.map { $0.locale }.joined(separator: ", ")),
                    ],
                    action: .viewJob(jobUrl: jobUrl)
                )
                try await slacker.execute()
            } else {
                print("🟢 There are no missing translations")
            }
        } catch {
            // If translation check fails we post it on Slack
            let slacker = Slacker(
                channel: channel,
                token: token,
                message: "*💥 Loco translation verification for build started on GitHub Actions failed 💥*",
                fields: [
                    Field(title: "App", value: appName),
                    Field(title: "Version", value: appVersion),
                    Field(title: "Workflow", value: workflow),
                    Field(title: "Locales", value: locales),
                ],
                action: .viewJob(jobUrl: jobUrl)
            )
            try await slacker.execute()
        }
    }
    
    private func verifyTranslationProgress(for locales: [String]) async throws -> [TranslationStatus] {
        let translationStatusses = try await withThrowingTaskGroup(of: TranslationStatus.self, returning: [TranslationStatus].self) { taskGroup in
            for locale in locales {
                taskGroup.addTask {
                    return try await translationProgress(for: locale)
                }
            }
            
            return try await taskGroup.reduce(into: [TranslationStatus](), { partialResult, status in
                partialResult.append(status)
            })
        }
        
        return translationStatusses.filter { $0.untranslated > 0 }
    }
    
    private func translationProgress(for locale: String) async throws -> TranslationStatus {
        var urlRequest = URLRequest(url: URL(string: "https://localise.biz/api/locales/\(locale)/progress?key=\(locoAPIKey)")!)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: urlRequest)
            do {
                let locoResponse = try JSONDecoder().decode(LocoResponse.self, from: data)
                print("[\(locale)] Translated = \(locoResponse.progress.translated)")
                print("[\(locale)] Untranslated = \(locoResponse.progress.untranslated)")
                return TranslationStatus(locale: locale, translated: locoResponse.progress.translated, untranslated: locoResponse.progress.untranslated)
            } catch {
                print("⁉️ [\(response.httpStatusCode)] Failed to deserialize Loco response for locale \(locale) with error: \(error)")
                throw error
            }
        } catch {
            print("💥 Request for locale \(locale) failed: \(error)")
            throw error
        }
    }
}

struct TranslationStatus {
    let locale: String
    let translated: Int
    let untranslated: Int
}

// Loco models

struct LocoResponse: Decodable {
    let progress: LocoTranslationProgress
}

extension LocoResponse {
    struct LocoTranslationProgress: Decodable {
        let translated: Int
        let untranslated: Int
    }
}
