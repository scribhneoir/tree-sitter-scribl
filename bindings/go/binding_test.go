package tree_sitter_tree_sitter_scribl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tree_sitter_scribl "github.com/scribhneoir/tree-sitter-scribl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tree_sitter_scribl.Language())
	if language == nil {
		t.Errorf("Error loading TreeSitterScribl grammar")
	}
}
