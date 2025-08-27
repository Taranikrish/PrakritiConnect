// Validation utility functions for form validation

export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    message: "Please enter a valid phone number"
  },
  name: {
    pattern: /^[a-zA-Z\s]{2,}$/,
    message: "Name must be at least 2 characters and contain only letters and spaces"
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: "Please enter a valid URL"
  },
  number: {
    pattern: /^\d+$/,
    message: "Please enter a valid number"
  },
  eventName: {
    pattern: /^.{3,}$/,
    message: "Event name must be at least 3 characters"
  },
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: "Please enter a valid date in YYYY-MM-DD format"
  },
  startDate: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: "Please enter a valid start date in YYYY-MM-DD format"
  },
  endDate: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: "Please enter a valid end date in YYYY-MM-DD format"
  }
};

export const validateField = (fieldName, value) => {
  const rule = validationRules[fieldName];
  if (!rule) return { isValid: true, message: "" };
  
  if (!value.trim()) {
    return { isValid: false, message: "This field is required" };
  }
  
  if (!rule.pattern.test(value)) {
    return { isValid: false, message: rule.message };
  }
  
  return { isValid: true, message: "" };
};

export const validateForm = (formData, fieldsToValidate) => {
  const errors = {};
  let isValid = true;

  fieldsToValidate.forEach(field => {
    const validation = validateField(field, formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });

  // Custom validation for endDate being after startDate
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      errors.endDate = "End date must be after start date";
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Specific validation functions for different form types
export const validateLoginForm = (formData) => {
  return validateForm(formData, ['email', 'password']);
};

export const validateSignupForm = (formData) => {
  return validateForm(formData, ['fullName', 'email', 'password']);
};

export const validateOrganizerForm = (formData) => {
  return validateForm(formData, ['fullName', 'email', 'password', 'phone', 'orgName']);
};

export const validateEventForm = (formData) => {
  return validateForm(formData, ['eventName', 'startDate', 'endDate', 'maxParticipants']);
};
