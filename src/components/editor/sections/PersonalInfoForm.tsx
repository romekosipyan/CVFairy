"use client";

import { useState } from "react";

import { PersonalInfo } from "@/lib/schemas/personal-info";
import { useResumeStore } from "@/lib/stores/resume-store";
import { fieldError } from "@/lib/utils/field-error";

import { SectionWrapper } from "./SectionWrapper";
import { TextField } from "./TextField";

import type { ReactElement } from "react";

type PersonalField =
  | "fullName"
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "website";

const FIELDS: {
  key: PersonalField;
  label: string;
  type: "text" | "email" | "tel" | "url";
}[] = [
  { key: "fullName", label: "Full name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "location", label: "Location", type: "text" },
  { key: "linkedin", label: "LinkedIn", type: "url" },
  { key: "website", label: "Website", type: "url" },
];

export function PersonalInfoForm(): ReactElement {
  const personalInfo = useResumeStore((state) => state.data.personalInfo);
  const setPersonalInfo = useResumeStore((state) => state.setPersonalInfo);
  const [errors, setErrors] = useState<Partial<Record<PersonalField, string>>>(
    {},
  );

  return (
    <SectionWrapper id="personalInfo" title="Personal info" draggable={false}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <TextField
            key={field.key}
            id={`personal-${field.key}`}
            label={field.label}
            type={field.type}
            value={personalInfo[field.key]}
            error={errors[field.key]}
            onChange={(value) => {
              setPersonalInfo({ [field.key]: value });
            }}
            onBlur={(value) => {
              const message = fieldError(PersonalInfo.shape[field.key], value);
              setErrors((current) => ({
                ...current,
                [field.key]: message ?? undefined,
              }));
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
