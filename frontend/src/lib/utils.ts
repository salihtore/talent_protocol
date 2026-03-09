// Cüzdan adresini kısaltmak için (Örn: 0x1234...5678)
export function formatAddress(address: string | null | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}