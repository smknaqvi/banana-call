import client from "../../../client";

export function requestFn({ image }) {
  return client.post("/", { image });
}
