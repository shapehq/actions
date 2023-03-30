// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Slacker",
    platforms: [
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "SlackerCore",
            targets: ["SlackerCore"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.2.0"),
    ],
    targets: [
        .target(
            name: "SlackerCore"
        ),
        .executableTarget(
            name: "Slacker",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .byNameItem(name: "SlackerCore", condition: .none)
            ]
        )
    ]
)
