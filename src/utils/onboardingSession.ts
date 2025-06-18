
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getOnboardingSessionId = (): string => {
  let sessionId = localStorage.getItem('onboarding_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('onboarding_session_id', sessionId);
  }
  return sessionId;
};

export const clearOnboardingSession = (): void => {
  localStorage.removeItem('onboarding_session_id');
};
