const permissions = [
  "accelerometer",
  "accessibility-events",
  "ambient-light-sensor",
  "background-sync",
  "camera",
  "clipboard-read",
  "clipboard-write",
  "geolocation",
  "gyroscope",
  "local-fonts",
  "magnetometer",
  "microphone",
  "midi",
  "notifications",
  "payment-handler",
  "persistent-storage",
  "push",
  "screen-wake-lock",
  "storage-access",
  "top-level-storage-access",
  "window-management",
];

async function checkPermissions() {
  for (const permission of permissions) {
    try {
      const result = await navigator.permissions.query({ name: permission });
      console.log(`${permission}: ${result.state}`);
    } catch (error) {
      console.log(`${permission}: Not supported (${error.message})`);
    }
  }
}

checkPermissions();

var result = await navigator.permissions.query({
  name: "accessibility-events",
});
var result = await navigator.permissions.query({
  name: "ambient-light-sensor",
});
var result = await navigator.permissions.query({
  name: "push",
});
var result = await navigator.permissions.query({
  name: "top-level-storage-access",
});
