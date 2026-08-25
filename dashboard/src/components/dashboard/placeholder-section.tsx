import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";

type PlannedFeature = {
  title: string;
  description: string;
};

export function PlaceholderSection({
  icon,
  title,
  description,
  plannedFeatures,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  plannedFeatures: PlannedFeature[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <PageHeader icon={icon} title={title} description={description} />
        <Badge variant="secondary" className="w-fit">
          Próximamente
        </Badge>
      </div>

      {/* Placeholder metric row: communicates the eventual layout without real data. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardTitle>
                <Skeleton className="h-7 w-16" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades planeadas</CardTitle>
          <CardDescription>
            Esta sección todavía no está conectada a datos reales. Aquí es
            donde vivirá cada funcionalidad una vez implementada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-4 sm:grid-cols-2">
            {plannedFeatures.map((feature) => (
              <li
                key={feature.title}
                className="rounded-lg border bg-muted/30 p-4"
              >
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
