export const resolveRole = (mongoRole, clerkRole) => {
  const normalizedMongoRole =
    typeof mongoRole === "string" ? mongoRole.trim().toLowerCase() : "";
  const normalizedClerkRole =
    typeof clerkRole === "string" ? clerkRole.trim().toLowerCase() : "";

  if (normalizedClerkRole) return normalizedClerkRole;
  if (normalizedMongoRole) return normalizedMongoRole;
  return "customer";
};
