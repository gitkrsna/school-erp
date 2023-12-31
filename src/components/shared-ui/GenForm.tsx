"use client";

import FormSubmitBtn from "@/components/shared-ui/FormSubmitBtn";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormFieldType } from "types/appTypes";
import GenDatePicker from "./GenDatePicker";
import GenInput from "./GenInput";
import GenSelect from "./GenSelect";
import GenSearchableSelect from "./GenSearchableSelect";
import { GenSearchableMultiSelect } from "./GenSearchableMultiSelect";

const GenForm = ({
  form,
  onSubmit,
  isSubmitting,
  fields,
}: {
  form: UseFormReturn<FieldValues, any, undefined>;
  onSubmit: SubmitHandler<FieldValues>;
  isSubmitting: boolean;
  fields: FormFieldType[];
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, console.log)}
        className="space-y-8"
      >
        {fields.map(
          ({
            name,
            label,
            placeholder = "",
            description = "",
            fieldType = "input",
            controlType = "text",
            options,
          }: FormFieldType) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  {fieldType == "input" && (
                    <GenInput
                      disabled={isSubmitting}
                      placeholder={placeholder}
                      field={field}
                      controlType={controlType}
                    />
                  )}
                  {fieldType == "datepicker" && (
                    <GenDatePicker
                      disabled={isSubmitting}
                      placeholder={placeholder}
                      field={field}
                    />
                  )}
                  {fieldType == "select" && (
                    <GenSelect
                      disabled={isSubmitting}
                      placeholder={placeholder}
                      field={field}
                      options={options}
                    />
                  )}
                  {fieldType == "searchableSelect" && (
                    <GenSearchableSelect
                      disabled={isSubmitting}
                      placeholder={placeholder}
                      field={field}
                      options={options}
                      form={form}
                    />
                  )}
                  {fieldType == "multiSelect" && (
                    <GenSearchableMultiSelect
                      disabled={isSubmitting}
                      placeholder={placeholder}
                      field={field}
                      options={options}
                      form={form}
                    />
                  )}
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ),
        )}

        <FormSubmitBtn isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default GenForm;
