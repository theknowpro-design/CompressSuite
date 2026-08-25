let payload = null;

export function setTransferPayload(nextPayload) {
  payload = nextPayload;
}

export function getTransferPayload() {
  return payload;
}
