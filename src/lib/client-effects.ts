export async function getBrowserSupabase() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

export async function notifyError(message: string) {
  const { toast } = await import("sonner");
  toast.error(message);
}

export async function notifySuccess(message: string) {
  const { toast } = await import("sonner");
  toast.success(message);
}
