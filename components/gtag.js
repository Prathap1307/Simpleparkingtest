"use client";

export function triggerConversion() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17474395596/abc123xyz", // replace with your specific conversion ID
      value: 10.0,
      currency: "USD",
    });
  }
}
