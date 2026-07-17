import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, Trash2, Search, CheckCircle,
  AlertCircle, Clock, RefreshCw, BookOpen, Link2,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { knowledgeService } from '@/services/knowledgeService'
import { formatBytes } from '@/lib/utils'
import type { DocumentStatus, RAGResult } from '@/types'

const statusConfig: Record<DocumentStatus, { icon: React.ReactNode; variant: 'success' | 'warning' | 'secondary' | 'destructive' }> = {
  indexed:   { icon: <CheckCircle className="size-3" />,  variant: 'success' },
  indexing:  { icon: <Clock className="size-3 animate-spin" />, variant: 'warning' },
  uploading: { icon: <Clock className="size-3 animate-spin" />, variant: 'secondary' },
  error:     { icon: <AlertCircle className="size-3" />, variant: 'destructive' },
}

export function KnowledgePage() {
  const [query, setQuery] = useState('')
  const [ragResult, setRagResult] = useState<RAGResult | null>(null)
  const [isQuerying, setIsQuerying] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const queryClient = useQueryClient()

  const { data: docsData, isLoading } = useQuery({
    queryKey: ['knowledge-documents'],
    queryFn: () => knowledgeService.getDocuments(),
  })

  const uploadMutation = useMutation({
    mutationFn: (file: File) => knowledgeService.uploadDocument(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => knowledgeService.deleteDocument(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] }),
  })

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach((f) => {
      if (f.type === 'application/pdf' || f.name.endsWith('.docx') || f.name.endsWith('.txt')) {
        uploadMutation.mutate(f)
      }
    })
  }, [uploadMutation])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => uploadMutation.mutate(f))
  }

  const handleQuery = async () => {
    if (!query.trim()) return
    setIsQuerying(true)
    try {
      const result = await knowledgeService.query({ query, topK: 5 })
      setRagResult(result)
    } catch {
      setRagResult(null)
    } finally {
      setIsQuerying(false)
    }
  }

  const docs = docsData?.items ?? []

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Tabs defaultValue="query">
        <TabsList>
          <TabsTrigger value="query">Query Knowledge</TabsTrigger>
          <TabsTrigger value="documents">Documents ({docs.length})</TabsTrigger>
        </TabsList>

        {/* Query Tab */}
        <TabsContent value="query" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleQuery()}
                  placeholder="Ask anything about your uploaded documents..."
                  className="flex-1"
                />
                <Button variant="gradient" onClick={() => void handleQuery()} loading={isQuerying}>
                  <Search className="size-4" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {ragResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Answer */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BookOpen className="size-4 text-halo-400" /> Answer
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <div className="w-24">
                          <Progress value={ragResult.confidence * 100} />
                        </div>
                        <span className="text-xs font-medium text-halo-400">
                          {(ragResult.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{ragResult.answer}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Processed in {ragResult.processingTime}ms
                    </p>
                  </CardContent>
                </Card>

                {/* Citations */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="size-4 text-emerald-400" /> Citations ({ragResult.citations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ragResult.citations.map((cite, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-halo-400">{cite.documentName}</span>
                          {cite.pageNumber && <span className="text-xs text-muted-foreground">p.{cite.pageNumber}</span>}
                          <Badge variant="outline" className="text-[10px]">
                            {(cite.score * 100).toFixed(0)}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">{cite.chunk}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 mt-4">
          {/* Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragging ? 'border-halo-500 bg-halo-500/10' : 'border-border hover:border-halo-500/50 hover:bg-accent/30'
            }`}
          >
            <input type="file" accept=".pdf,.docx,.txt" multiple onChange={handleFileInput} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-halo-500/10 border border-halo-500/20">
                <Upload className="size-6 text-halo-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT up to 50MB each</p>
              </div>
            </label>
          </div>

          {/* Documents List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="size-6 animate-spin rounded-full border-2 border-halo-500 border-t-transparent" />
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload PDFs or documents to build your knowledge base</p>
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {docs.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-halo-500/30 transition-all"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-halo-500/10 border border-halo-500/20">
                      <FileText className="size-5 text-halo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.size)} · {doc.chunks} chunks
                      </p>
                      {doc.status === 'indexing' && <Progress value={65} className="h-1 mt-1.5 w-32" />}
                    </div>
                    <Badge variant={statusConfig[doc.status].variant} className="gap-1">
                      {statusConfig[doc.status].icon}
                      {doc.status}
                    </Badge>
                    <div className="flex gap-1">
                      {doc.status === 'error' && (
                        <Button variant="ghost" size="icon-sm" onClick={() => knowledgeService.reindexDocument(doc.id)}>
                          <RefreshCw className="size-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteMutation.mutate(doc.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
