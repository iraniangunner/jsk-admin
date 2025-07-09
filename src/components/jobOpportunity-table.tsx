"use client";

import { useState, useEffect } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Trash2,
  Loader2,
  TriangleAlert,
  ChevronRightIcon,
  ChevronLeftIcon,
  Edit,
  Plus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  getJobOpportunities,
  deleteJobOpportunity,
} from "@/hooks/use-jobOpportunity";
import { getJobCategories } from "@/hooks/use-jobCategory";
import { getJobCities } from "@/hooks/use-jobCity";
import type {
  JobOpportunity,
  JobOpportunityFilters,
} from "@/types/job-opportunity-types";

const formatDate = (dateString: any) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  } catch (e) {
    return dateString;
  }
};

export function JobOpportunityTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryId, setCategoryId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [forcePage, setForcePage] = useState<number | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);
  const { mutate: deleteJobOpportunityById, isPending: isDeleting } =
    deleteJobOpportunity();

  const searchParams: JobOpportunityFilters = {
    // page: page ? page : undefined,
    // per_page: itemsPerPage ? itemsPerPage : undefined,
    job_category_id: categoryId ? Number(categoryId) : undefined,
    city_id: cityId ? Number(cityId) : undefined,
  };

  const { data, isLoading, isError } = getJobOpportunities(searchParams);
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoryError,
  } = getJobCategories();
  const {
    data: cities,
    isLoading: citiesLoading,
    isError: citiesError,
  } = getJobCities();

  // const handlePageChange = (selectedItem: { selected: number }) => {
  //   setPage(selectedItem.selected + 1);
  //   setForcePage(undefined);
  // };

  const handleDelete = () => {
    if (jobIdToDelete === null) return;

    deleteJobOpportunityById(jobIdToDelete, {
      onSuccess: () => {
        toast.success("فرصت شغلی حذف شد");
        setShowDeleteDialog(false);
        setJobIdToDelete(null);
      },
      onError: (error: any) => {
        toast.error("مشکلی پیش آمده دوباره تلاش کنید");
        setShowDeleteDialog(false);
        setJobIdToDelete(null);
      },
    });
  };

  const columns: ColumnDef<JobOpportunity>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <div className="text-center">شماره</div>;
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            <CaretSortIcon className="ml-2 h-4 w-4" />
            عنوان شغل
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="text-center max-w-xs truncate"
          title={row.getValue("title")}
        >
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "title_en",
      header: ({ column }) => {
        return <div className="text-center">عنوان انگلیسی</div>;
      },
      cell: ({ row }) => (
        <div
          className="text-center max-w-xs truncate"
          title={row.getValue("title_en")}
        >
          {row.getValue("title_en") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "job_category",
      header: ({ column }) => {
        return <div className="text-center">دسته‌بندی</div>;
      },
      cell: ({ row }) => {
        const jobOpportunity = row.original;
        return (
          <div className="text-center">
            {jobOpportunity.job_category?.title || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "city",
      header: ({ column }) => {
        return <div className="text-center">شهر</div>;
      },
      cell: ({ row }) => {
        const jobOpportunity = row.original;
        return (
          <div className="text-center">{jobOpportunity.city?.title || "-"}</div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center w-full"
          >
            <CaretSortIcon className="ml-2 h-4 w-4" />
            تاریخ ایجاد
          </Button>
        );
      },
      cell: ({ row }) => {
        const created_at = row.getValue("created_at") as string;
        return <div className="text-center">{formatDate(created_at)}</div>;
      },
    },
    {
      id: "actions",
      header: ({ column }) => {
        return <div className="text-center">عملیات</div>;
      },
      cell: ({ row }) => {
        const jobOpportunity = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              title="ویرایش فرصت شغلی"
            >
              <Link
                href={`/job-opportunities/${jobOpportunity.id}/edit`}
                className="w-full h-full flex justify-center items-center"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">ویرایش فرصت شغلی</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowDeleteDialog(true);
                setJobIdToDelete(jobOpportunity.id);
              }}
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              title="حذف فرصت شغلی"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">حذف فرصت شغلی</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    // setPage(1);
    // setForcePage(0);
  };

  const handleCityChange = (value: string) => {
    setCityId(value);
    // setPage(1);
    // setForcePage(0);
  };

  const clearFilters = () => {
    setCategoryId("");
    setCityId("");
    // setPage(1);
    // setForcePage(0);
  };

  // useEffect(() => {
  //   if (forcePage !== undefined) {
  //     setForcePage(undefined);
  //   }
  // }, [forcePage]);

  return (
    <>
      <ToastContainer />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Hidden Dialog Title</DialogTitle>
            </VisuallyHidden>
            <DialogDescription className="sm:text-lg">
              آیا از حذف این فرصت شغلی اطمینان دارید؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-center">
            <Button
              variant="outline"
              className="cursor-pointer bg-transparent"
              onClick={() => {
                setShowDeleteDialog(false);
                setJobIdToDelete(null);
              }}
              disabled={isDeleting}
            >
              خیر
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  در حال حذف...
                </>
              ) : (
                "حذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full" dir="rtl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>مدیریت فرصت‌های شغلی</CardTitle>
              <CardDescription>
                لیست فرصت‌های شغلی ثبت شده در سیستم. برای مرتب‌سازی بر اساس
                تاریخ ثبت، روی ستون تاریخ ثبت کلیک کنید.
              </CardDescription>
            </div>
            <Link href="/job-opportunities/create">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                افزودن فرصت شغلی جدید
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="py-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full max-w-sm">
                  <Select
                    value={categoryId}
                    onValueChange={handleCategoryChange}
                    disabled={categoriesLoading}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="فیلتر بر اساس دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full max-w-sm">
                  <Select
                    value={cityId}
                    onValueChange={handleCityChange}
                    disabled={citiesLoading}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="فیلتر بر اساس شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => (
                        <SelectItem key={city.id} value={String(city.id)}>
                          {city.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(categoryId || cityId) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="cursor-pointer bg-transparent"
                  >
                    پاک کردن فیلترها
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="text-center">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24">
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="mr-2">در حال بارگذاری...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableCell colSpan={columns.length} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <TriangleAlert className="h-6 w-6" />
                        <span className="mr-2">مشکلی رخ داده...</span>
                      </div>
                    </TableCell>
                  ) : data && data.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        هیچ نتیجه‌ای یافت نشد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
