export const assignRisk = (symptoms, vitals) => {
  const s = symptoms.toLowerCase();
  
  const isHighRisk = 
    s.includes("chest pain") || 
    s.includes("breathing difficulty") || 
    s.includes("unconscious") || 
    s.includes("stroke") ||
    vitals.oxygen < 92 ||
    vitals.heartRate > 120 || 
    vitals.heartRate < 50;

  const isMediumRisk = 
    !isHighRisk && (
      s.includes("fever") || 
      s.includes("nausea") || 
      s.includes("dizzy") ||
      vitals.temperature > 100 ||
      vitals.bloodPressure.split('/')[0] > 140
    );

  if (isHighRisk) return { level: "HIGH", action: "Immediate attention required" };
  if (isMediumRisk) return { level: "MEDIUM", action: "See doctor within 15 mins" };
  return { level: "LOW", action: "Normal queue wait time" };
};

export const predictDiseases = (symptoms) => {
  const s = symptoms.toLowerCase();
  let predictions = [];

  if (s.includes("chest pain")) predictions.push({ name: "Myocardial Infarction", probability: 85 });
  if (s.includes("breathing")) predictions.push({ name: "Asthma Exacerbation", probability: 70 });
  if (s.includes("fever")) predictions.push({ name: "Viral Infection", probability: 90 });
  
  if (predictions.length === 0) {
    predictions.push({ name: "General Observation", probability: 50 });
  }

  return predictions;
};
