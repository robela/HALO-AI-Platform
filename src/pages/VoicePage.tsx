import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Upload, Volume2, VolumeX, Play, Square, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVoiceStore } from '@/stores/voiceStore'
import { voiceService } from '@/services/voiceService'
import { cn } from '@/lib/utils'

function WaveformVisualizer({ active }: { active: boolean }) {
  return (
    <div className={cn('flex items-center gap-0.5 h-8', active ? 'opacity-100' : 'opacity-30')}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={cn('waveform-bar', active ? '' : 'h-1')} />
      ))}
    </div>
  )
}

export function VoicePage() {
  const {
    status, selectedLanguage, transcript, responseText,
    responseAudioUrl, isPlaying, languages,
    setStatus, setSelectedLanguage, setTranscript,
    setResponseText, setResponseAudioUrl, setIsPlaying, reset,
  } = useVoiceStore()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setStatus('recording')
    } catch {
      setStatus('error')
    }
  }, [setStatus])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setStatus('processing')
  }, [setStatus])

  const processAudio = useCallback(async (blob: Blob) => {
    setStatus('processing')
    try {
      const result = await voiceService.transcribeAudio(blob, selectedLanguage)
      setTranscript(result.text)

      const synthesis = await voiceService.synthesizeSpeech({
        text: result.text,
        language: selectedLanguage,
      })
      setResponseText(synthesis.audioUrl)
      setResponseAudioUrl(synthesis.audioUrl)
      setStatus('idle')
    } catch {
      setStatus('error')
      setTranscript('Error processing audio. Please check your Voice API endpoint in Settings.')
    }
  }, [selectedLanguage, setStatus, setTranscript, setResponseText, setResponseAudioUrl])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processAudio(file)
  }, [processAudio])

  const handleMicButton = () => {
    if (status === 'recording') stopRecording()
    else void startRecording()
  }

  const handlePlayback = () => {
    if (!responseAudioUrl) return
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      const audio = new Audio(responseAudioUrl)
      audioRef.current = audio
      audio.onended = () => setIsPlaying(false)
      void audio.play()
      setIsPlaying(true)
    }
  }

  const selectedLang = languages.find((l) => l.code === selectedLanguage)

  return (
    <div className="flex flex-col items-center min-h-full p-6 space-y-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Languages className="size-4" />
            <span>Language</span>
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-52">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span>{selectedLang?.flag}</span>
                  <span>{selectedLang?.name}</span>
                  <span className="text-muted-foreground">({selectedLang?.nativeName})</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-muted-foreground text-xs">({lang.nativeName})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Microphone Interface */}
        <div className="flex flex-col items-center py-10 space-y-6">
          {/* Mic Button */}
          <div className="relative">
            <AnimatePresence>
              {status === 'recording' && (
                <>
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1 + ring * 0.4, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: ring * 0.4 }}
                      className="absolute inset-0 rounded-full border-2 border-rose-500"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleMicButton}
              disabled={status === 'processing'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative z-10 flex size-32 items-center justify-center rounded-full border-4 transition-all duration-300 shadow-lg',
                status === 'recording'
                  ? 'border-rose-500 bg-rose-500/20 animate-recording'
                  : status === 'processing'
                  ? 'border-amber-500 bg-amber-500/20 cursor-not-allowed'
                  : 'border-halo-500 bg-halo-500/10 hover:bg-halo-500/20 shadow-glow-md',
              )}
            >
              {status === 'recording' ? (
                <MicOff className="size-14 text-rose-400" />
              ) : status === 'processing' ? (
                <span className="size-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
              ) : (
                <Mic className="size-14 text-halo-300" />
              )}
            </motion.button>
          </div>

          {/* Status + Waveform */}
          <div className="flex flex-col items-center gap-2">
            <WaveformVisualizer active={status === 'recording'} />
            <Badge variant={
              status === 'recording' ? 'destructive' :
              status === 'processing' ? 'warning' :
              status === 'error' ? 'destructive' : 'secondary'
            }>
              {status === 'idle' ? 'Tap to speak' :
               status === 'recording' ? 'Recording...' :
               status === 'processing' ? 'Processing...' :
               status === 'error' ? 'Error occurred' : status}
            </Badge>
          </div>

          {/* Upload button */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" /> Upload Audio
            </Button>
            {(transcript || responseText) && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Transcript Result */}
        <AnimatePresence>
          {transcript && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Mic className="size-4 text-halo-400" /> Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Response / Playback */}
        <AnimatePresence>
          {responseText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Volume2 className="size-4 text-violet-400" /> Response
                    </CardTitle>
                    {responseAudioUrl && (
                      <Button variant="outline" size="sm" onClick={handlePlayback}>
                        {isPlaying ? (
                          <><Square className="size-3" /> Stop</>
                        ) : (
                          <><Play className="size-3" /> Play</>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <WaveformVisualizer active={isPlaying} />
                    {isPlaying ? (
                      <VolumeX className="size-4 text-violet-400 animate-pulse" />
                    ) : (
                      <p className="text-sm text-muted-foreground">Ready to play</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
