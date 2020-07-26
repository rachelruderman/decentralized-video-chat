import { videoChat } from "..";

export function startSpeechRecognition() {
    try {
        const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition);
        videoChat.recognition = new SpeechRecognition();
        // videoChat.recognition.lang = "en";
    } catch (e) {
        sendingCaptions = false;
        logIt(e);
        logIt("error importing speech library");
        // Alert other user that they cannon use live caption
        dataChannel.send("cap:notusingchrome");
        return;
    }
    // recognition.maxAlternatives = 3;
    videoChat.recognition.continuous = true;
    // Show results that aren't final
    videoChat.recognition.interimResults = true;
    let finalTranscript;
    videoChat.recognition.onresult = (event) {
        let interimTranscript = "";
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
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
    videoChat.recognition.onend = () => {
        logIt("on speech recording end");
        // Restart speech recognition if user has not stopped it
        if (sendingCaptions) {
            startSpeech();
        } else {
            videoChat.recognition.stop();
        }
    };
    videoChat.recognition.start();
}