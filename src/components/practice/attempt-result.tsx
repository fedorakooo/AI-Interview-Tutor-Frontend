import type { AttemptResponse, ExerciseAttempt, GradingResult } from "@/lib/types/practice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AttemptResultProps {
  result: AttemptResponse | ExerciseAttempt;
  referenceAnswer?: string | null;
  explanation?: string | null;
}

export function AttemptResult({ result, referenceAnswer, explanation }: AttemptResultProps) {
  const grading: GradingResult | null = result.grading;
  const resolvedReference = referenceAnswer ?? ("reference_answer" in result ? result.reference_answer : null);
  const resolvedExplanation = explanation ?? ("explanation" in result ? result.explanation : null);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Result
          {grading?.is_correct !== null && grading?.is_correct !== undefined && (
            <Badge variant={grading.is_correct ? "default" : "destructive"}>
              {grading.is_correct ? "Correct" : "Incorrect"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {grading && (
          <>
            <p>
              <span className="font-medium">Score:</span> {grading.score}/10
            </p>
            <p>
              <span className="font-medium">Feedback:</span> {grading.feedback}
            </p>
            {grading.key_points_missed.length > 0 && (
              <div>
                <p className="font-medium">Key points missed:</p>
                <ul className="list-inside list-disc">
                  {grading.key_points_missed.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        {resolvedReference && (
          <p>
            <span className="font-medium">Reference answer:</span> {resolvedReference}
          </p>
        )}
        {resolvedExplanation && (
          <p>
            <span className="font-medium">Explanation:</span> {resolvedExplanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
