export function logout(redirectTo = '/login') {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('auth');
    } catch {}
    window.location.href = redirectTo; 
  }
}
