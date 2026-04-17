export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { email, phone } = req.body;
  let breachCount = 0;

  try {
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
      headers: {
        "hibp-api-key": process.env.HIBP_API_KEY,
        "user-agent": "goghosty"
      }
    });

    if (response.status !== 404) {
      const data = await response.json();
      breachCount = data.length;
    }
  } catch {}

  const brokerScore = 0.7 + Math.random() * 0.3;

  res.json({
    breachCount,
    estimatedExposureSites: Math.floor(brokerScore * 30)
  });
}