"use client";

import { useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type StickyNoteItem = {
  id: string;
  x: number;
  y: number;
  text: string;
};

export default function SystemDesignPage() {
  const [notes, setNotes] = useState<StickyNoteItem[]>([]);
  const [draft, setDraft] = useState("");
  const [canvasNotes, setCanvasNotes] = useState(
    "Describe components, data flow, scaling trade-offs, and failure modes here…",
  );

  function addStickyNote() {
    const text = draft.trim();
    if (!text) return;
    setNotes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        x: 24 + (prev.length % 4) * 140,
        y: 24 + Math.floor(prev.length / 4) * 120,
        text,
      },
    ]);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System design whiteboard</h1>
        <p className="text-muted-foreground">
          Sketch architecture notes and sticky components before or during a system design mock.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Architecture notes</CardTitle>
            <CardDescription>Free-form textarea for high-level design narrative.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={canvasNotes}
              onChange={(event) => setCanvasNotes(event.target.value)}
              className="min-h-80 resize-y font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sticky notes canvas</CardTitle>
            <CardDescription>Add draggable-style sticky notes to the board (stub layout).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="New sticky note…"
                rows={2}
                className="resize-none"
              />
              <Button type="button" onClick={addStickyNote}>
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="relative min-h-80 overflow-hidden rounded-lg border bg-slate-50 dark:bg-slate-950">
              {notes.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Add sticky notes for services, queues, databases, and bottlenecks.
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="absolute w-36 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs shadow-sm dark:border-amber-900/40 dark:bg-amber-950/40"
                    style={{ left: note.x, top: note.y }}
                  >
                    <StickyNote className="mb-1 size-3 text-amber-600" />
                    {note.text}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
