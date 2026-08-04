export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  trend?: string;
};

export type DashboardActivity = {
  id: string;
  type: "institution" | "user" | "permission";
  title: string;
  description: string;
  occurredAt: string;
};

export type DashboardAlert = {
  id: string;
  level: "danger" | "success" | "warning";
  title: string;
  description: string;
  occurredAt: string;
};

// Projection utilisée par l'UI ; le futur repository API devra retourner exactement ce contrat.
export type AdminDashboardData = {
  metrics: DashboardMetric[];
  registrations: Array<{ label: string; value: number }>;
  averageRegistrations: number;
  registrationTrend: string;
  activities: DashboardActivity[];
  institutions: Array<{ uuid: string; name: string; value: number }>;
  alerts: DashboardAlert[];
};