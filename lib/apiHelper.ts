import apiRequest from "./apiRequest";

export async function login(credentials: { email: string; password: string }) {
  return apiRequest("POST", "/auth/login", credentials);
}

export async function getDashboard(token?: string) {
  return apiRequest("GET", "/review/dashboard", {}, token);
}

export async function updateReviewStatus(
  reviewId: number,
  status: "PUBLISHED",
  token?: string
) {
  return apiRequest("POST", "/review/status", { reviewId, status }, token);
}

export async function fetchPublishedReviews(token?: string) {
  return apiRequest("GET", "/review", { status: "PUBLISHED" }, token);
}

export async function fetchHostawayReviews(token?: string) {
  return apiRequest("GET", "/review/hostaway", { mock: 1 }, token);
}