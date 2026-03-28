package handler

import "strings"

var profanityMap = []struct {
	word        string
	replacement string
}{
	{"시발", "시**"},
	{"씨발", "씨**"},
	{"좆", "*"},
	{"존나", "존**"},
	{"지랄", "지**"},
	{"개소리", "개**"},
	{"병신", "병**"},
	{"새끼", "새**"},
	{"개새", "개**"},
	{"미친놈", "미**"},
	{"미친년", "미**"},
}

func MaskProfanity(text string) string {
	result := text
	for _, p := range profanityMap {
		result = strings.ReplaceAll(result, p.word, p.replacement)
	}
	return result
}
