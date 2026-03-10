exports.handler = async function () {
  const now = new Date();

  function minutesFromNow(minutes) {
    const d = new Date(now.getTime() + minutes * 60000);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");

    return {
      time: `${h}:${m}`,
      minutes
    };
  }

  const a1 = [3, 15, 27].map((m) => ({
    destination: "Chartres",
    ...minutesFromNow(m)
  }));

  const a2 = [6, 18, 31].map((m) => ({
    destination: "Lucé",
    ...minutesFromNow(m)
  }));

  const six1 = [5, 18, 32].map((m) => ({
    destination: "Lucé",
    ...minutesFromNow(m)
  }));

  const six2 = [8, 22, 36].map((m) => ({
    destination: "Chartres",
    ...minutesFromNow(m)
  }));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify({
      a1,
      a2,
      six1,
      six2
    })
  };
};