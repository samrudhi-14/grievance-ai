"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

interface RegisterFormState {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

interface RegisteredUserSummary {
  fullName: string;
  email: string;
  mobile: string;
  registeredAt: string;
}

const INITIAL_FORM_STATE: RegisterFormState = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUserSummary | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateField = (
    name: keyof RegisterFormState,
    value: string | boolean,
    currentPassword = formData.password
  ): string | undefined => {
    switch (name) {
      case "fullName": {
        const val = (value as string).trim();
        if (!val) {
          return "Full Name is required";
        }
        if (val.length < 2) {
          return "Full Name must contain at least 2 characters";
        }
        return undefined;
      }
      case "email": {
        const val = (value as string).trim();
        if (!val) {
          return "Email address is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return "Please enter a valid email address (e.g., name@example.com)";
        }
        return undefined;
      }
      case "mobile": {
        const val = (value as string).trim();
        if (!val) {
          return "Mobile number is required";
        }
        const digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
          return "Mobile number must be exactly 10 digits";
        }
        return undefined;
      }
      case "password": {
        const val = value as string;
        if (!val) {
          return "Password is required";
        }
        if (val.length < 8) {
          return "Password must be at least 8 characters long";
        }
        return undefined;
      }
      case "confirmPassword": {
        const val = value as string;
        if (!val) {
          return "Please confirm your password";
        }
        if (val !== currentPassword) {
          return "Passwords do not match";
        }
        return undefined;
      }
      case "agreeTerms": {
        if (!value) {
          return "You must accept the Terms and Conditions to proceed";
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: inputValue };

      // Re-validate field if already touched
      if (touched[name]) {
        const err = validateField(
          name as keyof RegisterFormState,
          inputValue,
          name === "password" ? (inputValue as string) : updated.password
        );
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err }));
      }

      // If password is updated and confirmPassword was touched, recheck match
      if (name === "password" && touched.confirmPassword) {
        const confirmErr = validateField(
          "confirmPassword",
          updated.confirmPassword,
          inputValue as string
        );
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmErr }));
      }

      return updated;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof RegisterFormState, inputValue);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const allTouched = {
      fullName: true,
      email: true,
      mobile: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    };
    setTouched(allTouched);

    const fullNameErr = validateField("fullName", formData.fullName);
    const emailErr = validateField("email", formData.email);
    const mobileErr = validateField("mobile", formData.mobile);
    const passwordErr = validateField("password", formData.password);
    const confirmPasswordErr = validateField(
      "confirmPassword",
      formData.confirmPassword,
      formData.password
    );
    const termsErr = validateField("agreeTerms", formData.agreeTerms);

    const currentErrors: RegisterFormErrors = {
      fullName: fullNameErr,
      email: emailErr,
      mobile: mobileErr,
      password: passwordErr,
      confirmPassword: confirmPasswordErr,
      agreeTerms: termsErr,
    };

    setErrors(currentErrors);

    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(
          data.error || "Registration failed. Please check your information."
        );
        setIsSubmitting(false);
        return;
      }

      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setRegisteredUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        registeredAt: formattedDate,
      });

      setIsSubmitting(false);
    } catch {
      setApiError(
        "Network or server error. Please ensure your development server and XAMPP MySQL are running."
      );
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setRegisteredUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-gray-50 to-white text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Navigation */}
      <header className="max-w-xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Citizen Registration
          </span>
          <span className="text-xs text-gray-500">GrievanceAI</span>
        </div>
      </header>

      {/* Main Form or Success Container */}
      <main className="max-w-xl mx-auto">
        {registeredUser ? (
          /* ================= SUCCESS CONFIRMATION VIEW ================= */
          <section
            aria-live="polite"
            className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200/80 p-6 sm:p-10 transition-all text-center"
          >
            {/* Green Checkmark Badge */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 ring-8 ring-green-50">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded-full mb-2">
              Validation Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Registration Successful!
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Your account details have been validated successfully for the
              GrievanceAI portal.
            </p>

            {/* Confirmation Banner */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-left text-xs">
              <div className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-blue-950">
                    Citizen Account Created Successfully:
                  </p>
                  <p className="text-blue-800 mt-0.5 leading-relaxed">
                    Your profile has been created and securely saved. You can now
                    proceed to login to lodge grievances and track their status.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
            <div className="mt-6 text-left border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Registered Account Profile
              </h2>

              <dl className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 text-sm space-y-2.5">
                <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                  <dt className="text-xs text-gray-500 uppercase font-medium">
                    Full Name
                  </dt>
                  <dd className="font-semibold text-gray-900">
                    {registeredUser.fullName}
                  </dd>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                  <dt className="text-xs text-gray-500 uppercase font-medium">
                    Email Address
                  </dt>
                  <dd className="font-semibold text-gray-900">
                    {registeredUser.email}
                  </dd>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                  <dt className="text-xs text-gray-500 uppercase font-medium">
                    Mobile Number
                  </dt>
                  <dd className="font-semibold text-gray-900">
                    +91 {registeredUser.mobile}
                  </dd>
                </div>

                <div className="flex justify-between items-center pt-0.5">
                  <dt className="text-xs text-gray-500 uppercase font-medium">
                    Timestamp
                  </dt>
                  <dd className="text-xs text-gray-600 font-mono">
                    {registeredUser.registeredAt}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                <span>Proceed to Login</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
              >
                Register Another Account
              </button>
            </div>
          </section>
        ) : (
          /* ================= REGISTRATION FORM VIEW ================= */
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200/80 p-6 sm:p-10">
            {/* Header / Intro */}
            <div className="border-b border-gray-100 pb-6 mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Create Citizen Profile
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Register for GrievanceAI
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign up to lodge grievances, track complaints in real time, and
                receive automated resolution updates.
              </p>
            </div>

            {apiError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
              >
                <svg
                  className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-rose-900">Registration Notice</p>
                  <p className="mt-0.5">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Field 1: Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                  placeholder="e.g., Rajesh Sharma"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-rose-300 bg-rose-50/20 text-gray-900 focus:ring-rose-400 focus:border-rose-400"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    className="mt-1.5 text-xs text-rose-600 font-medium"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Field 2: Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  placeholder="e.g., rajesh.sharma@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-300 bg-rose-50/20 text-gray-900 focus:ring-rose-400 focus:border-rose-400"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-xs text-rose-600 font-medium"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Field 3: Mobile Number */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 text-sm font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={(e) => {
                      // Only allow numeric input up to 10 digits
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      e.target.value = digits;
                      handleInputChange(e);
                    }}
                    onBlur={handleBlur}
                    placeholder="9876543210"
                    aria-invalid={errors.mobile ? "true" : "false"}
                    aria-describedby={errors.mobile ? "mobile-error" : "mobile-hint"}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? "border-rose-300 bg-rose-50/20 text-gray-900 focus:ring-rose-400 focus:border-rose-400"
                        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="mt-1.5 flex justify-between items-center text-xs">
                  {errors.mobile ? (
                    <p id="mobile-error" className="text-rose-600 font-medium">
                      {errors.mobile}
                    </p>
                  ) : (
                    <p id="mobile-hint" className="text-gray-500">
                      Standard 10-digit mobile number for status SMS alerts.
                    </p>
                  )}
                  <span className="text-gray-400">
                    {formData.mobile.length}/10 digits
                  </span>
                </div>
              </div>

              {/* Field 4: Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : "password-hint"}
                    className={`w-full pl-4 pr-11 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-rose-300 bg-rose-50/20 text-gray-900 focus:ring-rose-400 focus:border-rose-400"
                        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? (
                      /* Eye Off Icon */
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="mt-1.5 text-xs text-rose-600 font-medium">
                    {errors.password}
                  </p>
                ) : (
                  <p id="password-hint" className="mt-1.5 text-xs text-gray-500">
                    Must be at least 8 characters long.
                  </p>
                )}
              </div>

              {/* Field 5: Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    className={`w-full pl-4 pr-11 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-rose-300 bg-rose-50/20 text-gray-900 focus:ring-rose-400 focus:border-rose-400"
                        : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="mt-1.5 text-xs text-rose-600 font-medium"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Field 6: Terms and Conditions Checkbox */}
              <div className="pt-1">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      aria-invalid={errors.agreeTerms ? "true" : "false"}
                      aria-describedby={errors.agreeTerms ? "agreeTerms-error" : undefined}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  </div>
                  <label
                    htmlFor="agreeTerms"
                    className="ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer select-none"
                  >
                    I agree to the{" "}
                    <span className="font-semibold text-blue-600 hover:underline">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-blue-600 hover:underline">
                      Privacy Policy
                    </span>{" "}
                    of GrievanceAI. <span className="text-rose-600">*</span>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p
                    id="agreeTerms-error"
                    className="mt-1.5 text-xs text-rose-600 font-medium"
                  >
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Validating Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="pt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
