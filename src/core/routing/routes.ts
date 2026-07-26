import { actorAreas } from "@/config/actors";

export const routes = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  actors: actorAreas,
} as const;
