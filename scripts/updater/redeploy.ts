import type { Redeploy } from "./report";

/**
 * Starts a new production build on Vercel through a Deploy Hook, so the JSON
 * bundles under /data/v1 are rebuilt with the new data (they are prerendered
 * at build time and do not pick up revalidation on Vercel).
 *
 * The hook URL is a secret: anyone who has it can start builds. It is never
 * logged or returned, not even in error details, because the details end up
 * in the publicly readable data_update_logs table. Never throws.
 */
export async function triggerRedeploy(
  hookUrl: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<{ result: Redeploy; detail?: string }> {
  if (!hookUrl) return { result: "not-configured" };
  let url: URL;
  try {
    url = new URL(hookUrl);
  } catch {
    return { result: "failed", detail: "the hook URL is not a valid URL" };
  }
  if (url.protocol !== "https:")
    return { result: "failed", detail: "the hook URL must use https" };
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok
      ? { result: "done" }
      : { result: "failed", detail: `HTTP ${response.status}` };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return {
      result: "failed",
      detail: timedOut
        ? "no answer within 15 s"
        : "the request did not go through",
    };
  }
}
