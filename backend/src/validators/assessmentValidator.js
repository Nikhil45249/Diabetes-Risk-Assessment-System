/**
 * Input validation for the assessment questionnaire.
 * Runs independently of any frontend validation.
 */

function validateAssessmentInput(body) {
  const errors = [];

  if (!body || typeof body !== "object") {
    return ["Request body must be a JSON object."];
  }

  // Coerce / sanitize numeric fields
  const age = typeof body.age === "string" ? parseInt(body.age, 10) : body.age;
  const height_cm = typeof body.height_cm === "string" ? parseFloat(body.height_cm) : body.height_cm;
  const weight_kg = typeof body.weight_kg === "string" ? parseFloat(body.weight_kg) : body.weight_kg;

  // --- age ---
  if (age == null || (typeof age === "number" && isNaN(age))) {
    errors.push("Age is required.");
  } else if (!Number.isInteger(age) || age < 1 || age > 120) {
    errors.push("Age must be an integer between 1 and 120.");
  } else {
    body.age = age;
  }

  // --- gender ---
  if (!body.gender) {
    errors.push("Gender is required.");
  } else if (!["Male", "Female"].includes(body.gender)) {
    errors.push("Gender must be 'Male' or 'Female'.");
  }

  // --- height_cm ---
  if (height_cm == null || (typeof height_cm === "number" && isNaN(height_cm))) {
    errors.push("Height is required.");
  } else if (height_cm < 50 || height_cm > 300) {
    errors.push("Height must be a number between 50 and 300 cm.");
  } else {
    body.height_cm = Number(height_cm);
  }

  // --- weight_kg ---
  if (weight_kg == null || (typeof weight_kg === "number" && isNaN(weight_kg))) {
    errors.push("Weight is required.");
  } else if (weight_kg < 10 || weight_kg > 400) {
    errors.push("Weight must be a number between 10 and 400 kg.");
  } else {
    body.weight_kg = Number(weight_kg);
  }

  // --- family_history ---
  if (body.family_history == null || body.family_history === "") {
    errors.push("Family history is required.");
  } else if (typeof body.family_history !== "boolean") {
    if (body.family_history === "true" || body.family_history === 1) body.family_history = true;
    else if (body.family_history === "false" || body.family_history === 0) body.family_history = false;
    else errors.push("Family history must be a boolean (Yes or No).");
  }

  // --- physical_activity ---
  if (!body.physical_activity) {
    errors.push("Physical activity level is required.");
  } else if (!["Low", "Medium", "High"].includes(body.physical_activity)) {
    errors.push("Physical activity must be 'Low', 'Medium', or 'High'.");
  }

  // --- boolean fields ---
  const boolFields = [
    { key: "smoking", label: "Smoking" },
    { key: "alcohol", label: "Alcohol" },
    { key: "healthy_diet", label: "Healthy diet" },
    { key: "frequent_thirst", label: "Frequent thirst" },
    { key: "frequent_urination", label: "Frequent urination" },
    { key: "fatigue", label: "Fatigue" },
    { key: "blurred_vision", label: "Blurred vision" },
    { key: "slow_wound_healing", label: "Slow wound healing" },
  ];

  for (const { key, label } of boolFields) {
    if (body[key] == null || body[key] === "") {
      errors.push(`${label} is required.`);
    } else if (typeof body[key] !== "boolean") {
      if (body[key] === "true" || body[key] === 1) body[key] = true;
      else if (body[key] === "false" || body[key] === 0) body[key] = false;
      else errors.push(`${label} must be a boolean (Yes or No).`);
    }
  }

  return errors;
}

module.exports = { validateAssessmentInput };
