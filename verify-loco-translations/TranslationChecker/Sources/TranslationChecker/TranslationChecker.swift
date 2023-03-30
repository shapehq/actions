import ArgumentParser
import Foundation
import SlackerCore

@main
struct TranslationChecker: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var locoAPIKey: String
    @Option var workflow: String
    @Option var jobUrl: String
    
    func run() async throws {
        do {
            // Fetch locales
            let locales = try await fetchLocales(for: locoAPIKey)
            
            // Filter for locales with untranslated assets
            let localesMissingTranslations = locales.filter { $0.progress.untranslated > 0 }
            
            if !localesMissingTranslations.isEmpty {
                let totalMissingTranslations = localesMissingTranslations.reduce(into: Int()) { partialResult, locale in
                    partialResult += locale.progress.untranslated
                }
                print("🔴 There are \(totalMissingTranslations) missing translations")
                
                // Fetch Loco project
                let project = try await fetchProject(for: locoAPIKey)

                // Post warning to Slack
                let slacker = Slacker(
                    channel: channel,
                    token: token,
                    message: "*⚠️ Detected \(totalMissingTranslations) missing translations in Loco project for build started on GitHub Actions ⚠️*",
                    fields: [
                        Field(title: "Project", value: project.name),
                        Field(title: "Workflow", value: workflow),
                        Field(title: "Locales", value: localesMissingTranslations.map { $0.name }.joined(separator: ", ")),
                    ],
                    action: .custom(id: "loco", name: "Open Loco", url: project.url)
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
                    Field(title: "Workflow", value: workflow),
                ],
                action: .viewJob(jobUrl: jobUrl)
            )
            try await slacker.execute()
        }
    }
    
    private func fetchLocales(for apiKey: String) async throws -> [LocoLocale] {
        var urlRequest = URLRequest(url: URL(string: "https://localise.biz/api/locales?key=\(locoAPIKey)")!)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: urlRequest)
            do {
                return try JSONDecoder().decode([LocoLocale].self, from: data)
            } catch {
                print("⁉️ [\(response.httpStatusCode)] Failed to deserialize Loco locales response with error: \(error)")
                throw error
            }
        } catch {
            print("💥 Faile to fetch locales with error \(error)")
            throw error
        }
    }
    
    private func fetchProject(for apiKey: String) async throws -> LocoProject {
        var urlRequest = URLRequest(url: URL(string: "https://localise.biz/api/auth/verify?key=\(locoAPIKey)")!)
        urlRequest.httpMethod = "GET"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: urlRequest)
            do {
                return try JSONDecoder().decode(LocoProject.self, from: data)
            } catch {
                print("⁉️ [\(response.httpStatusCode)] Failed to deserialize Loco project response with error: \(error)")
                throw error
            }
        } catch {
            print("💥 Faile to fetch project with error \(error)")
            throw error
        }
    }
}
