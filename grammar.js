/**
 * @file Scribl grammar for tree-sitter
 * @author Josiah McCracken <josiah@scribhneoir.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "scribl",

  precedences: ($) => [
    [
      "unary_void",
      "binary_exp",
      "binary_times",
      "binary_plus",
      "binary_shift",
      "binary_compare",
      "binary_relation",
      "binary_equality",
      "bitwise_and",
      "bitwise_xor",
      "bitwise_or",
      "logical_and",
      "logical_or",
      "ternary",
      "assign",
      $.member_expression,
      $.subscript_expression,
      $.call_expression,
      $.spread_expression,
      $._expression,
      "destructuring_precedence",
    ],
  ],

  conflicts: ($) => [
    [$.destructuring_iterator, $._primary_expression],
    [$.destructuring_block, $._explicit_block],
    [$.destructuring_iterator, $.iterator],
    [$.parameter, $.parenthesized_expression],
  ],

  extras: ($) => [
    /\s/, // whitespace
    $.comment,
  ],

  rules: {
    block: ($) => repeat($.statement),

    _explicit_block: ($) => seq("{", repeat($.statement), "}"),

    statement: ($) => seq($._expression, repeat1(";"), optional("\n")),

    _expression: ($) =>
      choice(
        $._atomic_expression,
        $._primary_expression,
        $.unary_expression,
        $.binary_expression,
        $.assignment_expression,
      ),

    _atomic_expression: ($) =>
      choice($.true, $.false, $.void, $.number, $.string, $.template_string),

    true: (_) => "true",
    false: (_) => "false",
    void: (_) => "void",
    number: ($) => {
      const integer = /\d+/;
      const float = /\d+\.\d*/;
      const hex = /0[xX][0-9a-fA-F]+/;
      const octal = /0[oO][0-7]+/;
      const binary = /0[bB][01]+/;
      return token(choice(float, hex, octal, binary, integer));
    },
    string: ($) => seq(`'`, repeat(/[^'\n]/), `'`),
    template_string: ($) =>
      seq(
        '"',
        repeat(choice(/[^$"\n]/, seq("$", /[^{]/), $.template_variable)),
        '"',
      ),

    _assignables: ($) =>
      choice(
        $.member_expression,
        $.subscript_expression,
        $.identifier,
        $.destructuring_block,
        $.destructuring_iterator,
      ),

    _destructuring_expression: ($) =>
      choice($.destructuring_block, $.destructuring_iterator),

    destructuring_block: ($) =>
      prec(
        "destructuring_precedence",
        seq(
          "{",
          optional(
            seq(
              choice($.identifier, $._destructuring_expression),
              repeat(
                seq(",", choice($.identifier, $._destructuring_expression)),
              ),
              optional(","),
            ),
          ),
          "}",
        ),
      ),

    destructuring_iterator: ($) =>
      prec(
        "destructuring_precedence",
        seq(
          "[",
          optional(
            seq(
              optional(
                choice(
                  choice($.identifier, $._destructuring_expression),
                  seq("...", choice($.identifier, $._destructuring_expression)),
                ),
              ),
              repeat(
                seq(
                  ",",
                  optional(
                    choice(
                      choice($.identifier, $._destructuring_expression),
                      seq(
                        "...",
                        choice($.identifier, $._destructuring_expression),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          "]",
        ),
      ),

    _primary_expression: ($) =>
      choice(
        $.identifier,
        alias($._explicit_block, $.block),
        $.iterator,
        $.function,
        $.call_expression,
        $.member_expression,
        $.subscript_expression,
        $.spread_expression,
        $.parenthesized_expression,
      ),

    parameter: ($) => choice($._expression, $._destructuring_expression),

    template_variable: ($) => seq("${", optional($._expression), "}"),
    identifier: ($) => /[a-zA-Z_]\w*/,
    iterator: ($) =>
      seq(
        "[",
        optional(seq($._expression, repeat(seq(",", $._expression)))),
        "]",
      ),
    function: ($) =>
      seq(
        "(",
        optional(seq($.parameter, repeat(seq(",", $.parameter)))),
        ")",
        alias($._explicit_block, $.block),
      ),
    call_expression: ($) =>
      prec.left(
        seq(
          $._primary_expression,
          "(",
          optional(seq($._expression, repeat(seq(",", $._expression)))),
          ")",
        ),
      ),
    member_expression: ($) => seq($._primary_expression, ".", $.identifier),
    subscript_expression: ($) =>
      seq(
        $._primary_expression,
        "[",
        $._expression,
        optional(repeat(seq(",", $._expression))),
        "]",
      ),
    spread_expression: ($) => seq("...", $._primary_expression),

    unary_expression: ($) =>
      prec.left(
        "unary_void",
        seq(
          field("operator", choice("!", "~", "-", "+")),
          field("argument", $._expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        ...[
          ["&&", "logical_and"],
          ["||", "logical_or"],
          [">>", "binary_shift"],
          [">>>", "binary_shift"],
          ["<<", "binary_shift"],
          ["&", "bitwise_and"],
          ["^", "bitwise_xor"],
          ["|", "bitwise_or"],
          ["+", "binary_plus"],
          ["-", "binary_plus"],
          ["*", "binary_times"],
          ["/", "binary_times"],
          ["%", "binary_times"],
          ["**", "binary_exp", "right"],
          ["<", "binary_relation"],
          ["<=", "binary_relation"],
          ["==", "binary_equality"],
          ["!=", "binary_equality"],
          [">=", "binary_relation"],
          [">", "binary_relation"],
          ["??", "ternary"],
        ].map(([operator, precedence, associativity]) =>
          (associativity === "right" ? prec.right : prec.left)(
            precedence,
            seq(
              field("left", $._expression),
              field("operator", operator),
              field("right", $._expression),
            ),
          ),
        ),
      ),

    assignment_expression: ($) =>
      prec.right(
        "assign",
        seq(field("left", $._assignables), "=", field("right", $._expression)),
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: (_) =>
      token(
        choice(seq("//", /[^\r\n\u2028\u2029]*/), seq("/*", /[\s\S]*?/, "*/")),
      ),
  },
});
