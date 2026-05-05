import { FocusTimer } from "@/components/app/focus-timer";
import { requireUser } from "@/lib/auth";

export default async function FocusPage() {
  const user = await requireUser();

  return <FocusTimer userId={user.id} />;
}
