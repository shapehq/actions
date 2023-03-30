//
//  LocoTranslationProgress.swift
//  
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation

struct LocoTranslationProgress: Decodable {
    let translated: Int
    let untranslated: Int
}
