import { useEffect } from "react";
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
import { SquareMousePointer, Trash } from "lucide-react";

import { setActiveNode } from "@/redux/slices/activeNodeSlice";
import { deleteNode, editNode } from "@/redux/slices/nodeSlice";
import { RootState } from "../redux/store";

const formSchema = z.object({
  label: z.string(),
  content: z.string(),
  type: z.string(),
  position: z.object({
    x: z.any(),
    y: z.any(),
  }),
});

const SettingsPanel = () => {
  const activeNode = useSelector((state: RootState) => state.activeNode);
  const dispatch = useDispatch();

  const defaultValues = {
    label: activeNode?.data?.label ?? "",
    content: activeNode?.data?.content ?? "",
    type: activeNode?.type ?? "",
    position: {
      x: activeNode?.position?.x ?? 0,
      y: activeNode?.position?.y ?? 0,
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (activeNode) {
      form.reset({
        label: activeNode?.data?.label ?? "",
        content: activeNode?.data?.content ?? "",
        type: activeNode?.type ?? "",
        position: {
          x: activeNode?.position?.x ?? 0,
          y: activeNode?.position?.y ?? 0,
        },
      });
    }
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
      position: {
        x: values.position.x,
        y: values.position.y,
      },
    };
    dispatch(editNode(_activeNode));
    dispatch(setActiveNode(_activeNode));
  }

  return activeNode.id ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <Button
          className="flex gap-3 items-center"
          variant="destructive"
          onClick={() => dispatch(deleteNode(activeNode.id))}
        >
          <p>Delete</p>
          <Trash className="h-4 w-4" />
        </Button>
        <p className="text-center uppercase font-bold text-xs text-muted-foreground">
          data
        </p>
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
              <Select
                key={field.value}
                onValueChange={field.onChange}
                defaultValue={activeNode.type}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="custom_node_1">Custom Node 1</SelectItem>
                  <SelectItem value="custom_node_2">Custom Node 2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <p className="text-center uppercase font-bold text-xs mt-4 text-muted-foreground">
          position
        </p>

        <FormField
          control={form.control}
          name="position.x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input placeholder="Position X" type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position.y"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Y</FormLabel>
              <FormControl>
                <Input placeholder="Position Y" type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  ) : (
    <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
      <SquareMousePointer className="h-16 w-16 " />
      <p className="font-semibold">Please select a node</p>
    </div>
  );
};

export default SettingsPanel;
