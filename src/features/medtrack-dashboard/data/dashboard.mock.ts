import type { AdminDashboardData } from "@/features/medtrack-dashboard/domain/dashboard";

// Données fictives reproduisant les valeurs visibles dans l'export Figma fourni.
export const adminDashboardMock: AdminDashboardData = {
  metrics: [
    { id: "active-users", label: "Utilisateurs actifs", value: "2,847", trend: "+12%" },
    { id: "institutions", label: "Institutions", value: "37" },
    { id: "pending-admissions", label: "Admissions en attente", value: "234" },
    { id: "monthly-revenue", label: "Revenus du mois", value: "892K FC", trend: "+8%" },
  ],
  registrations: [
    { label: "Lun", value: 110 },
    { label: "Mar", value: 140 },
    { label: "Mer", value: 170 },
    { label: "Jeu", value: 130 },
    { label: "Ven", value: 190 },
    { label: "Sam", value: 160 },
    { label: "Dim", value: 210 },
  ],
  averageRegistrations: 128,
  registrationTrend: "+12% vs période précédente",
  activities: [
    { id: "activity-1", type: "institution", title: "Nouvelle institution créée", description: "Hôpital Ngaliema - ajoutée par Dr. Admin", occurredAt: "Il y a 2h" },
    { id: "activity-2", type: "user", title: "Utilisateur désactivé", description: "Dr. M. Kalala - accès suspendu temporairement", occurredAt: "Il y a 5h" },
    { id: "activity-3", type: "permission", title: "Permission modifiée", description: "Rôle « Admissions » - accès étendu aux rapports", occurredAt: "Hier" },
  ],
  institutions: [
    { uuid: "mock-institution-1", name: "Hôpital Ngaliema", value: 42 },
    { uuid: "mock-institution-2", name: "Clinique Kalembe", value: 31 },
    { uuid: "mock-institution-3", name: "Centre de santé", value: 26 },
    { uuid: "mock-institution-4", name: "Hôpital Kinkole", value: 19 },
    { uuid: "mock-institution-5", name: "Autres", value: 12 },
  ],
  alerts: [
    { id: "alert-1", level: "danger", title: "2 tentatives de connexion échouées", description: "IP 41.79.12.34 - compte Dr. Admin", occurredAt: "Il y a 10 min" },
    { id: "alert-2", level: "success", title: "Backup automatique effectué", description: "Base de données - sauvegarde quotidienne", occurredAt: "Aujourd'hui 02:15" },
    { id: "alert-3", level: "warning", title: "Nouveau rapport disponible", description: "Rapport mensuel - admissions & revenus", occurredAt: "Hier" },
  ],
};