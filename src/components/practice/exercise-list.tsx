import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Exercise } from "@/lib/types/practice";
import { cn } from "@/lib/utils";

interface ExerciseListProps {
  planId: string;
  exercises: Exercise[];
}

export function ExerciseList({ planId, exercises }: ExerciseListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Est. time</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((exercise) => (
          <TableRow key={exercise.exercise_id}>
            <TableCell>
              <div>
                <p className="font-medium">{exercise.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{exercise.prompt}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{exercise.type}</Badge>
            </TableCell>
            <TableCell className="capitalize">{exercise.difficulty}</TableCell>
            <TableCell>{exercise.estimated_minutes} min</TableCell>
            <TableCell className="text-right">
              <Link
                href={`/practice/${planId}/${exercise.exercise_id}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
              >
                Start
                <ChevronRight className="size-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
