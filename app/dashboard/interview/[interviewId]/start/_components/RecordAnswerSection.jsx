"use client"
import Webcam from 'react-webcam'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

// Import TensorFlow and PoseNet for body language analysis
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Existing speech-to-text hook
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false
  });

  // New states & ref for video recording
  const webcamRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Append speech-to-text results to userAnswer
  useEffect(() => {
    results?.forEach((result) => {
      setUserAnswer(prevAns => prevAns + result?.transcript);
    });
  }, [results]);

  // Trigger update of user answer after recording stops (if length is sufficient)
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      // Call the combined update function
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  // MediaRecorder event handler for data availability
  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      setRecordedChunks(prev => [...prev, event.data]);
    }
  };

  // When video recording stops, create a Blob and analyze it
  const handleStopRecording = () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    // Proceed to analyze the video for body language and voice
    AnalyzeVideoAndStoreFeedback(videoBlob);
    setRecordedChunks([]); // reset for next recording
  };

  // ----------------------------
  // Analysis Functions
  // ----------------------------

  // Analyze body language using PoseNet (dummy implementation)
  async function analyzeBodyLanguage(videoBlob) {
    try {
        const net = await posenet.load();

        // Random feedback options
        const feedbackOptions = [
            "Your posture was strong and confident. Well done!",
            "You maintained good eye contact, which shows engagement.",
            "Your hand movements were natural and expressive.",
            "Try to avoid excessive fidgeting to appear more composed.",
            "Smiling occasionally can make you appear more approachable.",
            "Leaning slightly forward shows active listening and interest.",
            "Your crossed arms might make you appear defensive—try to keep them relaxed.",
        ];

        // Select a random feedback message
        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        return randomFeedback;
    } catch (err) {
        console.error("Error in body language analysis:", err);
        return "Could not analyze body language.";
    }
}


  // Analyze voice using Web Audio API (dummy implementation)
  async function analyzeVoice(videoBlob) {
    try {
        // Randomized feedback options
        const feedbackOptions = [
            "Your voice had a confident and steady tone. Great job!",
            "Try varying your pitch slightly to make your speech more engaging.",
            "Your speaking pace was excellent—not too fast or too slow.",
            "Speaking slightly louder can help improve clarity.",
            "Your pauses were well-placed, giving you a natural rhythm.",
            "Try to reduce filler words (like 'uh' and 'um') to sound more fluent.",
            "Lowering your pitch slightly at the end of statements can make you sound more authoritative.",
        ];

        // Select a random feedback message
        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        return randomFeedback;
    } catch (err) {
        console.error("Error in voice analysis:", err);
        return "Could not analyze voice.";
    }
}

  // ----------------------------
  // Update User Answer Function
  // ----------------------------
  const UpdateUserAnswer = async () => {
    console.log("User Answer:", userAnswer);
    setLoading(true);

    // First, run analysis on the recorded video (if available)
    // For this example, we assume that the video analysis has been done
    // in the AnalyzeVideoAndStoreFeedback function. If no video was recorded,
    // you might want to set default dummy analysis feedback.
    let bodyLanguageAnalysis = "No video recorded for analysis.";
    let voiceAnalysis = "No video recorded for analysis.";
    
    // If recordedChunks exist (video was recorded), perform analysis:
    if (recordedChunks.length > 0) {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      bodyLanguageAnalysis = await analyzeBodyLanguage(videoBlob);
      voiceAnalysis = await analyzeVoice(videoBlob);
    }

    // Combine the original prompt with the analysis results
    const feedbackPrompt =
      "Question: " + mockInterviewQuestion[activeQuestionIndex]?.question +
      "\nUser Answer: " + userAnswer +
      "\n\nAnalysis:" +
      "\nBody Language: " + bodyLanguageAnalysis +
      "\nVoice: " + voiceAnalysis +
      "\n\nBased on the above, please provide a JSON response with the following fields:" +
      "\n- rating: A score out of 10 based on the overall answer quality." +
      "\n- feedback: General feedback on the answer." +
      "\n- bodyLanguageFeedback: Specific feedback on the user's body language." +
      "\n- voiceFeedback: Specific feedback on the user's voice." +
      "\n\nResponse must be in valid JSON format.";

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        bodyLanguageFeedback: JsonFeedbackResp?.bodyLanguageFeedback,
        voiceFeedback: JsonFeedbackResp?.voiceFeedback,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });

      toast('User Answer recorded successfully and feedback stored.');
      setUserAnswer('');
      setResults([]);
    } catch (err) {
      console.error("Error in updating user answer:", err);
      toast('Error recording answer.');
    }
    setLoading(false);
  };

  // ----------------------------
  // Combined Start/Stop Recording Handler
  // ----------------------------
  const StartStopRecording = async () => {
    if (isRecording) {
      // Stop speech-to-text (existing)
      stopSpeechToText();
      // Stop video recording if active
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    } else {
      // Start speech-to-text (existing)
      startSpeechToText();
      // Start video recording
      if (webcamRef.current && webcamRef.current.stream) {
        const stream = webcamRef.current.stream;
        try {
          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          recorder.ondataavailable = handleDataAvailable;
          recorder.onstop = handleStopRecording;
          setMediaRecorder(recorder);
          recorder.start();
        } catch (err) {
          console.error("Error starting MediaRecorder:", err);
          toast("Error starting video recording.");
        }
      } else {
        toast("Webcam stream not available.");
      }
    }
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        {/* Existing Webcam display */}
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' />
        <Webcam
          audio={true}
          ref={webcamRef}
          mirrored={true}
          style={{ height: 300, width: '100%', zIndex: 10 }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ?
          <h2 className='text-red-600 flex gap-2'>
            <Mic />Stop Recording
          </h2>
          :
          'Record Answer'
        }
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
