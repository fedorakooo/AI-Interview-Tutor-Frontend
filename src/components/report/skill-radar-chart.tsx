"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillScore } from "@/lib/types/interview";

interface SkillRadarChartProps {
  skillScores: SkillScore[];
}

export function SkillRadarChart({ skillScores }: SkillRadarChartProps) {
  const data = skillScores.map((s) => ({
    skill: s.skill,
    score: s.score,
    fullMark: 10,
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No skill scores available for this report.</p>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--color-chart-2)"
            fill="var(--color-chart-2)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
