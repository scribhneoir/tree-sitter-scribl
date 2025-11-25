/**
 * @file The tree sitter parser for the Scribl toy lang
 * @author Josiah McCracken <josiah@scribhneoir.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tree_sitter_scribl",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
