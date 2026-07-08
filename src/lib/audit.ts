import prisma from "./prisma";

export async function createAuditLog(
  action: string,
  details: string,
  userId?: string | null,
  ipAddress?: string | null
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        userId: userId || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    // Fail-safe: log to console if database writing fails
    console.error(`[AUDIT FAIL] Action: ${action} | Details: ${details} | User: ${userId}`, err);
  }
}
