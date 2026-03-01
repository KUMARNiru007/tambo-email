import { Tooltip } from "@/components/tambo/suggestions-tooltip";
import { cn } from "@/lib/utils";
import { useTamboThreadInput, useTamboVoice } from "@tambo-ai/react";
import { Loader2Icon, Mic, Square } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DictationButton() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    transcript,
    transcriptionError,
  } = useTamboVoice();
  const { value, setValue } = useTamboThreadInput();
  const [lastProcessedTranscript, setLastProcessedTranscript] =
    useState<string>("");

  const handleStartRecording = () => {
    setLastProcessedTranscript("");
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    if (transcript && transcript !== lastProcessedTranscript) {
      setLastProcessedTranscript(transcript);
      setValue(value + " " + transcript);
    }
  }, [transcript, lastProcessedTranscript, value, setValue]);

  if (isTranscribing) {
    return (
      <div className="p-2 rounded-md">
        <Loader2Icon className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2">
      {transcriptionError && (
        <span className="text-sm text-red-500">{transcriptionError}</span>
      )}
      {isRecording ? (
        <Tooltip content="Stop recording">
          <button
            type="button"
            onClick={handleStopRecording}
            className={cn(
              "relative p-2 rounded-lg cursor-pointer transition-colors",
              "bg-red-500/15 hover:bg-red-500/25 dark:bg-red-500/20 dark:hover:bg-red-500/30"
            )}
          >
            <span className="absolute inset-0 rounded-lg animate-ping bg-red-500/20" />
            <Square className="relative h-4 w-4 text-red-500 fill-current" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip content="Voice input">
          <button
            type="button"
            onClick={handleStartRecording}
            className={cn(
              "p-2 rounded-lg cursor-pointer transition-colors",
              "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Mic className="h-5 w-5" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
