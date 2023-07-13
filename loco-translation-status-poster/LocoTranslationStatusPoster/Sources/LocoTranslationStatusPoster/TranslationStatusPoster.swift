import ArgumentParser
import Foundation
import LocoTranslations
import SlackerCore

@main
struct TranslationStatusPoster: AsyncParsableCommand {
    @Option var channel: String
    @Option var token: String
    @Option var locoAPIKey: String
    @Option var workflow: String
    @Option var startedBy: String
    @Option var jobUrl: String
    
    func run() async throws {
        let loco = Loco(locoAPIKey: locoAPIKey)
        do {
            let locales = try loco.fetchLocales()
            let localesMissingTranslations = locales.filter { $0.progress.untranslated > 0 }
            
            if localesMissingTranslations.isEmpty {
                print("🟢 There are no missing translations")
            } else {
                // Fetch Loco project
                let project = try loco.fetchProject()
                
                // Sum up missing translations
                let numOfMissingTranslations = locales.reduce(into: Int()) { partialResult, locale in
                    partialResult += locale.progress.untranslated
                }

                // Post warning to Slack
                let slacker = Slacker(
                    channel: channel,
                    token: token,
                    message: "*⚠️ Detected \(numOfMissingTranslations) missing translations in Loco project for build started on GitHub Actions ⚠️*",
                    fields: [
                        Field(title: "Project", value: project.name),
                        Field(title: "Locales", value: localesMissingTranslations.map { $0.name }.joined(separator: ", ")),
                        Field(title: "Workflow", value: workflow),
                        Field(title: "Started by", value: startedBy),
                    ],
                    action: .custom(id: "loco", name: "Open Loco", url: project.url)
                )
                try slacker.execute()
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
            try slacker.execute()
        }
    }
}
