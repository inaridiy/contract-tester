import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useContractStore } from "@/store/contract-store";
import { ContractData } from "@/types/contract-data";
import { isJsonString } from "@/utils/validate";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  address: z.string().min(42, "Address must be 42 characters long").startsWith("0x"),
  abi: z.string().refine(isJsonString, "Must be a valid JSON string").optional(),
  json: z.string().refine(isJsonString, "Must be a valid JSON string").optional(),
});

export const ImportContractDataDialog: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const setContract = useContractStore((state) => state.setContract);
  const setSelectedContract = useContractStore((state) => state.setSelectedContract);
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!values.abi && !values.json) return;

    const contractData = {
      name: values.name,
      address: values.address,
      abi: values.abi ? JSON.parse(values.abi) : undefined,
      json: values.json ? JSON.parse(values.json) : undefined,
    } satisfies ContractData;

    setContract(contractData);
    setSelectedContract(contractData.name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Import New Contract</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Name</FormLabel>
                    <FormControl>
                      <Input placeholder="UniswapV2" {...field} />
                    </FormControl>
                    <FormDescription>This is the contract display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormDescription>This is the contract address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Tabs defaultValue="abi">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="abi">ABI</TabsTrigger>
                  <TabsTrigger value="json">JSON Input</TabsTrigger>
                  <TabsTrigger value="auto">Auto Load</TabsTrigger>
                </TabsList>
                <TabsContent value="abi">
                  <FormField
                    control={form.control}
                    name="abi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract ABI</FormLabel>
                        <FormControl>
                          <Textarea placeholder="{..." className="h-36" {...field} />
                        </FormControl>
                        <FormDescription>This is the contract ABI.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="json">
                  <FormField
                    control={form.control}
                    name="json"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standard JSON Input</FormLabel>
                        <FormControl>
                          <Textarea placeholder="{..." className="h-36" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the standard JSON input for contract deployment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="auto">
                  <p>No auto load available yet.</p>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button type="submit">Import</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
