// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "TranslationChecker",
    platforms: [
        .macOS(.v11)
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.2.0"),
        .package(name: "Slacker", path: "../../post-slack-message/Slacker"),
    ],
    targets: [
        .executableTarget(
            name: "TranslationChecker",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "SlackerCore", package: "Slacker")
            ]
        ),
    ]
)
