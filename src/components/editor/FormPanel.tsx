"use client";

import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils";

import { SectionSortable, SortableSectionItem } from "./SectionSortable";
import { EducationForm } from "./sections/EducationForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { SkillsForm } from "./sections/SkillsForm";
import { SummaryForm } from "./sections/SummaryForm";

import type { ReactElement } from "react";
import type { SectionId } from "@/lib/schemas";

interface FormPanelProps {
  className?: string;
}

const SECTION_FORMS: Record<SectionId, () => ReactElement> = {
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
};

export function FormPanel({ className }: FormPanelProps): ReactElement {
  const sectionOrder = useResumeStore((state) => state.data.sectionOrder);

  return (
    <section
      id="resume-form"
      aria-label="Resume form"
      className={cn("min-h-0 overflow-y-auto bg-background", className)}
    >
      <div className="flex flex-col gap-4 p-4">
        <PersonalInfoForm />
        <SectionSortable>
          {sectionOrder.map((sectionId, index) => {
            const Section = SECTION_FORMS[sectionId];
            return (
              <SortableSectionItem key={sectionId} id={sectionId} index={index}>
                <Section />
              </SortableSectionItem>
            );
          })}
        </SectionSortable>
      </div>
    </section>
  );
}
