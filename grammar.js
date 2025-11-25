/**
 * @file Scribl grammar for tree-sitter
 * @author Josiah McCracken <josiah@scribhneoir.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "scribl",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => "hello",
  },
});
