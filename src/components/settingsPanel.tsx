import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

import { editNodeAction } from "../redux/actions/nodeActions";
import { RootState } from "../redux/store";
import { setActiveNodeAction } from "../redux/actions/activeNodeActions";
import { useEffect } from "react";

const formSchema = z.object({
  label: z.string(),
  content: z.string(),
  type: z.string(),
});

const SettingsPanel = () => {
  const activeNode = useSelector((state: RootState) => state.activeNode);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: activeNode.data.label,
      content: activeNode.data.content,
      type: activeNode.type,
    },
  });

  useEffect(() => {
    form.reset({
      label: activeNode.data.label,
      content: activeNode.data.content,
      type: activeNode.type,
    });
  }, [activeNode, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const _activeNode = {
      ...activeNode,
      type: values.type,
      data: {
        ...activeNode.data,
        label: values.label,
        content: values.content,
      },
    };
    editNodeAction(dispatch, _activeNode);
    setActiveNodeAction(dispatch, _activeNode);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-4"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Content" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="example1">example1</SelectItem>
                  <SelectItem value="example2">example2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SettingsPanel;
