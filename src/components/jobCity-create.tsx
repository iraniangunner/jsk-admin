"use client";

import { CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createJobCity } from "@/hooks/use-jobCity";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "لطفا عنوان فارسی را وارد کنید")
    .max(16, "عنوان فارسی نباید بیشتر از 16 کاراکتر باشد"),
  title_en: z
    .string()
    .max(16, "عنوان انگلیسی نباید بیشتر از 16 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  order: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = Number(val);
        return num > 0 && num <= 255;
      },
      {
        message: "ترتیب نمایش باید بین 1 تا 255 باشد",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

export function CreateJobCity() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      title_en: "",
      order: "",
    },
  });

  // Create mutation
  const { mutate: createJobCityMutation, isPending: isSaving } =
    createJobCity();

  const onSubmit = async (values: FormData) => {
    try {
      // Prepare data object
      const data = {
        title: values.title.trim(),
        title_en: values.title_en?.trim() || undefined,
        order: values.order ? Number(values.order) : undefined,
      };

      // Call the create mutation
      createJobCityMutation(
        { data },
        {
          onSuccess: () => {
            toast.success("شهر با موفقیت ایجاد شد");
            // Navigate back to job cities list after successful creation
            setTimeout(() => {
              router.push("/job-cities");
            }, 1500);
          },
          onError: (error) => {
            console.error("Create failed:", error);
            toast.error("خطا در ایجاد شهر . لطفا دوباره تلاش کنید.");
          },
        }
      );
    } catch (err) {
      toast.error("خطا در ایجاد شهر . لطفا دوباره تلاش کنید.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-10 max-w-3xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ایجاد شهر</h1>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => router.push("/job-cities")}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              اطلاعات شهر را وارد کنید و دکمه ایجاد را بزنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">عنوان فارسی</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="عنوان فارسی شهر را وارد کنید"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان انگلیسی</FormLabel>
                        <FormControl>
                          <Input
                            dir="ltr"
                            placeholder="Enter English title (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-2" />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ترتیب نمایش</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ترتیب نمایش (اختیاری)"
                            min="1"
                            max="255"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          عدد کمتر، اولویت نمایش بالاتر
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="cursor-pointer px-8 py-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                "ایجاد شهر"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
