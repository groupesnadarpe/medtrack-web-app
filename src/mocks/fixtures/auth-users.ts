/**
 * Fixtures utilisateurs (service auth-v1).
 *
 * La forme reproduit `FrontendAuthUser` de l'OpenAPI Medtrack :
 * uuid, public_id (matricule), display_name, first_name, last_name, email, phone,
 * status, roles[], permissions[], role_assignments[] et timestamps ISO.
 *
 * Deux comptes sont fournis par espace acteur pour pouvoir tester la redirection par rôle.
 */
import type { ActorKey } from "@/config/actors";

export type MockRoleAssignment = {
  uuid: string;
  role_code: string;
  role_name: string;
  scope_type: "GLOBAL" | "UNIVERSITY" | "HOSPITAL" | "DEPARTMENT" | "MEDICAL_ORDER" | "MINISTRY";
  scope_uuid: string | null;
  scope_name: string | null;
};

export type MockAuthUser = {
  uuid: string;
  public_id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  email_verified_at: string | null;
  phone_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  roles: string[];
  permissions: string[];
  role_assignments: MockRoleAssignment[];
};

/** Compte de démonstration : identifiants acceptés par le mock d'authentification. */
export type MockAccount = {
  user: MockAuthUser;
  password: string;
  actor: ActorKey;
  actorLabel: string;
};

const CREATED_AT = "2024-09-02T08:15:00+00:00";
const UPDATED_AT = "2025-01-14T10:42:00+00:00";

function buildUser(user: Omit<MockAuthUser, "status" | "created_at" | "updated_at">): MockAuthUser {
  return { status: "ACTIVE", created_at: CREATED_AT, updated_at: UPDATED_AT, ...user };
}

export const MOCK_PASSWORD = "Medtrack@2024";

export const mockAccounts: MockAccount[] = [
  {
    actor: "medtrack",
    actorLabel: "Admin Medtrack",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "9c1f0a52-4b7e-4d33-9a11-6f0b8d2c1101",
      public_id: "MT-ADM-0001",
      display_name: "Grâce Mwamba",
      first_name: "Grâce",
      last_name: "Mwamba",
      email: "grace.mwamba@medtrack.cd",
      phone: "+243810000101",
      email_verified_at: "2024-09-02T08:20:00+00:00",
      phone_verified_at: "2024-09-02T08:22:00+00:00",
      last_login_at: "2025-01-14T09:10:00+00:00",
      roles: ["SUPER_ADMIN"],
      permissions: ["*"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000101",
          role_code: "SUPER_ADMIN",
          role_name: "Administrateur global",
          scope_type: "GLOBAL",
          scope_uuid: null,
          scope_name: null,
        },
      ],
    }),
  },
  {
    actor: "medtrack",
    actorLabel: "Admin Medtrack",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "9c1f0a52-4b7e-4d33-9a11-6f0b8d2c1102",
      public_id: "MT-ADM-0002",
      display_name: "Patrick Ilunga",
      first_name: "Patrick",
      last_name: "Ilunga",
      email: "patrick.ilunga@medtrack.cd",
      phone: "+243810000102",
      email_verified_at: "2024-09-05T11:00:00+00:00",
      phone_verified_at: null,
      last_login_at: "2025-01-13T15:48:00+00:00",
      roles: ["MEDTRACK_ADMIN"],
      permissions: ["users.read", "users.write", "audit.read", "institutions.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000102",
          role_code: "MEDTRACK_ADMIN",
          role_name: "Administrateur interne Medtrack",
          scope_type: "GLOBAL",
          scope_uuid: null,
          scope_name: null,
        },
      ],
    }),
  },
  {
    actor: "university",
    actorLabel: "Université",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "2f6d9b18-77c3-4a0e-9d55-3ab4c7e51201",
      public_id: "UNIKIN-ADM-0114",
      display_name: "Dr. Josée Kabongo",
      first_name: "Josée",
      last_name: "Kabongo",
      email: "josee.kabongo@unikin.ac.cd",
      phone: "+243811000201",
      email_verified_at: "2024-09-10T07:30:00+00:00",
      phone_verified_at: "2024-09-10T07:35:00+00:00",
      last_login_at: "2025-01-14T06:55:00+00:00",
      roles: ["UNIVERSITY_ADMIN"],
      permissions: ["students.read", "students.write", "promotions.read", "internships.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000201",
          role_code: "UNIVERSITY_ADMIN",
          role_name: "Administrateur université",
          scope_type: "UNIVERSITY",
          scope_uuid: "b1c2d3e4-1111-4000-8000-000000000001",
          scope_name: "Université de Kinshasa",
        },
      ],
    }),
  },
  {
    actor: "university",
    actorLabel: "Université",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "2f6d9b18-77c3-4a0e-9d55-3ab4c7e51202",
      public_id: "UNILU-CRD-0087",
      display_name: "Espérance Tshibangu",
      first_name: "Espérance",
      last_name: "Tshibangu",
      email: "esperance.tshibangu@unilu.ac.cd",
      phone: "+243811000202",
      email_verified_at: "2024-10-01T09:12:00+00:00",
      phone_verified_at: null,
      last_login_at: "2025-01-12T13:20:00+00:00",
      roles: ["INTERNSHIP_COORDINATOR"],
      permissions: ["internships.read", "internships.write", "admissions.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000202",
          role_code: "INTERNSHIP_COORDINATOR",
          role_name: "Coordinateur des stages",
          scope_type: "UNIVERSITY",
          scope_uuid: "b1c2d3e4-1111-4000-8000-000000000002",
          scope_name: "Université de Lubumbashi",
        },
      ],
    }),
  },
  {
    actor: "hospital",
    actorLabel: "Hôpital",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "7ad3c410-58ef-4c8a-8b21-9c5e2f7a1301",
      public_id: "CUK-ADM-0042",
      display_name: "Dr. Michel Lumbala",
      first_name: "Michel",
      last_name: "Lumbala",
      email: "michel.lumbala@cliniques-unikin.cd",
      phone: "+243812000301",
      email_verified_at: "2024-09-18T08:00:00+00:00",
      phone_verified_at: "2024-09-18T08:04:00+00:00",
      last_login_at: "2025-01-14T07:41:00+00:00",
      roles: ["HOSPITAL_ADMIN"],
      permissions: ["admissions.read", "admissions.write", "rotations.write", "attendance.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000301",
          role_code: "HOSPITAL_ADMIN",
          role_name: "Administrateur hôpital",
          scope_type: "HOSPITAL",
          scope_uuid: "c1d2e3f4-2222-4000-8000-000000000001",
          scope_name: "Cliniques Universitaires de Kinshasa",
        },
      ],
    }),
  },
  {
    actor: "hospital",
    actorLabel: "Hôpital",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "7ad3c410-58ef-4c8a-8b21-9c5e2f7a1302",
      public_id: "HGRP-SUP-0219",
      display_name: "Dr. Nadine Mbala",
      first_name: "Nadine",
      last_name: "Mbala",
      email: "nadine.mbala@hgr-panzi.cd",
      phone: "+243812000302",
      email_verified_at: "2024-11-04T10:25:00+00:00",
      phone_verified_at: "2024-11-04T10:29:00+00:00",
      last_login_at: "2025-01-13T17:05:00+00:00",
      roles: ["INTERNSHIP_SUPERVISOR"],
      permissions: ["attendance.write", "assessments.write", "students.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000302",
          role_code: "INTERNSHIP_SUPERVISOR",
          role_name: "Encadreur de stage",
          scope_type: "DEPARTMENT",
          scope_uuid: "c1d2e3f4-2222-4000-8000-000000000002",
          scope_name: "HGR Panzi — Chirurgie",
        },
      ],
    }),
  },
  {
    actor: "ordre-de-medecin",
    actorLabel: "Ordre des médecins",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "4e8b1d90-6c2f-4711-8f3d-1de9a4b81401",
      public_id: "ONM-ADM-0007",
      display_name: "Dr. Alphonse Kayembe",
      first_name: "Alphonse",
      last_name: "Kayembe",
      email: "alphonse.kayembe@ordremedecins.cd",
      phone: "+243813000401",
      email_verified_at: "2024-09-25T12:00:00+00:00",
      phone_verified_at: null,
      last_login_at: "2025-01-10T08:30:00+00:00",
      roles: ["MEDICAL_ORDER_ADMIN"],
      permissions: ["validations.read", "validations.write", "compliance.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000401",
          role_code: "MEDICAL_ORDER_ADMIN",
          role_name: "Administrateur Ordre des médecins",
          scope_type: "MEDICAL_ORDER",
          scope_uuid: "d1e2f3a4-3333-4000-8000-000000000001",
          scope_name: "Ordre National des Médecins",
        },
      ],
    }),
  },
  {
    actor: "ordre-de-medecin",
    actorLabel: "Ordre des médecins",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "4e8b1d90-6c2f-4711-8f3d-1de9a4b81402",
      public_id: "ONM-AGT-0031",
      display_name: "Dr. Sylvie Nkulu",
      first_name: "Sylvie",
      last_name: "Nkulu",
      email: "sylvie.nkulu@ordremedecins.cd",
      phone: "+243813000402",
      email_verified_at: "2024-12-02T09:45:00+00:00",
      phone_verified_at: "2024-12-02T09:50:00+00:00",
      last_login_at: "2025-01-09T14:15:00+00:00",
      roles: ["MEDICAL_ORDER_REVIEWER"],
      permissions: ["validations.read", "compliance.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000402",
          role_code: "MEDICAL_ORDER_REVIEWER",
          role_name: "Réviseur de conformité",
          scope_type: "MEDICAL_ORDER",
          scope_uuid: "d1e2f3a4-3333-4000-8000-000000000001",
          scope_name: "Ordre National des Médecins",
        },
      ],
    }),
  },
  {
    actor: "ministere",
    actorLabel: "Ministère",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "0b7c6e33-91af-4d52-bc84-25f7a1c91501",
      public_id: "MSP-AGT-0012",
      display_name: "Jean-Claude Mukendi",
      first_name: "Jean-Claude",
      last_name: "Mukendi",
      email: "jc.mukendi@sante.gouv.cd",
      phone: "+243814000501",
      email_verified_at: "2024-10-15T07:05:00+00:00",
      phone_verified_at: "2024-10-15T07:09:00+00:00",
      last_login_at: "2025-01-11T11:00:00+00:00",
      roles: ["MINISTRY_AGENT"],
      permissions: ["reports.read", "statistics.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000501",
          role_code: "MINISTRY_AGENT",
          role_name: "Agent du ministère",
          scope_type: "MINISTRY",
          scope_uuid: "e1f2a3b4-4444-4000-8000-000000000001",
          scope_name: "Ministère de la Santé Publique",
        },
      ],
    }),
  },
  {
    actor: "ministere",
    actorLabel: "Ministère",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "0b7c6e33-91af-4d52-bc84-25f7a1c91502",
      public_id: "MSP-SUP-0004",
      display_name: "Charlotte Bemba",
      first_name: "Charlotte",
      last_name: "Bemba",
      email: "charlotte.bemba@sante.gouv.cd",
      phone: "+243814000502",
      email_verified_at: "2024-10-20T13:35:00+00:00",
      phone_verified_at: null,
      last_login_at: "2025-01-08T16:22:00+00:00",
      roles: ["MINISTRY_SUPERVISOR"],
      permissions: ["reports.read", "statistics.read", "institutions.read"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000502",
          role_code: "MINISTRY_SUPERVISOR",
          role_name: "Superviseur national",
          scope_type: "MINISTRY",
          scope_uuid: "e1f2a3b4-4444-4000-8000-000000000001",
          scope_name: "Ministère de la Santé Publique",
        },
      ],
    }),
  },
  {
    actor: "student",
    actorLabel: "Étudiant",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "5d2a8f77-3e94-4b60-9c18-7ba3e5d21601",
      public_id: "UNIKIN-MED-2021-0453",
      display_name: "Rachel Mbuyi",
      first_name: "Rachel",
      last_name: "Mbuyi",
      email: "rachel.mbuyi@etu.unikin.ac.cd",
      phone: "+243815000601",
      email_verified_at: "2024-09-30T10:10:00+00:00",
      phone_verified_at: "2024-09-30T10:14:00+00:00",
      last_login_at: "2025-01-14T05:48:00+00:00",
      roles: ["STUDENT"],
      permissions: ["internship.self.read", "attendance.self.write"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000601",
          role_code: "STUDENT",
          role_name: "Étudiant",
          scope_type: "UNIVERSITY",
          scope_uuid: "b1c2d3e4-1111-4000-8000-000000000001",
          scope_name: "Université de Kinshasa",
        },
      ],
    }),
  },
  {
    actor: "student",
    actorLabel: "Étudiant",
    password: MOCK_PASSWORD,
    user: buildUser({
      uuid: "5d2a8f77-3e94-4b60-9c18-7ba3e5d21602",
      public_id: "UNILU-MED-2020-0198",
      display_name: "Dieudonné Kasongo",
      first_name: "Dieudonné",
      last_name: "Kasongo",
      email: "dieudonne.kasongo@etu.unilu.ac.cd",
      phone: "+243815000602",
      email_verified_at: null,
      phone_verified_at: "2024-10-05T08:00:00+00:00",
      last_login_at: "2025-01-13T19:31:00+00:00",
      roles: ["STUDENT"],
      permissions: ["internship.self.read", "attendance.self.write"],
      role_assignments: [
        {
          uuid: "1a0e7f4c-0000-4000-8000-000000000602",
          role_code: "STUDENT",
          role_name: "Étudiant",
          scope_type: "UNIVERSITY",
          scope_uuid: "b1c2d3e4-1111-4000-8000-000000000002",
          scope_name: "Université de Lubumbashi",
        },
      ],
    }),
  },
];

export const mockAuthUsers: MockAuthUser[] = mockAccounts.map((account) => account.user);

/** Le back-end accepte matricule, email vérifié ou téléphone vérifié sur le champ `login`. */
export function findMockAccountByLogin(login: string): MockAccount | null {
  const needle = login.trim().toLowerCase();

  if (!needle) {
    return null;
  }

  return (
    mockAccounts.find((account) => {
      const { public_id, email, phone } = account.user;

      return (
        public_id.toLowerCase() === needle ||
        email.toLowerCase() === needle ||
        phone.replace(/\s/g, "") === needle.replace(/\s/g, "")
      );
    }) ?? null
  );
}
