function isIpv4(value: string) {
  const octets = value.split(".");
  return (
    octets.length === 4 &&
    octets.every((octet) => {
      if (!/^\d{1,3}$/.test(octet)) return false;
      const number = Number(octet);
      return number >= 0 && number <= 255;
    })
  );
}

export function getRequestIpv4(request: Request) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");

  if (!forwarded) return undefined;

  const candidate = forwarded
    .split(",")[0]
    ?.trim()
    .replace(/^::ffff:/i, "");

  return candidate && isIpv4(candidate) ? candidate : undefined;
}
