// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "SHPUtilities",
    platforms: [
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "SHPUtilities",
            targets: ["SHPUtilities"]
        ),
    ],
    targets: [
        .target(
            name: "SHPUtilities"
        ),
    ]
)
