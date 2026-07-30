export const validationMessages = {
    required: "This field is required.",
    email: "Enter a valid email address.",
    passwordRequired: "Enter your password.",
    passwordMinimum: "Use at least 15 characters.",
    passwordConfirmation: "The passwords do not match.",
    nationalId: "Enter a valid 16-digit Rwanda National ID.",
    verificationCode: "Enter the complete verification code.",
    consent: "You must accept this requirement to continue.",
    imageType: "Choose a JPEG or PNG image.",
    imageSize: "Choose an image smaller than 5 MB.",
} as const;
