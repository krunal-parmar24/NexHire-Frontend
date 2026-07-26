import React, { useState } from "react";
import {
  ScreeningQuestion,
  ScreeningAnswer,
  ScreeningQuestionType,
} from "../../types/screeningQuestion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

export type DynamicFormRendererProps =
  | {
      mode: "builder";
      questions: ScreeningQuestion[];
      onChange: (questions: ScreeningQuestion[]) => void;
    }
  | { mode: "preview"; questions: ScreeningQuestion[] }
  | {
      mode: "fill";
      questions: ScreeningQuestion[];
      onSubmit: (answers: ScreeningAnswer[]) => void;
    };

const presetQuestions: ScreeningQuestion[] = [
  {
    id: "preset_exp",
    label: "Years of relevant experience",
    type: "numeric",
    required: true,
  },
  {
    id: "preset_auth",
    label: "Work authorization status",
    type: "single-select",
    required: true,
    options: ["Citizen", "Visa", "Require Sponsorship"],
  },
  {
    id: "preset_notice",
    label: "Notice period (days)",
    type: "numeric",
    required: true,
  },
];

const questionTypes: { label: string; value: ScreeningQuestionType }[] = [
  { label: "Text", value: "text" },
  { label: "Single Select", value: "single-select" },
  { label: "Multi Select", value: "multi-select" },
  { label: "File Upload", value: "file upload" },
  { label: "Yes/No", value: "yes/no" },
  { label: "Numeric", value: "numeric" },
];

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = (
  props
) => {
  const isBuilder = props.mode === "builder";
  const isPreview = props.mode === "preview";
  const isFill = props.mode === "fill";

  const [localAnswers, setLocalAnswers] = useState<
    Record<string, string | string[]>
  >({});

  const handleQuestionChange = (
    index: number,
    field: keyof ScreeningQuestion,
    value: ScreeningQuestion[keyof ScreeningQuestion]
  ) => {
    if (!isBuilder) return;
    const newQuestions = [...props.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    props.onChange(newQuestions);
  };

  const handleAddQuestion = () => {
    if (!isBuilder) return;
    const newQ: ScreeningQuestion = {
      id: `q_${Date.now()}`,
      label: "New Question",
      type: "text",
      required: false,
    };
    props.onChange([...props.questions, newQ]);
  };

  const handleAddPreset = (preset: ScreeningQuestion) => {
    if (!isBuilder) return;
    props.onChange([...props.questions, { ...preset, id: `q_${Date.now()}` }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (!isBuilder) return;
    const newQuestions = [...props.questions];
    newQuestions.splice(index, 1);
    props.onChange(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFill) return;

    // Validate required
    for (const q of props.questions) {
      if (q.required && !localAnswers[q.id]) {
        alert(`Please answer: ${q.label}`);
        return;
      }
    }

    const formattedAnswers: ScreeningAnswer[] = Object.entries(
      localAnswers
    ).map(([id, val]) => ({
      questionId: id,
      value: Array.isArray(val) ? val.join(", ") : (val as string),
    }));

    props.onSubmit(formattedAnswers);
  };

  const renderField = (q: ScreeningQuestion) => {
    const disabled = isPreview || isBuilder;
    const val = localAnswers[q.id];

    switch (q.type) {
      case "text":
        return (
          <InputText
            disabled={disabled}
            value={(val as string) || ""}
            onChange={(e) =>
              setLocalAnswers({ ...localAnswers, [q.id]: e.target.value })
            }
            className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-2.5 !shadow-none"
          />
        );
      case "numeric":
        return (
          <InputNumber
            disabled={disabled}
            value={val ? Number(val) : null}
            onValueChange={(e) =>
              setLocalAnswers({
                ...localAnswers,
                [q.id]: e.value?.toString() || "",
              })
            }
            className="w-full"
            inputClassName="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-2.5 !shadow-none"
          />
        );
      case "single-select":
        return (
          <Dropdown
            disabled={disabled}
            value={val}
            options={q.options || []}
            onChange={(e) =>
              setLocalAnswers({ ...localAnswers, [q.id]: e.value })
            }
            placeholder="Select an option"
            className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
          />
        );
      case "multi-select":
        return (
          <MultiSelect
            disabled={disabled}
            value={val || []}
            options={q.options || []}
            onChange={(e) =>
              setLocalAnswers({ ...localAnswers, [q.id]: e.value })
            }
            placeholder="Select options"
            className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
          />
        );
      case "yes/no":
        return (
          <div className="flex gap-6 mt-1">
            <div className="flex items-center">
              <RadioButton
                disabled={disabled}
                inputId={`${q.id}_yes`}
                value="Yes"
                onChange={(e) =>
                  setLocalAnswers({ ...localAnswers, [q.id]: e.value })
                }
                checked={val === "Yes"}
              />
              <label
                htmlFor={`${q.id}_yes`}
                className="ml-2 font-medium text-slate-700 cursor-pointer"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center">
              <RadioButton
                disabled={disabled}
                inputId={`${q.id}_no`}
                value="No"
                onChange={(e) =>
                  setLocalAnswers({ ...localAnswers, [q.id]: e.value })
                }
                checked={val === "No"}
              />
              <label
                htmlFor={`${q.id}_no`}
                className="ml-2 font-medium text-slate-700 cursor-pointer"
              >
                No
              </label>
            </div>
          </div>
        );
      case "file upload":
        return (
          <FileUpload
            disabled={disabled}
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*,application/pdf"
            maxFileSize={1000000}
            onSelect={() =>
              setLocalAnswers({ ...localAnswers, [q.id]: "uploaded_file.pdf" })
            }
            chooseOptions={{
              className:
                "!rounded-xl !bg-blue-50 !text-blue-700 !border-none hover:!bg-blue-100 font-bold",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm">
      {isBuilder && (
        <div className="mb-8 pb-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 m-0 mb-2">
            Screening Questions
          </h2>
          <p className="text-slate-500 mt-0 mb-6 text-sm">
            Add custom questions for applicants to answer when they apply.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              label="Add Custom Question"
              icon="pi pi-plus"
              onClick={handleAddQuestion}
              className="!bg-blue-50 !text-blue-700 !border-none hover:!bg-blue-100 font-bold rounded-xl px-4 py-2.5"
            />
            {presetQuestions.map((p) => (
              <Button
                type="button"
                key={p.id}
                label={`Add: ${p.label}`}
                onClick={() => handleAddPreset(p)}
                className="!bg-slate-50 !text-slate-600 !border-slate-200 hover:!bg-slate-100 font-semibold rounded-xl px-4 py-2.5"
              />
            ))}
          </div>
        </div>
      )}

      {isFill ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {renderQuestionsList()}
          {props.questions.length > 0 && (
            <Button
              type="submit"
              label="Submit Answers"
              className="mt-4 px-8 py-3 font-bold rounded-xl !bg-blue-600 !border-none hover:!bg-blue-700 text-white shadow-md shadow-blue-600/20 self-start"
            />
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-6">{renderQuestionsList()}</div>
      )}
    </div>
  );

  function renderQuestionsList() {
    return props.questions.map((q, idx) => (
      <div key={q.id} className="w-full">
        {isBuilder ? (
          <div className="p-6 border border-slate-200 rounded-2xl flex flex-col gap-5 bg-slate-50/50 relative group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">
                Question {idx + 1}
              </span>
              <Button
                type="button"
                icon="pi pi-trash"
                text
                rounded
                onClick={() => handleRemoveQuestion(idx)}
                className="!text-red-500 hover:!bg-red-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Label
                </label>
                <InputText
                  value={q.label}
                  onChange={(e) =>
                    handleQuestionChange(idx, "label", e.target.value)
                  }
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-2.5 !shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Type</label>
                <Dropdown
                  value={q.type}
                  options={questionTypes}
                  onChange={(e) => handleQuestionChange(idx, "type", e.value)}
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
                />
              </div>
            </div>

            {(q.type === "single-select" || q.type === "multi-select") && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Options (comma-separated)
                </label>
                <InputText
                  value={q.options?.join(", ") || ""}
                  onChange={(e) =>
                    handleQuestionChange(
                      idx,
                      "options",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-2.5 !shadow-none"
                />
              </div>
            )}

            <div className="flex items-center mt-2">
              <Checkbox
                inputId={`req_${q.id}`}
                checked={q.required}
                onChange={(e) =>
                  handleQuestionChange(idx, "required", e.checked)
                }
              />
              <label
                htmlFor={`req_${q.id}`}
                className="ml-2 font-medium text-slate-700 cursor-pointer"
              >
                Required
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              {q.label} {q.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(q)}
          </div>
        )}
      </div>
    ));
  }
};
