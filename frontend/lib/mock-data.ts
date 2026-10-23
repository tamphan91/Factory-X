export function generateRealtimeData() {
  return {
    receiving: Math.floor(Math.random() * 50),
    putaway: Math.floor(Math.random() * 50),
    warehouse: Math.floor(Math.random() * 100),
    picking: Math.floor(Math.random() * 100),
    staging: Math.floor(Math.random() * 100),
    production: Math.floor(Math.random() * 100),
  };
}