"use client";

import FormSubmitBtn from "@/components/shared-ui/FormSubmitBtn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Database } from "types/supabase";
import { Subject } from "types/tableTypes";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  id: z.string(),
});

interface AddSubjectProps {
  isEditing?: boolean;
  initialValues?: Subject;
  refreshSubjects?: () => void;
}

const AddSubject = ({
  isEditing = false,
  initialValues = {
    id: "",
    name: "",
    description: "",
  },
  refreshSubjects,
}: AddSubjectProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues as any,
  });

  useEffect(() => {
    open && form.reset();
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const supabase = createClientComponentClient<Database>();
    if (isEditing) {
      let { status } = await supabase
        .from("subjects")
        .update(values)
        .eq("id", values.id);
      status === 204
        ? showSuccess("Subject updated successfully")
        : showError();
    } else {
      const { name, description } = values;
      let { status } = await supabase
        .from("subjects")
        .insert({ name, description });
      status === 201
        ? showSuccess("Subject created successfully")
        : showError();
    }
    refreshSubjects?.();
    setIsSubmitting(false);
    setOpen(false);
  }

  function showSuccess(msg: string) {
    toast({
      description: msg,
    });
  }

  function showError() {
    toast({
      variant: "destructive",
      description: "Something went wrong, please try again later.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        ) : (
          <Button className="ml-5">
            Add Subject <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} subject</DialogTitle>
          <DialogDescription>
            Add changes to subject here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="subject name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the subject name you want to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="subject description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the subject description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmitBtn isSubmitting={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubject;
