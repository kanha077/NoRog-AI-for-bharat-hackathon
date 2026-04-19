import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🩺 NoRog API Server v5.0 (Firebase) running on http://localhost:${PORT}`);
  console.log(`   Auth:      POST http://localhost:${PORT}/api/auth/register | login`);
  console.log(`   Profile:   GET/POST http://localhost:${PORT}/api/profile`);
  console.log(`   Symptoms:  POST http://localhost:${PORT}/api/symptoms/log`);
  console.log(`   AI:        POST http://localhost:${PORT}/api/ai/predict | whatif | seasonal`);
  console.log(`   Medicines: POST http://localhost:${PORT}/api/medicines/check`);
  console.log(`   Report:    GET  http://localhost:${PORT}/api/report/generate\n`);
});
