import { FocusTimerLoader } from "@/components/app/focus-timer-loader";
import { requireUser } from "@/lib/auth";

export default async function FocusPage() {
  const user = await requireUser();

  return <FocusTimerLoader userId={user.id} />;
}
