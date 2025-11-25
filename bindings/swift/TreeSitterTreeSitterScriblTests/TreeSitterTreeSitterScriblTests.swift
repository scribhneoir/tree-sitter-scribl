import XCTest
import SwiftTreeSitter
import TreeSitterTreeSitterScribl

final class TreeSitterTreeSitterScriblTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tree_sitter_scribl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading TreeSitterScribl grammar")
    }
}
