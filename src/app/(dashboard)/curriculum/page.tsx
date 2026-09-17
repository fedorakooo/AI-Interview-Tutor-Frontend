"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { curriculumApi } from "@/lib/api/curriculum";
import { queryKeys } from "@/lib/query-keys";

const CATEGORIES = ["", "algorithms", "system_design", "behavioral"] as const;

export default function CurriculumPage() {
  const [category, setCategory] = useState<string>("");

  const questionsQuery = useQuery({
    queryKey: queryKeys.curriculum.questionBank(category || undefined),
    queryFn: () => curriculumApi.listQuestionBank(category || undefined),
  });

  const pathsQuery = useQuery({
    queryKey: queryKeys.curriculum.learningPaths,
    queryFn: () => curriculumApi.listLearningPaths(),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Curriculum</h1>
        <p className="text-muted-foreground">
          Browse the question bank and learning paths to structure your interview prep.
        </p>
      </div>

      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions" className="gap-1.5">
            <BookMarked className="size-4" />
            Question bank
          </TabsTrigger>
          <TabsTrigger value="paths" className="gap-1.5">
            <GraduationCap className="size-4" />
            Learning paths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((value) => (
              <button
                key={value || "all"}
                type="button"
                onClick={() => setCategory(value)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  category === value ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                {value ? value.replace("_", " ") : "All"}
              </button>
            ))}
          </div>

          {questionsQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !questionsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">No questions found for this category.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {questionsQuery.data.map((item) => (
                <Card key={item.question_id}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.prompt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.difficulty}</Badge>
                    <Badge variant="outline">{item.category}</Badge>
                    {item.company_tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          {pathsQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : !pathsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">No learning paths available yet.</p>
          ) : (
            pathsQuery.data.map((path) => (
              <Card key={path.path_id}>
                <CardHeader>
                  <CardTitle>{path.title}</CardTitle>
                  <CardDescription>{path.duration_days} days · {path.focus_skills.join(", ")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                    {path.milestones.map((milestone) => (
                      <li key={milestone}>{milestone}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
