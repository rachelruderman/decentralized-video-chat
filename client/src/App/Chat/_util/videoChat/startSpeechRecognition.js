
export const startSpeechRecognition = () => {
    try {
        var SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        VideoChat.recognition = new SpeechRecognition();
        // VideoChat.recognition.lang = "en";
    } catch (e) {
        sendingCaptions = false;
        logIt(e);
        logIt("error importing speech library");
        // Alert other user that they cannon use live caption
        dataChannel.send("cap:notusingchrome");
        return;
    }
    // recognition.maxAlternatives = 3;
    VideoChat.recognition.continuous = true;
    // Show results that aren't final
    VideoChat.recognition.interimResults = true;
    var finalTranscript;
    VideoChat.recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            var transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
                var charsToKeep = interimTranscript.length % 100;
                // Send captions over data chanel,
                // subtracting as many complete 100 char slices from start
                dataChannel.send(
                    "cap:" +
                    interimTranscript.substring(interimTranscript.length - charsToKeep)
                );
            }
        }
    };
    VideoChat.recognition.onend = () => {
        logIt("on speech recording end");
        // Restart speech recognition if user has not stopped it
        if (sendingCaptions) {
            startSpeech();
        } else {
            VideoChat.recognition.stop();
        }
    };
    VideoChat.recognition.start();
}