import { NextResponse, type NextRequest } from "next/server";

import { appendVaryAccept, negotiateAgentAccess } from "./app/agent-access";

export function proxy(request: NextRequest) {
  const decision = negotiateAgentAccess(request);

  if (decision.kind === "respond") {
    return decision.response;
  }

  const response = NextResponse.next();
  appendVaryAccept(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/|_vercel/).*)"],
};
