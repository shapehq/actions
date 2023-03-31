// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "LocoTranslationStatusPoster",
    platforms: [
        .macOS(.v11)
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.2.0"),
        .package(name: "LocoTranslations", path: "../../Packages/LocoTranslations"),
        .package(name: "SlackerCore", path: "../../Packages/SlackerCore"),
    ],
    targets: [
        .executableTarget(
            name: "LocoTranslationStatusPoster",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .product(name: "LocoTranslations", package: "LocoTranslations"),
                .product(name: "SlackerCore", package: "SlackerCore"),
            ]
        ),
    ]
)
