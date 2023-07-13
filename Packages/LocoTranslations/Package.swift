// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "LocoTranslations",
    platforms: [
        .macOS(.v11),
    ],
    products: [
        .library(
            name: "LocoTranslations",
            targets: ["LocoTranslations"]
        )
    ],
    dependencies: [
        .package(name: "SHPUtilities", path: "../../Packages/SHPUtilities"),
    ],
    targets: [
        .target(
            name: "LocoTranslations",
            dependencies: [
                .byNameItem(name: "SHPUtilities", condition: .none)
            ]
        ),
    ]
)
