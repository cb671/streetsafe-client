export const formatSecs = (sec) => {
  sec = Math.floor(sec);

  const units = [
    { label: "d",    value: 60 * 60 * 24 },
    { label: "h",   value: 60 * 60 },
    { label: "m", value: 60 },
    { label: "s", value: 1 },
  ];

  const parts = [];
  for (const u of units) {
    const amount = Math.floor(sec / u.value);
    if (amount > 0) {
      parts.push({
        unit: u.label,
        value: amount
      });
      sec -= amount * u.value;
    }
  }

  return <div className={"flex gap-1"}>
    {parts.length ? parts.map(p =>
      <div><span className={"font-bold"}>{p.value}</span>{p.unit}</div>
    ) : <span><span className={"font-bold"}>0</span>s</span>}
  </div>
}
