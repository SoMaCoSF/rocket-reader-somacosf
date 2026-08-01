/** UUIDv8 for RRS evals / explainers */
let seq = 0;
export function uuidv8(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, "0").slice(-12);
  seq = (seq + 1) & 0xfff;
  const verSeq = ((0x8 << 12) | seq).toString(16).padStart(4, "0");
  const rand = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(rand);
  else for (let i = 0; i < 8; i++) rand[i] = Math.floor(Math.random() * 256);
  const randHex = Array.from(rand).map((b) => b.toString(16).padStart(2, "0")).join("");
  const variantByte = (parseInt(randHex.slice(0, 2), 16) & 0x3f) | 0x80;
  const variantHex = variantByte.toString(16).padStart(2, "0");
  return [timeHex.slice(0, 8), timeHex.slice(8, 12), verSeq, variantHex + randHex.slice(2, 4), randHex.slice(4, 16)].join("-");
}
export function isUUIDv8(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
