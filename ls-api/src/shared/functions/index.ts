export function options(authToken) {
  return { headers: { Authorization: `Bearer ${authToken}` } };
}
