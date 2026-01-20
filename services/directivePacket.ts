
export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function buildDirectiveAuditHash(dir: any): Promise<string> {
  const payload = JSON.stringify({
    id: dir.id,
    title: dir.title,
    category: dir.category,
    packet: dir.packet ?? null,
    heroLocation: dir.heroLocation ?? null,
    proofImagePresent: Boolean(dir.proofImageUrl),
    ts: Date.now(),
  });
  return sha256Hex(payload);
}
