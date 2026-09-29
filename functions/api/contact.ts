import { handleContact, type ContactEnv } from "../../lib/contact";
import { services } from "../../lib/services";
export function onRequest({ request, env }: { request: Request; env: ContactEnv }) {
  return handleContact(request, env, services.map(service => service.title));
}
