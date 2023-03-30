//
//  LocoLocale.swift
//  
//
//  Created by Mathias Emil Mortensen on 30/03/2023.
//

import Foundation

struct LocoLocale: Decodable {
    let code: String
    let name: String
    let progress: LocoTranslationProgress
}
