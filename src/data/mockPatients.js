export const initialMockPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    symptoms: "Severe chest pain radiating to left arm",
    vitals: { bp: "150/90", hr: 110, temp: 98.6, o2: 95 },
    risk: "HIGH",
    WaitTimeMinutes: 5,
    timestamp: Date.now() - 5 * 60000,
    status: "WAITING"
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    symptoms: "High fever and persistent cough",
    vitals: { bp: "120/80", hr: 90, temp: 102.1, o2: 98 },
    risk: "MEDIUM",
    WaitTimeMinutes: 12,
    timestamp: Date.now() - 12 * 60000,
    status: "WAITING"
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 60,
    gender: "Male",
    symptoms: "Minor ankle sprain",
    vitals: { bp: "130/85", hr: 75, temp: 98.4, o2: 99 },
    risk: "LOW",
    WaitTimeMinutes: 25,
    timestamp: Date.now() - 25 * 60000,
    status: "WAITING"
  }
];

export const getPatients = () => {
  const saved = localStorage.getItem("triage_patients");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("triage_patients", JSON.stringify(initialMockPatients));
  return initialMockPatients;
};

export const savePatients = (patients) => {
  localStorage.setItem("triage_patients", JSON.stringify(patients));
};

export const addPatient = (patient) => {
  const patients = getPatients();
  const newPatient = {
    ...patient,
    id: Date.now(),
    timestamp: Date.now(),
    WaitTimeMinutes: 0,
    status: "WAITING"
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};
