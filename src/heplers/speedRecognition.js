const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

export default (phrase, langauge = 'en-US') => {
    const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.lang = langauge;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return recognition;
}