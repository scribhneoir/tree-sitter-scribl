import XCTest
import SwiftTreeSitter
import TreeSitterScribl

final class TreeSitterScriblTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_scribl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading TreeSitterScribl grammar")
    }
}
