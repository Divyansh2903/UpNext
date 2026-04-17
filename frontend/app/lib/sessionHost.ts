type ParticipantForHostDetection = {
  id: string;
  name: string;
  joinedAt?: string;
};

function normalizeName(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export function getHostParticipantId(participants: ParticipantForHostDetection[]) {
  if (!participants.length) return null;

  const sorted = [...participants].sort((a, b) => {
    const aTime = new Date(a.joinedAt ?? 0).getTime();
    const bTime = new Date(b.joinedAt ?? 0).getTime();
    return aTime - bTime;
  });

  return sorted[0]?.id ?? null;
}

export function isHostParticipant(
  participant: ParticipantForHostDetection,
  hostParticipantId: string | null,
  hostName?: string,
) {
  if (hostParticipantId && participant.id === hostParticipantId) {
    return true;
  }

  const normalizedName = normalizeName(participant.name);
  const normalizedHostName = normalizeName(hostName);
  return normalizedName === "host" || (normalizedHostName !== "" && normalizedName === normalizedHostName);
}
